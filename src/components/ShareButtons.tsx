"use client";

import { useEffect, useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";

// Lets neighbors pass a listing along: the phone's own share sheet when there is
// one, plus Facebook and a copy-link button for local groups and Nextdoor posts.
export default function ShareButtons({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);
  // Checked after the page loads, so the server and browser render the same thing first.
  const [canShare, setCanShare] = useState(false);
  useEffect(() => setCanShare("share" in navigator), []);
  const url = () => window.location.href.split("?")[0];

  async function nativeShare() {
    try {
      await navigator.share({ title: `${name} on Sweet Main`, url: url() });
    } catch {
      // The person closed the share sheet; nothing to do.
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url());
    }
  }

  const btn = "btn-secondary px-3 py-2 text-[15px]";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[15px] font-bold">Share</span>
      {canShare && (
        <button type="button" onClick={nativeShare} className={btn}>
          <Share2 size={16} /> Share
        </button>
      )}
      <button
        type="button"
        onClick={() =>
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url())}`, "_blank", "noopener,noreferrer")
        }
        className={btn}
      >
        Facebook
      </button>
      <button type="button" onClick={copy} className={btn} aria-live="polite">
        {copied ? <Check size={16} /> : <Link2 size={16} />} {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
