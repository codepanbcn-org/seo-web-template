import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";

// Reference noindex page: reachable and linked from the footer, but kept out
// of search results (otherwise legal pages can take sitelink slots). Not in
// INDEXED_PATHS, so it is not in the sitemap either.
export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return pageMetadata({ locale, path: "/legal/privacy-policy", title: t("metaTitle"), noindex: true });
}

export default async function PrivacyPolicyPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">{t("heading")}</h1>
      <p className="mt-6 leading-relaxed">{t("body")}</p>
    </main>
  );
}
