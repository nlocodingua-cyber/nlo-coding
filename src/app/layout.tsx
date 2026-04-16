import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NLO Coding — SaaS, автоматизації та AI-агенти для бізнесу",
  description:
    "Будуємо легендарні SaaS, бізнес-автоматизації та AI-агентів за тижні, не роки. Vibe Coding + NoCode/LowCode/OpenAI = швидка розробка, реальний результат.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nlocoding.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
