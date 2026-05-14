import { LandingAudience } from "./landing-audience";
import { LandingCta } from "./landing-cta";
import { LandingFeatures } from "./landing-features";
import { LandingFooter } from "./landing-footer";
import { LandingHeader, LandingSkipLink } from "./landing-header";
import { LandingHero } from "./landing-hero";
import { LandingHowItWorks } from "./landing-how-it-works";
import { LandingJsonLd } from "./landing-json-ld";

export function LandingPage() {
  return (
    <>
      <LandingJsonLd />
      <LandingSkipLink />
      <LandingHeader />
      <main id="main-content">
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingAudience />
        <LandingCta />
      </main>
      <LandingFooter />
    </>
  );
}
