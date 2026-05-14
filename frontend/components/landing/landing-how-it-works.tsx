export function LandingHowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Create Profile",
      body: "Add your background, skills, and preferences so opportunities match your path.",
    },
    {
      step: "2",
      title: "Apply to Opportunities",
      body: "Discover internships and roles, then apply with a consistent, guided flow.",
    },
    {
      step: "3",
      title: "Track Applications",
      body: "Follow progress in one dashboard—from submitted to reviewed and beyond.",
    },
  ] as const;

  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-b border-border/60 bg-muted/20 py-16 sm:py-20 lg:py-24"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2
          id="how-heading"
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          How it works
        </h2>
        <p className="mt-4 max-w-2xl text-pretty text-muted-foreground sm:text-lg">
          A straightforward flow for students—no steep learning curve.
        </p>
        <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {steps.map(({ step, title, body }) => (
            <li key={step} className="relative">
              <div className="flex flex-col gap-4">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold text-foreground">
                  {step}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
