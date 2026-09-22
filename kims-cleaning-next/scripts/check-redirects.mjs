/* Validates public/_redirects against the app's real routes.
   Exists because a self-referential rule (/about -> /about) shipped once and
   took the live About page down with ERR_TOO_MANY_REDIRECTS. A same-path
   redirect is an infinite loop, not a no-op, and nothing in `next build`
   catches it — the file is data Netlify reads at request time.

   Run: npm run check:redirects   (also runs as part of `npm run build`) */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const note = (m) => errors.push(m);

/* --- the routes the app actually serves ------------------------------- */
function appRoutes(dir = join(root, "app"), prefix = "") {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    if (e.name.startsWith("_") || e.name.startsWith("(")) continue;
    const child = join(dir, e.name);
    const path = `${prefix}/${e.name}`;
    if (existsSync(join(child, "page.tsx"))) out.push(path);
    out.push(...appRoutes(child, path));
  }
  return out;
}

const staticRoutes = new Set(["/", ...appRoutes().filter((r) => !r.includes("["))]);
const slugs = [
  ...readFileSync(join(root, "lib/products.ts"), "utf8").matchAll(/slug:\s*"([^"]+)"/g),
].map((m) => `/product/${m[1]}`);
const known = new Set([...staticRoutes, ...slugs]);

/* --- the rules -------------------------------------------------------- */
const lines = readFileSync(join(root, "public/_redirects"), "utf8").split("\n");

lines.forEach((raw, i) => {
  const line = raw.trim();
  if (!line || line.startsWith("#")) return;
  const [from, to, status] = line.split(/\s+/);
  const at = `_redirects:${i + 1}`;

  if (!to) return note(`${at}  "${line}" — missing destination`);

  // The bug this file exists for.
  if (from === to.split("#")[0]) {
    note(`${at}  ${from} -> ${to} is a redirect LOOP (source equals destination). Delete the rule.`);
  }

  if (status !== "301") {
    note(`${at}  ${from} -> ${to} is ${status ?? "(no status)"}; migration redirects must be 301 to pass ranking signal.`);
  }

  // A rule that matches a route we serve will shadow it: user redirects are
  // evaluated before the Next.js handler.
  if (known.has(from)) {
    note(`${at}  ${from} is a real route — this rule SHADOWS the page it should serve.`);
  }
  if (from.endsWith("/*")) {
    const base = from.slice(0, -2);
    for (const r of known) {
      if (r !== base && r.startsWith(`${base}/`)) {
        note(`${at}  splat ${from} swallows the real route ${r}. Narrow it (e.g. ${base}/:a/:b).`);
      }
    }
  }

  // Destinations should land somewhere that exists.
  const target = to.split("#")[0];
  if (target.startsWith("/") && !target.includes(":") && !target.includes("*") && !known.has(target)) {
    note(`${at}  destination ${to} is not a route this app serves.`);
  }
});

if (errors.length) {
  console.error(`\n_redirects: ${errors.length} problem(s)\n`);
  for (const e of errors) console.error("  " + e);
  console.error("");
  process.exit(1);
}
console.log(`_redirects OK — ${known.size} routes known, no loops, no shadowed pages.`);
