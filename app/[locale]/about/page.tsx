import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structuredData";

// Reference page: copy this file to create a new indexable page, then add its
// path to INDEXED_PATHS (lib/site.ts) and link it from the navigation.
const PATH = "/about";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({ locale, path: PATH, title: t("metaTitle"), description: t("metaDescription") });
}

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tNav = await getTranslations("nav");

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: tNav("home"), path: "" },
          { name: t("heading"), path: PATH },
        ])}
      />
      <h1 className="text-3xl font-bold">{t("heading")}</h1>
      <p className="mt-6 leading-relaxed">{t("body")}</p>
    </main>
  );
}
