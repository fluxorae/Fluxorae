import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteShell } from '../components/site-shell';

export const metadata: Metadata = {
  title: 'ERP Portal | Fluxorae',
  description: 'Secure ERP portal for internal teams and approved clients.',
};

const modules = [
  'CRM',
  'Attendance',
  'HR',
  'Projects',
  'Finance',
  'Support',
  'Admin',
  'Reports',
];

export default function PortalHomePage() {
  return (
    <SiteShell>
      <section className="page-hero reveal">
        <p className="eyebrow">Fluxorae.com/app</p>
        <h1>Secure ERP Portal</h1>
        <p className="hero-copy">
          Module access is controlled by role, permission key, and audit trail.
        </p>
        <Link href="/app/login" className="button">
          Login To Portal
        </Link>
      </section>

      <section className="grid grid-4">
        {modules.map((module, index) => (
          <article key={module} className="card reveal" style={{ animationDelay: `${index * 60}ms` }}>
            <h3>{module}</h3>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
