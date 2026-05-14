import Link from "next/link";

const footerLinks = [
  { label: "Privacy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
  { label: "Contact", href: "#contact" },
] as const;

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/80 bg-muted/20">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <Link
            href="/"
            className="text-base font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
          >
            CampusConnect
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            © {year} CampusConnect. All rights reserved.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {footerLinks.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
