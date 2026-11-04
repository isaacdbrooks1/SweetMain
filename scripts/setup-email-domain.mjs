// One-time setup: adds sweetmain.com to Resend and copies Resend's DNS records
// into Cloudflare (DNS only, never proxied). Safe to run again: it reuses the
// Resend domain and skips records that already exist.
// Reads RESEND_API_KEY and CLOUDFLARE_API_TOKEN from .env.local (never printed).
import { readFileSync } from "node:fs";

const DOMAIN = "sweetmain.com";
const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => /^[A-Z_]+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
);

async function api(url, opts = {}, token) {
  const res = await fetch(url, {
    ...opts,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(opts.headers ?? {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${opts.method ?? "GET"} ${url} -> ${res.status}: ${JSON.stringify(body)}`);
  return body;
}
const resend = (path, opts) => api(`https://api.resend.com${path}`, opts, env.RESEND_API_KEY);
const cf = (path, opts) => api(`https://api.cloudflare.com/client/v4${path}`, opts, env.CLOUDFLARE_API_TOKEN);

// 1. Find or add the domain in Resend.
const list = await resend("/domains");
let domain = (list.data ?? []).find((d) => d.name === DOMAIN);
if (!domain) {
  domain = await resend("/domains", { method: "POST", body: JSON.stringify({ name: DOMAIN, region: "us-east-1" }) });
  console.log(`Added ${DOMAIN} to Resend.`);
} else {
  console.log(`${DOMAIN} is already in Resend (status: ${domain.status}).`);
}
const details = await resend(`/domains/${domain.id}`);
const records = details.records ?? [];
console.log(`Resend wants ${records.length} DNS records.`);

// 2. Copy each record into Cloudflare.
const zones = await cf(`/zones?name=${DOMAIN}`);
const zoneId = zones.result?.[0]?.id;
if (!zoneId) throw new Error("Cloudflare zone not found");
const existing = (await cf(`/zones/${zoneId}/dns_records?per_page=100`)).result ?? [];

for (const r of records) {
  const name = r.name === "@" || r.name === DOMAIN ? DOMAIN : r.name.endsWith(DOMAIN) ? r.name : `${r.name}.${DOMAIN}`;
  const type = r.type;
  const content = r.value;
  const same = existing.find((e) => e.type === type && e.name === name && e.content.replace(/^"|"$/g, "") === content.replace(/^"|"$/g, ""));
  if (same) {
    console.log(`  ${type} ${name}: already there`);
    continue;
  }
  const rec = { type, name, content, ttl: 1, proxied: false };
  if (type === "MX") rec.priority = Number(r.priority ?? 10);
  await cf(`/zones/${zoneId}/dns_records`, { method: "POST", body: JSON.stringify(rec) });
  console.log(`  ${type} ${name}: added`);
}

// 3. Ask Resend to check the records now.
await resend(`/domains/${domain.id}/verify`, { method: "POST" });
console.log("Asked Resend to verify. It can take a few minutes.");
console.log(`DOMAIN_ID=${domain.id}`);
