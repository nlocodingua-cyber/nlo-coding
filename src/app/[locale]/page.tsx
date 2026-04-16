import { setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { Solution } from "@/components/landing/Solution";
import { Services } from "@/components/landing/Services";
import { Process } from "@/components/landing/Process";
import { Proof } from "@/components/landing/Proof";
import { EcosystemLink } from "@/components/landing/EcosystemLink";
import { FounderBlock } from "@/components/landing/FounderBlock";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Services />
        <Process />
        <Proof />
        <EcosystemLink />
        <FounderBlock />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
