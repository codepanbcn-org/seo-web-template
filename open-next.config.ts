import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default OpenNext adapter config. Add an incremental cache (R2/KV) here only
// if the project starts using ISR / revalidate.
export default defineCloudflareConfig();
