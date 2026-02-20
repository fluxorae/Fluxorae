import type { Metadata } from 'next';
import { LeadCaptureForm } from '../components/lead-capture-form';
import { SiteShell } from '../components/site-shell';

export const metadata: Metadata = {
  title: 'Contact | Fluxorae',
  description: 'Contact Fluxorae for ERP implementation and operations automation.',
};

export default function ContactPage() {
  return (
    <SiteShell>
      <section className="page-hero reveal">
        <p className="eyebrow">Contact</p>
        <h1>Tell us what must be fixed first</h1>
        <p className="hero-copy">
          Share your current bottlenecks and we will map an implementation path.
        </p>
      </section>

      <LeadCaptureForm />
    </SiteShell>
  );
}
