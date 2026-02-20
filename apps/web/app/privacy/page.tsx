import type { Metadata } from 'next';
import { SiteShell } from '../components/site-shell';

export const metadata: Metadata = {
  title: 'Privacy | Fluxorae',
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <section className="page-hero reveal">
        <h1>Privacy Policy</h1>
        <p className="hero-copy">
          Fluxorae stores operational data with role-based access controls and audit logs.
        </p>
      </section>
    </SiteShell>
  );
}
