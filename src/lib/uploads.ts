// Temporary photo storage in .data/uploads, until Supabase Storage is set up.
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export const UPLOAD_DIR = path.join(process.cwd(), ".data", "uploads");
export const MAX_BYTES = 5 * 1024 * 1024;
// Only names we generated ourselves are ever read back.
export const FILE_NAME = /^[a-f0-9-]{36}\.(jpg|png|webp)$/;

export const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

// Checks the file's first bytes, not just its name, so only real images are kept.
function detectType(bytes: Uint8Array): "jpg" | "png" | "webp" | null {
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
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), bytes);
  return name;
}

export async function imageExists(name: string): Promise<boolean> {
  if (!FILE_NAME.test(name)) return false;
  try {
    await fs.access(path.join(UPLOAD_DIR, name));
    return true;
  } catch {
    return false;
  }
}

export function imageUrl(name: string): string {
  return `/uploads/${name}`;
}
