import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SITE_NAME } from "@/lib/site";
import LocaleSwitcher from "./LocaleSwitcher";

// Main navigation: plain links to every important page. Pages that are only
// reachable through JavaScript or not linked from anywhere ("orphan pages")
// are found late or never by crawlers.
export default async function SiteHeader() {
  const t = await getTranslations("nav");

  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-4 py-4">
        <Link href="/" className="font-bold">
          {SITE_NAME}
        </Link>
        <nav aria-label={t("label")}>
          <ul className="flex gap-4">
            <li>
              <Link href="/" className="hover:underline">
                {t("home")}
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                {t("about")}
              </Link>
            </li>
          </ul>
        </nav>
        <LocaleSwitcher />
      </div>
    </header>
  );
}
