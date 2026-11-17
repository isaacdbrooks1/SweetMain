"use client";

import { useState } from "react";

const EMAIL = "hello@sweetmain.com";

// The contact address. Clicking opens the visitor's email app if they have one,
// and always copies the address, so the click does something either way.
export default function EmailLink({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(EMAIL).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 4000);
      },
      () => {},
    );
  }

  return (
    <>
      <a href={`mailto:${EMAIL}`} onClick={copy} className={className}>{EMAIL}</a>
      <span role="status" className="font-normal">{copied ? " Copied. Paste it into your email." : ""}</span>
    </>
  );
}
