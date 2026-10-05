import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SITE_NAME } from "@/lib/site";

export default async function SiteFooter() {
  const t = await getTranslations("nav");

  return (
    <footer className="mt-24 border-t border-neutral-200">
      <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-4 px-4 py-8 text-sm">
        <p>
          © {SITE_NAME} {new Date().getFullYear()}
        </p>
        <Link href="/legal/privacy-policy" className="hover:underline">
          {t("privacy")}
        </Link>
      </div>
    </footer>
  );
}
