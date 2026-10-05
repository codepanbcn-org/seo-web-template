#!/usr/bin/env node
// Post-deploy SEO smoke test. Zero dependencies (Node 18+).
//
//   npm run seo:check -- https://www.example.com
//   npm run seo:check -- http://localhost:3000        (after `npm run build && npm start`)
//
// Checks: robots.txt, sitemap.xml, and for every sitemap URL: status 200,
// <html lang>, title, description, self-referencing canonical, hreflang,
// og:image, noindex, exactly one <h1>, valid JSON-LD. For a public domain it
// also checks that http:// and the www / non-www variant redirect to the
// canonical origin in a single hop. Exits with code 1 if anything fails.

const input = process.argv[2];
if (!input) {
  console.error("Usage: npm run seo:check -- <https://www.example.com>");
  process.exit(2);
}
const base = new URL(input).origin;
const failures = [];
const ok = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg) => {
  failures.push(msg);
  console.log(`  ✗ ${msg}`);
};
const warn = (msg) => console.log(`  ! ${msg}`);

const get = (url) => fetch(url, { redirect: "manual", headers: { "user-agent": "seo-check/1.0" } });
const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`, "i"))?.[1];
const tags = (html, re) => html.match(re) ?? [];

// --- robots.txt ---------------------------------------------------------
console.log(`\nrobots.txt`);
const robotsRes = await get(`${base}/robots.txt`);
const robots = await robotsRes.text();
if (robotsRes.status !== 200) fail(`/robots.txt returned ${robotsRes.status}`);
else if (/^Disallow:\s*\/\s*$/im.test(robots)) fail(`robots.txt blocks the whole site ("Disallow: /") — preview build?`);
else ok("robots.txt allows crawling");
const sitemapLine = robots.match(/^Sitemap:\s*(\S+)/im)?.[1];
sitemapLine ? ok(`Sitemap: ${sitemapLine}`) : fail("robots.txt has no Sitemap line");

// --- sitemap.xml --------------------------------------------------------
console.log(`\nsitemap.xml`);
const sitemapRes = await get(`${base}/sitemap.xml`);
const sitemap = await sitemapRes.text();
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (sitemapRes.status !== 200) fail(`/sitemap.xml returned ${sitemapRes.status}`);
if (locs.length === 0) fail("sitemap has no <loc> entries");
else ok(`${locs.length} URLs`);
const badLocs = locs.filter((loc) => !/^https?:\/\/[^/]+/.test(loc) || loc.includes("undefined"));
if (badLocs.length) fail(`invalid sitemap URLs: ${badLocs.join(", ")}`);
const canonicalOrigin = locs[0] ? new URL(locs[0]).origin : base;
if (canonicalOrigin !== base) warn(`sitemap uses ${canonicalOrigin}; checking pages on ${base} with that path`);

// --- pages ----------------------------------------------------------------
for (const loc of locs) {
  const url = base + new URL(loc).pathname + new URL(loc).search;
  console.log(`\n${loc}`);
  const res = await get(url);
  if (res.status !== 200) {
    fail(`${loc}: status ${res.status}${res.headers.get("location") ? ` -> ${res.headers.get("location")}` : ""}`);
    continue;
  }
  const html = await res.text();
  const head = html.split(/<\/head>/i)[0];
  const metaTags = tags(head, /<meta\b[^>]*>/gi);
  const linkTags = tags(head, /<link\b[^>]*>/gi);
  const meta = (key) => metaTags.find((t) => attr(t, "name") === key || attr(t, "property") === key);

  const lang = html.match(/<html[^>]*\blang="([^"]+)"/i)?.[1];
  lang ? ok(`lang="${lang}"`) : fail(`${loc}: <html> has no lang`);

  const title = head.match(/<title>([^<]*)<\/title>/i)?.[1];
  if (!title) fail(`${loc}: no <title>`);
  else {
    ok(`title (${title.length} chars): ${title}`);
    if (title.length > 65) warn("title longer than ~60 chars");
  }

  const description = meta("description") && attr(meta("description"), "content");
  if (!description) fail(`${loc}: no meta description`);
  else {
    ok(`description (${description.length} chars)`);
    if (description.length < 70 || description.length > 170) warn("description outside ~120-160 chars");
  }

  const canonical = linkTags.find((t) => attr(t, "rel") === "canonical");
  const canonicalHref = canonical && attr(canonical, "href");
  if (!canonicalHref) fail(`${loc}: no canonical`);
  else if (canonicalHref.replace(/\/$/, "") !== loc.replace(/\/$/, "")) fail(`${loc}: canonical points to ${canonicalHref}`);
  else ok("canonical = self");

  const hreflangs = linkTags.filter((t) => /hreflang=/i.test(t)).map((t) => t.match(/hreflang="([^"]+)"/i)[1]);
  if (hreflangs.length === 0) warn("no hreflang (fine for a single-language site)");
  else if (!hreflangs.includes("x-default")) fail(`${loc}: hreflang without x-default`);
  else ok(`hreflang: ${hreflangs.join(", ")}`);

  meta("og:image") ? ok("og:image") : fail(`${loc}: no og:image`);

  const robotsMeta = meta("robots") && attr(meta("robots"), "content");
  if (robotsMeta && /noindex/i.test(robotsMeta)) fail(`${loc}: in the sitemap but has noindex`);

  const h1s = tags(html, /<h1[\s>]/gi).length;
  h1s === 1 ? ok("one <h1>") : fail(`${loc}: ${h1s} <h1> elements`);

  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  let types = [];
  for (const [, body] of jsonLd) {
    try {
      const data = JSON.parse(body);
      types = types.concat((Array.isArray(data) ? data : [data]).map((d) => d["@type"]));
    } catch {
      fail(`${loc}: invalid JSON-LD`);
    }
  }
  types.length ? ok(`JSON-LD: ${types.join(", ")}`) : warn("no JSON-LD on this page");
}

// --- 404 -----------------------------------------------------------------
console.log(`\n404`);
const notFoundRes = await get(`${base}/this-page-should-not-exist-${Date.now()}`);
notFoundRes.status === 404 ? ok("unknown URL returns 404") : fail(`unknown URL returns ${notFoundRes.status} (soft 404?)`);

// --- domain redirects (only when checking the live canonical domain) -----
const host = new URL(canonicalOrigin).hostname;
if (base === canonicalOrigin) {
  console.log(`\nredirects to ${canonicalOrigin}`);
  const other = host.startsWith("www.") ? host.slice(4) : `www.${host}`;
  for (const variant of [`http://${host}/`, `https://${other}/`, `http://${other}/`]) {
    try {
      const res = await get(variant);
      const location = res.headers.get("location") ?? "";
      const target = location && new URL(location, variant).href;
      if ([301, 308].includes(res.status) && target.replace(/\/$/, "") === canonicalOrigin) ok(`${variant} -> ${res.status} ${target}`);
      else fail(`${variant} -> ${res.status} ${target || "(no redirect)"} — expected one 301/308 hop to ${canonicalOrigin}`);
    } catch (error) {
      warn(`${variant} unreachable (${error.cause?.code ?? error.message}) — fine if that host is not used`);
    }
  }
}

console.log(failures.length ? `\n${failures.length} problem(s) found.` : "\nAll checks passed.");
process.exit(failures.length ? 1 : 0);
