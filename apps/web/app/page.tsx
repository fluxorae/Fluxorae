import Link from 'next/link';
import { LeadCaptureForm } from './components/lead-capture-form';
import { SiteShell } from './components/site-shell';

const modules = [
  'CRM and Sales',
  'Attendance and HR',
  'Projects and Tasks',
  'Finance and Invoicing',
  'Support Helpdesk',
  'Admin and Audit Controls',
];

export default function HomePage() {
  return (
    <SiteShell>
      <section className="hero reveal">
        <p className="eyebrow">Fluxorae OS</p>
        <h1>Run the company on one secure operating layer.</h1>
        <p className="hero-copy">
          Fluxorae merges growth, delivery, people operations, finance, and support
          without splitting your team across disconnected tools.
        </p>
        <div className="hero-actions">
          <Link href="/app" className="button">
            Open ERP Portal
          </Link>
          <Link href="/services" className="button button-ghost">
            Explore Services
          </Link>
        </div>
      </section>

      <section className="grid grid-3">
        {modules.map((module, index) => (
          <article key={module} className="card reveal" style={{ animationDelay: `${index * 80}ms` }}>
            <h3>{module}</h3>
            <p className="muted">
              Production workflows with role-based access and immutable audit trails.
            </p>
          </article>
        ))}
      </section>

      <LeadCaptureForm />
    </SiteShell>
  );
}
