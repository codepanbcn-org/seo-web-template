import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// Localized 404. Returns a real 404 status (Next also adds noindex), never a
// 200 "soft 404". Reached via notFound() and via app/[locale]/[...rest].
export default function NotFoundPage() {
  const t = useTranslations("notFound");

  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">{t("heading")}</h1>
      <p className="mt-4">{t("body")}</p>
      <Link href="/" className="mt-8 inline-block underline">
        {t("backHome")}
      </Link>
    </main>
  );
}
