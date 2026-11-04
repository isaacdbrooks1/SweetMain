"use client";

import { deleteOwnListing } from "./actions";

// Asks first, since deleting can't be undone.
export default function DeleteOwnListing({ id, editKey, name }: { id: string; editKey: string; name: string }) {
  return (
    <form
      action={deleteOwnListing}
      onSubmit={(e) => {
        if (!confirm(`Delete "${name}" from Sweet Main for good? This can't be undone.`)) e.preventDefault();
      }}
      className="mt-16 border-t border-line pt-8"
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="key" value={editKey} />
      <h2 className="text-lg font-bold">Delete your listing</h2>
      <p className="mt-1 text-[15px] text-muted">Removes your page and its photos from Sweet Main for good.</p>
      <button type="submit" className="mt-4 rounded-md border border-danger/40 px-4 py-2 font-bold text-danger hover:bg-danger/5">
        Delete my listing
      </button>
    </form>
  );
}
