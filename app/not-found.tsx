"use client";

import Error from "next/error";

// 404 for requests outside the [locale] segment (rare: the middleware gives
// almost every path a locale). Localized 404: app/[locale]/not-found.tsx.
export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <Error statusCode={404} />
      </body>
    </html>
  );
}
