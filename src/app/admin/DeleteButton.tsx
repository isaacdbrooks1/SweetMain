"use client";

import { removeListing } from "./actions";

// Deleting can't be undone, so ask first.
export default function DeleteButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={removeListing}
      onSubmit={(e) => {
        if (!confirm(`Delete "${name}" and its photos for good? This can't be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="rounded-md px-2.5 py-1.5 text-[14px] font-bold text-danger hover:bg-danger/10">
        Delete
      </button>
    </form>
  );
}
