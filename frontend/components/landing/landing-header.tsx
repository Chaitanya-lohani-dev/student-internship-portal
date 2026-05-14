import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinkClass =
  "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          CampusConnect
        </Link>
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Primary"
        >
          <a href="#features" className={navLinkClass}>
            Features
          </a>
          <a href="#how-it-works" className={navLinkClass}>
            How it works
          </a>
          <a href="#audience" className={navLinkClass}>
            Students &amp; recruiters
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" className="hidden transition-colors sm:inline-flex" asChild>
            <Link href="/register">Get started</Link>
          </Button>
          <details className="relative md:hidden">
            <summary
              className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted [&::-webkit-details-marker]:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </summary>
            <nav
              className="absolute right-0 mt-2 w-52 rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-md"
              aria-label="Mobile primary"
            >
              <ul className="flex flex-col gap-1">
                <li>
                  <a
                    href="#features"
                    className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    How it works
                  </a>
                </li>
                <li>
                  <a
                    href="#audience"
                    className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    Students &amp; recruiters
                  </a>
                </li>
                <li className="mt-1 border-t border-border pt-2">
                  <Link
                    href="/login"
                    className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    Get started
                  </Link>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export function LandingSkipLink({ className }: { className?: string }) {
  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none",
        className
      )}
    >
      Skip to main content
    </a>
  );
}
