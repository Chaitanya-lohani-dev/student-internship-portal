export function LandingAudience() {
  return (
    <section
      id="audience"
      className="scroll-mt-20 border-b border-border/60 py-16 sm:py-20 lg:py-24"
      aria-labelledby="audience-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2
          id="audience-heading"
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          For students and recruiters
        </h2>
        <p className="mt-4 max-w-2xl text-pretty text-muted-foreground sm:text-lg">
          One platform with tailored experiences for each side of campus hiring.
        </p>
        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <article className="rounded-xl border border-border/80 bg-card p-8 shadow-sm transition-colors hover:border-foreground/15">
            <h3 className="text-lg font-semibold text-foreground">Students</h3>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <li>Central place to explore internships and early-career roles.</li>
              <li>Clear application steps and document handling.</li>
              <li>Visibility into status so you are never left guessing.</li>
              <li>Designed to complement academic schedules and advising workflows.</li>
            </ul>
          </article>
          <article className="rounded-xl border border-border/80 bg-card p-8 shadow-sm transition-colors hover:border-foreground/15">
            <h3 className="text-lg font-semibold text-foreground">Recruiters</h3>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <li>Publish and manage listings with consistent structure.</li>
              <li>Review applicants with the context you need to decide faster.</li>
              <li>Coordinate with your team on a single, auditable pipeline.</li>
              <li>Professional experience that reflects your employer brand.</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
