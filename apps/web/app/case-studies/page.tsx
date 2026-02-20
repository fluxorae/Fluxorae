import type { Metadata } from 'next';
import { SiteShell } from '../components/site-shell';

export const metadata: Metadata = {
  title: 'Case Studies | Fluxorae',
  description: 'Sample outcomes from Fluxorae ERP deployments.',
};

const studies = [
  {
    name: 'Professional Services Firm',
    result: 'Lead response time reduced by 54% in 8 weeks.',
  },
  {
    name: 'Product Support Team',
    result: 'SLA breach rate dropped from 18% to 3.2%.',
  },
  {
    name: 'Operations Organization',
    result: 'Invoice cycle time reduced from 9 days to 2.4 days.',
  },
];

export default function CaseStudiesPage() {
  return (
    <SiteShell>
      <section className="page-hero reveal">
        <p className="eyebrow">Case Studies</p>
        <h1>Measured outcomes, not vanity dashboards</h1>
      </section>

      <section className="grid grid-3">
        {studies.map((study, index) => (
          <article key={study.name} className="card reveal" style={{ animationDelay: `${index * 80}ms` }}>
            <h3>{study.name}</h3>
            <p className="muted">{study.result}</p>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
