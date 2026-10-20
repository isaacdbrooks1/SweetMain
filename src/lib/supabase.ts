// Server-side Supabase client. It uses the secret key, so it must never be
// imported by code that runs in the browser ("server-only" enforces that).
import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;

if (!url || !secret) {
  throw new Error("Supabase keys are missing. Fill in .env.local (see supabase/setup.sql).");
}

export const supabase = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export const PHOTO_BUCKET = "photos";
