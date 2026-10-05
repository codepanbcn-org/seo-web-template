import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import JsonLd from "@/components/JsonLd";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { businesses } from "@/lib/site";
import { localBusinessSchema, organizationSchema, websiteSchema } from "@/lib/structuredData";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "site" });
  // Absolute title: the home title usually starts with the brand already.
  return pageMetadata({ locale, path: "", title: t("title"), description: t("description"), absoluteTitle: true });
}

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  // Organization + WebSite on the home page only; plus the business whose
  // page is the home page, if any (single-location projects).
  const schemas = [
    organizationSchema(),
    websiteSchema(),
    ...businesses.filter((b) => b.path === "").map((b) => localBusinessSchema(b, locale)),
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <JsonLd data={schemas} />
      {/* Exactly one h1 per page. */}
      <h1 className="text-4xl font-bold">{t("heading")}</h1>
      <p className="mt-4 max-w-2xl text-lg">{t("intro")}</p>
      <Link href="/about" className="mt-8 inline-block rounded-full bg-neutral-900 px-6 py-3 text-white">
        {t("cta")}
      </Link>
    </main>
  );
}
