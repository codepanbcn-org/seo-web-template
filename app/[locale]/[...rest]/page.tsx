import { notFound } from "next/navigation";

// Any unknown path inside a locale renders app/[locale]/not-found.tsx
// (localized, inside the site layout) with a 404 status.
export default function CatchAllPage() {
  notFound();
}
