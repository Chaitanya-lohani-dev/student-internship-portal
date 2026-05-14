import Link from "next/link";

import { Button } from "@/components/ui/button";

export function LandingCta() {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-muted/30 px-8 py-12 text-center sm:px-12 lg:px-16">
          <h2
            id="cta-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            Join CampusConnect
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground sm:text-lg">
            Whether you are launching your career or building your next intern
            class, CampusConnect helps you move forward with clarity and
            confidence.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="transition-colors" asChild>
              <Link href="/student/jobs">I am a student</Link>
            </Button>
            <Button size="lg" variant="outline" className="transition-colors" asChild>
              <Link href="/login">I am a recruiter</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
