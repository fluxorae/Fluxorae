import type { Metadata } from 'next';
import { SiteShell } from '../components/site-shell';

export const metadata: Metadata = {
  title: 'Careers | Fluxorae',
  description: 'Open roles at Fluxorae.',
};

const roles = [
  'Senior Full-Stack Engineer',
  'ERP Implementation Consultant',
  'DevOps Engineer',
];

export default function CareersPage() {
  return (
    <SiteShell>
      <section className="page-hero reveal">
        <p className="eyebrow">Careers</p>
        <h1>Build systems used every day</h1>
        <p className="hero-copy">
          We ship software with ownership, measured impact, and production responsibility.
        </p>
      </section>

      <section className="grid grid-3">
        {roles.map((role, index) => (
          <article key={role} className="card reveal" style={{ animationDelay: `${index * 80}ms` }}>
            <h3>{role}</h3>
            <p className="muted">Remote-first, full-time, India timezone overlap.</p>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
