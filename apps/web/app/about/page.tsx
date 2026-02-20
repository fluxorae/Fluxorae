import type { Metadata } from 'next';
import { SiteShell } from '../components/site-shell';

export const metadata: Metadata = {
  title: 'About | Fluxorae',
  description: 'Fluxorae builds operating systems for modern service and operations teams.',
};

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="page-hero reveal">
        <p className="eyebrow">About Fluxorae</p>
        <h1>From fragmented tools to operational clarity</h1>
        <p className="hero-copy">
          We build systems where sales, HR, delivery, finance, and support move with
          shared context, shared controls, and shared metrics.
        </p>
      </section>

      <section className="grid grid-2">
        <article className="card reveal">
          <h3>Principles</h3>
          <p className="muted">
            Security-first architecture, role-based governance, and zero hidden data
            silos across modules.
          </p>
        </article>
        <article className="card reveal" style={{ animationDelay: '80ms' }}>
          <h3>Execution</h3>
          <p className="muted">
            Delivery includes migration, rollout sequencing, and go-live support with
            measurable operational KPIs.
          </p>
        </article>
      </section>
    </SiteShell>
  );
}
