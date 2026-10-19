export default function SearchBar({ q = "", near = "", category }: { q?: string; near?: string; category?: string }) {
  return (
    <form action="/search" className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-2 shadow-sm sm:flex-row">
      {category && <input type="hidden" name="category" value={category} />}
      <input
        name="q"
        defaultValue={q}
        placeholder="Bakery, candles, dog groomer…"
        aria-label="What are you looking for?"
        className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 focus:outline-none"
      />
      <input
        name="near"
        defaultValue={near}
        placeholder="City or ZIP"
        aria-label="Where?"
        className="rounded-xl border-line bg-transparent px-4 py-3 focus:outline-none sm:w-44 sm:border-l"
      />
      <button type="submit" className="btn-primary">Search</button>
    </form>
  );
}
