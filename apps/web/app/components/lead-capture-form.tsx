'use client';

import { FormEvent, useMemo, useState } from 'react';
import { buildApiUrl } from '../lib/api';

type LeadPayload = {
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  companyName?: string;
  message?: string;
};

const initialPayload: LeadPayload = {
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  companyName: '',
  message: '',
};

export function LeadCaptureForm() {
  const [payload, setPayload] = useState<LeadPayload>(initialPayload);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const endpoint = useMemo(() => buildApiUrl('/crm/leads/website'), []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!payload.contactName.trim()) {
      setStatus('error');
      setStatusMessage('Contact name is required.');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');
    setStatusMessage('');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactName: payload.contactName.trim(),
          contactEmail: payload.contactEmail?.trim() || undefined,
          contactPhone: payload.contactPhone?.trim() || undefined,
          companyName: payload.companyName?.trim() || undefined,
          message: payload.message?.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as
          | { message?: string | string[] }
          | null;
        const message = Array.isArray(error?.message)
          ? error?.message.join(', ')
          : error?.message;
        throw new Error(message || 'Unable to submit lead right now.');
      }

      setPayload(initialPayload);
      setStatus('success');
      setStatusMessage('Thanks. Your request is in the CRM pipeline.');
    } catch (error) {
      setStatus('error');
      setStatusMessage(
        error instanceof Error
          ? error.message
          : 'Unexpected error while submitting your request.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="card form-card reveal">
      <h3>Start With A Lead Intake</h3>
      <p className="muted">This form writes directly into Fluxorae CRM.</p>
      <form onSubmit={onSubmit} className="form-grid">
        <label>
          Name
          <input
            value={payload.contactName}
            onChange={(event) =>
              setPayload((current) => ({
                ...current,
                contactName: event.target.value,
              }))
            }
            autoComplete="name"
            placeholder="Your full name"
            required
          />
        </label>

        <label>
          Email
          <input
            value={payload.contactEmail}
            onChange={(event) =>
              setPayload((current) => ({
                ...current,
                contactEmail: event.target.value,
              }))
            }
            autoComplete="email"
            placeholder="you@company.com"
            type="email"
          />
        </label>

        <label>
          Phone
          <input
            value={payload.contactPhone}
            onChange={(event) =>
              setPayload((current) => ({
                ...current,
                contactPhone: event.target.value,
              }))
            }
            autoComplete="tel"
            placeholder="+91 98xxxxxx"
          />
        </label>

        <label>
          Company
          <input
            value={payload.companyName}
            onChange={(event) =>
              setPayload((current) => ({
                ...current,
                companyName: event.target.value,
              }))
            }
            placeholder="Company name"
          />
        </label>

        <label className="full">
          Message
          <textarea
            value={payload.message}
            onChange={(event) =>
              setPayload((current) => ({
                ...current,
                message: event.target.value,
              }))
            }
            placeholder="What do you want to automate first?"
            rows={4}
          />
        </label>

        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Capture Lead'}
        </button>
      </form>
      {status !== 'idle' ? (
        <p className={status === 'success' ? 'status-ok' : 'status-error'}>
          {statusMessage}
        </p>
      ) : null}
    </section>
  );
}
