import Link from "next/link";

import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section
      className="border-b border-border/60 bg-muted/30"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          CampusConnect
        </p>
        <h1
          id="hero-heading"
          className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
        >
          Connecting Students with Career Opportunities
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Modern internship and career management platform for students and
          recruiters.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button size="lg" className="transition-colors" asChild>
            <Link href="/student/jobs">Explore Opportunities</Link>
          </Button>
          <Button size="lg" variant="outline" className="transition-colors" asChild>
            <Link href="/login">Recruit Talent</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
