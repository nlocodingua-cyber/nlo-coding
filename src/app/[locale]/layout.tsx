import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import { routing } from "@/i18n/routing";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "cyrillic"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "uk" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster
            position="bottom-right"
            theme="dark"
            richColors
            toastOptions={{
              style: {
                background: "rgba(12, 15, 26, 0.95)",
                border: "1px solid rgba(0, 240, 255, 0.1)",
                backdropFilter: "blur(20px)",
                color: "#e2e8f0",
              },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
