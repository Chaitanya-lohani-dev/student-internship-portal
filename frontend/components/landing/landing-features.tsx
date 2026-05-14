import {
  Briefcase,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LayoutTemplate,
  Shield,
} from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Internship Discovery",
    description:
      "Browse curated roles aligned with your program, skills, and career goals.",
    icon: Briefcase,
  },
  {
    title: "Student Applications",
    description:
      "Submit structured applications with documents and status visibility in one place.",
    icon: FileText,
  },
  {
    title: "Recruiter Dashboard",
    description:
      "Manage postings, review candidates, and collaborate with your hiring team.",
    icon: LayoutDashboard,
  },
  {
    title: "Real-time Application Tracking",
    description:
      "See where each application stands from submission through decision.",
    icon: ClipboardList,
  },
  {
    title: "Secure Authentication",
    description:
      "Role-aware access so students and recruiters only see what they should.",
    icon: Shield,
  },
  {
    title: "Fast & Modern UI",
    description:
      "A responsive interface built for clarity, speed, and everyday use.",
    icon: LayoutTemplate,
  },
] as const;

export function LandingFeatures() {
  return (
    <section
      id="features"
      className="scroll-mt-20 border-b border-border/60 py-16 sm:py-20 lg:py-24"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2
            id="features-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            Built for the full hiring journey
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground sm:text-lg">
            Everything you need to discover roles, apply with confidence, and
            manage recruiting workflows—without unnecessary complexity.
          </p>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description, icon: Icon }) => (
            <li key={title}>
              <Card className="h-full border-border/80 py-0 shadow-none transition-colors hover:border-foreground/15 hover:bg-muted/20">
                <CardHeader className="gap-4 pb-6 pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-base font-semibold leading-snug">
                      {title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
