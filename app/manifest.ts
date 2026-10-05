import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

// Served at /manifest.webmanifest. TODO(setup): colors; add 192/512 px PNG
// icons in public/ for full "add to home screen" support.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#111111",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
