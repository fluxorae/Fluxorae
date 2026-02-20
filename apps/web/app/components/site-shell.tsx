import Link from 'next/link';

const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
  { href: '/app', label: 'ERP Portal' },
];

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="site-root">
      <div className="aura aura-left" />
      <div className="aura aura-right" />

      <header className="site-header shell">
        <Link href="/" className="brand">
          Fluxorae
        </Link>
        <nav className="nav">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/app/login" className="button button-ghost">
          Portal Login
        </Link>
      </header>

      <main className="shell">{children}</main>

      <footer className="site-footer shell">
        <div>
          <strong>Fluxorae Private Limited</strong>
          <p className="muted">
            Unified ERP for CRM, HR, projects, finance, and support.
          </p>
        </div>
        <div className="footer-links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
