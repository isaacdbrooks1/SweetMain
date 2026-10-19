import { categoryIcon } from "@/lib/categories";

// Placeholder "logo" until photo uploads exist: the category icon on a soft tile.
export default function BusinessAvatar({ category, size = "md" }: { category: string; size?: "md" | "lg" }) {
  const box = size === "lg" ? "h-20 w-20 text-4xl rounded-2xl" : "h-14 w-14 text-2xl rounded-xl";
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center bg-accent-soft ${box}`}>
      {categoryIcon(category)}
    </span>
  );
}
