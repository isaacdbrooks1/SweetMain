"use client";

import { useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

const MAX_BYTES = 5 * 1024 * 1024;

// Uploads photos as soon as they're picked, so they survive if the form shows an error.
// The saved file names travel with the form in hidden inputs.
export default function PhotoUpload({ name, max, initial = [], variant }: {
  name: string;
  max: number;
  initial?: string[];
  variant: "logo" | "photos";
}) {
  const [files, setFiles] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []).slice(0, max - files.length);
    e.target.value = "";
    setBusy(true);
    setError("");
    for (const file of picked) {
      if (file.size > MAX_BYTES) {
        setError(`"${file.name}" is bigger than 5 MB.`);
        continue;
      }
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setError(data.error ?? "Upload failed. Please try again.");
      else setFiles((prev) => [...prev, data.name].slice(0, max));
    }
    setBusy(false);
  }

  const tile = variant === "logo" ? "h-24 w-24 rounded-full" : "aspect-[4/3] w-full rounded-md";

  return (
    <div>
      {files.map((f) => <input key={f} type="hidden" name={name} value={f} />)}
      <div className={variant === "logo" ? "flex gap-3" : "grid grid-cols-2 gap-3 sm:grid-cols-4"}>
        {files.map((f, i) => (
          <div key={f} className={`group relative overflow-hidden bg-subtle ${tile}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/uploads/${f}`} alt="" className="h-full w-full object-cover" />
            {variant === "photos" && i === 0 && (
              <span className="absolute left-2 top-2 rounded bg-bg/90 px-1.5 py-0.5 text-[13px] font-bold">
                Cover
              </span>
            )}
            <button
              type="button"
              onClick={() => setFiles((prev) => prev.filter((x) => x !== f))}
              aria-label="Remove photo"
              className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-ink/70 text-white hover:bg-ink"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        {files.length < max && (
          <label
            className={`flex cursor-pointer flex-col items-center justify-center gap-1 border-2 border-dashed border-line text-[15px] text-muted hover:border-ink hover:text-ink ${tile}`}
          >
            {busy ? <Loader2 size={22} className="animate-spin" /> : <ImagePlus size={22} />}
            <span>{busy ? "Uploading…" : variant === "logo" ? "Add logo" : "Add photos"}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple={max - files.length > 1}
              onChange={onPick}
              disabled={busy}
              className="sr-only"
            />
          </label>
        )}
      </div>
      {error && <p className="mt-2 text-[15px] font-medium text-danger">{error}</p>}
    </div>
  );
}
