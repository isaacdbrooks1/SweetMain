// Starter home page. The search box and categories are placeholders
// until listings and search are built (phases 2 and 3 of the plan).

const categories = [
  "Food & Drink",
  "Crafts & Handmade",
  "Shops",
  "Beauty & Wellness",
  "Home Services",
  "Pets",
  "Events",
  "Other",
];

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold">Local Finds</h1>
        <p className="mt-3 text-lg opacity-80">
          Find, follow and support small businesses in your community.
        </p>
      </header>

      <form className="flex flex-col gap-3 sm:flex-row" action="/search">
        <input
          name="q"
          placeholder="What are you looking for?"
          className="flex-1 rounded-lg border border-current/20 bg-transparent px-4 py-3"
        />
        <input
          name="near"
          placeholder="City or ZIP"
          className="rounded-lg border border-current/20 bg-transparent px-4 py-3 sm:w-48"
        />
        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          Search
        </button>
      </form>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">Browse by category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((c) => (
            <a
              key={c}
              href={`/search?category=${encodeURIComponent(c)}`}
              className="rounded-lg border border-current/15 px-4 py-6 text-center hover:border-emerald-600"
            >
              {c}
            </a>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-xl bg-emerald-600/10 p-6 text-center">
        <h2 className="text-xl font-semibold">Own a small business?</h2>
        <p className="mt-2 opacity-80">
          List it for free. Link your website, socials and Etsy shop.
        </p>
        <a
          href="/signup"
          className="mt-4 inline-block rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          Add your business
        </a>
      </section>
    </main>
  );
}
