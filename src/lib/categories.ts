export const CATEGORIES = [
  { name: "Food & Drink", icon: "🥐" },
  { name: "Crafts & Handmade", icon: "🧶" },
  { name: "Shops", icon: "🛍️" },
  { name: "Beauty & Wellness", icon: "🌿" },
  { name: "Home Services", icon: "🛠️" },
  { name: "Pets", icon: "🐾" },
  { name: "Events", icon: "🎉" },
  { name: "Other", icon: "✨" },
] as const;

export const CATEGORY_NAMES: string[] = CATEGORIES.map((c) => c.name);

export function categoryIcon(name: string): string {
  return CATEGORIES.find((c) => c.name === name)?.icon ?? "✨";
}

// Where a business can raise money or take donations. Shown as a dropdown on the form.
export const SUPPORT_PLATFORMS = [
  "Wefunder",
  "StartEngine",
  "Kiva",
  "GoFundMe",
  "Ko-fi",
  "Patreon",
  "Other",
];

// How many support/invest links a business can add.
export const SUPPORT_ROWS = 3;
