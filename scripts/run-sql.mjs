// Runs a .sql file against the Supabase database.
// Usage: node scripts/run-sql.mjs supabase/004_email.sql
// Reads DATABASE_URL from .env.local (never printed).
import { readFileSync } from "node:fs";
import pg from "pg";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/run-sql.mjs <file.sql>");
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => /^[A-Z_]+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
);
if (!env.DATABASE_URL) {
  console.error("DATABASE_URL is missing from .env.local");
  process.exit(1);
}

const client = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
try {
  await client.connect();
  await client.query(readFileSync(file, "utf8"));
  console.log(`Ran ${file} successfully.`);
} catch (e) {
  // Show the database's message but never the connection string.
  console.error(`Failed: ${String(e.message).replace(env.DATABASE_URL, "[DATABASE_URL]")}`);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
