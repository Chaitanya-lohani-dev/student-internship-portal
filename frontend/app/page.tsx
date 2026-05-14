import type { Metadata } from "next";

import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "Home",
  description:
    "CampusConnect connects students with career opportunities. Discover internships, apply with confidence, and track applications alongside recruiter tools.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CampusConnect — Student Internships & Career Management",
    description:
      "Modern internship and career management platform for students and recruiters.",
    url: "https://careers.chaitanya-lohani.me",
  },
};

export default function HomePage() {
  return <LandingPage />;
}
