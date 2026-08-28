import { setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { Solution } from "@/components/landing/Solution";
import { Services } from "@/components/landing/Services";
import { Process } from "@/components/landing/Process";
import { Proof } from "@/components/landing/Proof";
import { EcosystemSection } from "@/components/landing/EcosystemSection";
import { BlogSection } from "@/components/landing/BlogSection";
import { FounderBlock } from "@/components/landing/FounderBlock";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";

import type { Metadata } from "next";
import { pageAlternates } from "@/lib/seo/blog";

/** Головна сама називає свою адресу — layout цього зробити не може. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: pageAlternates(locale) };
}


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
        <EcosystemSection locale={locale} />
        <FounderBlock />
        <FAQ />
        <BlogSection locale={locale} />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
