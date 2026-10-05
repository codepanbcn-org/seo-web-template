import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { routing } from "@/i18n/routing";
import { IS_INDEXABLE } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Site-wide defaults only. Canonical, hreflang and Open Graph depend on the
// page, so each page sets them through pageMetadata() (lib/seo.ts).
export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "site" });
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title: { default: t("title"), template: `%s | ${SITE_NAME}` },
    description: t("description"),
    ...(!IS_INDEXABLE && { robots: { index: false, follow: false } }),
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff", // TODO(setup)
};

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    // lang per locale: tells Google (and screen readers) the page language.
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <SiteHeader />
          {props.children}
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
