// Shared by the server and the browser: where uploaded photos live.

// Only names we generated ourselves are ever accepted back from a form.
export const FILE_NAME = /^[a-f0-9-]{36}\.(jpg|png|webp)$/;

// Photos are in Supabase Storage's public "photos" bucket.
export function imageUrl(name: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${name}`;
}
