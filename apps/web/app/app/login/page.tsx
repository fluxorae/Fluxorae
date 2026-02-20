import type { Metadata } from 'next';
import { LoginForm } from '../../components/login-form';
import { SiteShell } from '../../components/site-shell';

export const metadata: Metadata = {
  title: 'Portal Login | Fluxorae',
  description: 'Authenticate into the Fluxorae ERP portal.',
};

export default function PortalLoginPage() {
  return (
    <SiteShell>
      <section className="page-hero reveal">
        <p className="eyebrow">ERP Authentication</p>
        <h1>Sign In To Continue</h1>
      </section>
      <LoginForm />
    </SiteShell>
  );
}
