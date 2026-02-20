import type { Metadata } from 'next';
import { SiteShell } from '../components/site-shell';

export const metadata: Metadata = {
  title: 'Terms | Fluxorae',
};

export default function TermsPage() {
  return (
    <SiteShell>
      <section className="page-hero reveal">
        <h1>Terms Of Service</h1>
        <p className="hero-copy">
          Access to Fluxorae ERP is restricted to authorized users and governed by company policy.
        </p>
      </section>
    </SiteShell>
  );
}
