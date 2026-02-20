import type { Metadata } from 'next';
import { SiteShell } from '../components/site-shell';

export const metadata: Metadata = {
  title: 'Services | Fluxorae',
  description: 'Implementation, migration, automation, and managed operations services.',
};

const offerings = [
  {
    title: 'ERP Implementation',
    detail: 'Module setup for CRM, HR, projects, finance, support, and admin controls.',
  },
  {
    title: 'Workflow Automation',
    detail: 'Approvals, reminders, lead routing, SLA handling, and billing events.',
  },
  {
    title: 'Data Migration',
    detail: 'Secure migration from spreadsheets and legacy CRMs into Fluxorae schema.',
  },
  {
    title: 'Managed Operations',
    detail: 'Runbooks, monitoring, backups, and monthly optimization cycles.',
  },
];

export default function ServicesPage() {
  return (
    <SiteShell>
      <section className="page-hero reveal">
        <p className="eyebrow">Services</p>
        <h1>Deployment + Operations Support</h1>
        <p className="hero-copy">
          Fluxorae is delivered with implementation and run support, not just software.
        </p>
      </section>

      <section className="grid grid-2">
        {offerings.map((item, index) => (
          <article key={item.title} className="card reveal" style={{ animationDelay: `${index * 60}ms` }}>
            <h3>{item.title}</h3>
            <p className="muted">{item.detail}</p>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
