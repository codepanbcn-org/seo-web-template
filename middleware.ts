import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next internals and files with an extension
  // (robots.txt, sitemap.xml, images...).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
