import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LeaveStatus, Prisma, SystemRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AuditService } from '../audit/audit.service';
import { AuthUser } from '../common/types/auth-user.type';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { DecideLeaveRequestDto } from './dto/decide-leave-request.dto';

const HR_ACCESS_ROLES = new Set<SystemRole>([
  SystemRole.SUPER_ADMIN,
  SystemRole.ADMIN_OPS,
  SystemRole.HR_MANAGER,
]);

@Injectable()
export class HrService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async createEmployee(actor: AuthUser, dto: CreateEmployeeDto) {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already exists.');
    }

    if (
      dto.role &&
      (dto.role === SystemRole.SUPER_ADMIN || dto.role === SystemRole.ADMIN_OPS) &&
      actor.role !== SystemRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException('Only super admin can assign privileged roles.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        companyId: actor.companyId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email,
        passwordHash,
        role: dto.role ?? SystemRole.EMPLOYEE,
        employeeProfile: {
          create: {
            designation: dto.designation,
            employeeCode: dto.employeeCode,
            joiningDate: new Date(),
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        employeeProfile: true,
      },
    });

    await this.audit.log({
      companyId: actor.companyId,
      actorId: actor.id,
      action: 'hr.employee.create',
      entityType: 'User',
      entityId: user.id,
      metadata: {
        role: user.role,
      },
    });

    return user;
  }

  async listEmployees(actor: AuthUser) {
    return this.prisma.user.findMany({
      where: { companyId: actor.companyId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        department: { select: { id: true, name: true, code: true } },
        employeeProfile: true,
      },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
      take: 500,
    });
  }

  async listLeaveTypes(actor: AuthUser) {
    await this.ensureDefaultLeaveTypes(actor.companyId);

    return this.prisma.leaveType.findMany({
      where: { companyId: actor.companyId, isActive: true },
      orderBy: { code: 'asc' },
    });
  }

  async createLeaveRequest(actor: AuthUser, dto: CreateLeaveRequestDto) {
    await this.ensureDefaultLeaveTypes(actor.companyId);

    const leaveType = await this.prisma.leaveType.findFirst({
      where: {
        companyId: actor.companyId,
        code: dto.leaveTypeCode.toUpperCase(),
        isActive: true,
      },
    });

    if (!leaveType) {
      throw new NotFoundException('Leave type not found.');
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid leave dates.');
    }

    if (endDate < startDate) {
      throw new BadRequestException('End date must be after start date.');
    }

    const days = this.calculateLeaveDays(startDate, endDate);

    const leaveRequest = await this.prisma.leaveRequest.create({
      data: {
        companyId: actor.companyId,
        userId: actor.id,
        leaveTypeId: leaveType.id,
        startDate,
        endDate,
        days: new Prisma.Decimal(days),
        reason: dto.reason,
      },
      include: {
        leaveType: {
          select: { code: true, name: true },
        },
      },
    });

    await this.audit.log({
      companyId: actor.companyId,
      actorId: actor.id,
      action: 'hr.leave.request_create',
      entityType: 'LeaveRequest',
      entityId: leaveRequest.id,
      metadata: {
        leaveType: leaveType.code,
        days,
      },
    });

    return leaveRequest;
  }

  async listMyLeaveRequests(actor: AuthUser) {
    return this.prisma.leaveRequest.findMany({
      where: {
        companyId: actor.companyId,
        userId: actor.id,
      },
      include: {
        leaveType: { select: { code: true, name: true } },
        approver: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async listPendingLeaveRequests(actor: AuthUser) {
    if (!HR_ACCESS_ROLES.has(actor.role)) {
      throw new ForbiddenException('Not allowed to view pending leaves.');
    }

    return this.prisma.leaveRequest.findMany({
      where: {
        companyId: actor.companyId,
        status: LeaveStatus.PENDING,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        leaveType: {
          select: { code: true, name: true },
        },
      },
      orderBy: { createdAt: 'asc' },
      take: 200,
    });
  }

  async decideLeaveRequest(actor: AuthUser, leaveId: string, dto: DecideLeaveRequestDto) {
    if (!HR_ACCESS_ROLES.has(actor.role)) {
      throw new ForbiddenException('Not allowed to decide leave requests.');
    }

    if (dto.status !== LeaveStatus.APPROVED && dto.status !== LeaveStatus.REJECTED) {
      throw new BadRequestException('Status must be APPROVED or REJECTED.');
    }

    const leaveRequest = await this.prisma.leaveRequest.findFirst({
      where: {
        id: leaveId,
        companyId: actor.companyId,
      },
      include: {
        leaveType: true,
      },
    });

    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found.');
    }

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Leave request is already processed.');
    }

    const days = Number(leaveRequest.days);

    if (dto.status === LeaveStatus.APPROVED && leaveRequest.leaveType.code !== 'UNPAID') {
      const year = leaveRequest.startDate.getUTCFullYear();

      const existing = await this.prisma.leaveBalance.findUnique({
        where: {
          userId_leaveTypeId_year: {
            userId: leaveRequest.userId,
            leaveTypeId: leaveRequest.leaveTypeId,
            year,
          },
        },
      });

      if (!existing) {
        if (leaveRequest.leaveType.annualAllocation < days) {
          throw new BadRequestException('Leave balance is insufficient.');
        }

        await this.prisma.leaveBalance.create({
          data: {
            companyId: actor.companyId,
            userId: leaveRequest.userId,
            leaveTypeId: leaveRequest.leaveTypeId,
            year,
            openingBalance: leaveRequest.leaveType.annualAllocation,
            used: days,
            remaining: leaveRequest.leaveType.annualAllocation - days,
          },
        });
      } else {
        if (existing.remaining < days) {
          throw new BadRequestException('Leave balance is insufficient.');
        }

        await this.prisma.leaveBalance.update({
          where: { id: existing.id },
          data: {
            used: existing.used + days,
            remaining: existing.remaining - days,
          },
        });
      }
    }

    const updated = await this.prisma.leaveRequest.update({
      where: { id: leaveRequest.id },
      data: {
        status: dto.status,
        approverId: actor.id,
        approvalRemarks: dto.remarks,
        decidedAt: new Date(),
      },
      include: {
        leaveType: { select: { code: true, name: true } },
        approver: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    await this.audit.log({
      companyId: actor.companyId,
      actorId: actor.id,
      action: 'hr.leave.decision',
      entityType: 'LeaveRequest',
      entityId: leaveRequest.id,
      metadata: {
        decision: dto.status,
      },
    });

    return updated;
  }

  private calculateLeaveDays(startDate: Date, endDate: Date) {
    const normalizedStart = Date.UTC(
      startDate.getUTCFullYear(),
      startDate.getUTCMonth(),
      startDate.getUTCDate(),
    );
    const normalizedEnd = Date.UTC(
      endDate.getUTCFullYear(),
      endDate.getUTCMonth(),
      endDate.getUTCDate(),
    );

    return Math.floor((normalizedEnd - normalizedStart) / 86400000) + 1;
  }

  private async ensureDefaultLeaveTypes(companyId: string) {
    const defaults = [
      { code: 'CL', name: 'Casual Leave', annualAllocation: 12 },
      { code: 'SL', name: 'Sick Leave', annualAllocation: 12 },
      { code: 'PL', name: 'Privilege Leave', annualAllocation: 18 },
      { code: 'UNPAID', name: 'Unpaid Leave', annualAllocation: 0 },
    ];

    await Promise.all(
      defaults.map((item) =>
        this.prisma.leaveType.upsert({
          where: {
            companyId_code: {
              companyId,
              code: item.code,
            },
          },
          update: {
            name: item.name,
            annualAllocation: item.annualAllocation,
            isActive: true,
          },
          create: {
            companyId,
            code: item.code,
            name: item.name,
            annualAllocation: item.annualAllocation,
          },
        }),
      ),
    );
  }
}
