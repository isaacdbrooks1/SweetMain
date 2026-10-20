// Saving photos to Supabase Storage (server only).
import { randomUUID } from "crypto";
import { PHOTO_BUCKET, supabase } from "./supabase";
import { FILE_NAME, imageUrl } from "./images";

export const MAX_BYTES = 5 * 1024 * 1024;

const CONTENT_TYPES = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" } as const;

// Checks the file's first bytes, not just its name, so only real images are kept.
function detectType(bytes: Uint8Array): keyof typeof CONTENT_TYPES | null {
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes[0] === 0x89 && ascii(1, 4) === "PNG") return "png";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  return null;
}

export async function saveImage(file: File): Promise<string> {
  if (file.size > MAX_BYTES) throw new Error("Photos must be 5 MB or smaller.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = detectType(bytes);
  if (!ext) throw new Error("Please upload a JPG, PNG or WebP photo.");
  const name = `${randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(name, bytes, { contentType: CONTENT_TYPES[ext], cacheControl: "31536000" });
  if (error) throw new Error("Upload failed. Please try again.");
  return name;
}

export async function imageExists(name: string): Promise<boolean> {
  if (!FILE_NAME.test(name)) return false;
  const res = await fetch(imageUrl(name), { method: "HEAD", cache: "no-store" }).catch(() => null);
  return !!res?.ok;
}
