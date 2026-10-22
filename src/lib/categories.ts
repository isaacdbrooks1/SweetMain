import {
  CalendarDays,
  Coffee,
  PawPrint,
  Scissors,
  Shapes,
  Sparkles,
  Store,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const CATEGORIES: { name: string; icon: LucideIcon }[] = [
  { name: "Food & Drink", icon: Coffee },
  { name: "Crafts & Handmade", icon: Scissors },
  { name: "Shops", icon: Store },
  { name: "Beauty & Wellness", icon: Sparkles },
  { name: "Home Services", icon: Wrench },
  { name: "Pets", icon: PawPrint },
  { name: "Events", icon: CalendarDays },
  { name: "Other", icon: Shapes },
];

export const CATEGORY_NAMES: string[] = CATEGORIES.map((c) => c.name);

export function categoryIcon(name: string): LucideIcon {
  return CATEGORIES.find((c) => c.name === name)?.icon ?? Shapes;
}

// Where a business can raise money or take donations. Shown as a dropdown on the form.
export const SUPPORT_PLATFORMS = [
  "Honeycomb Credit",
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

// How many photos a business can show (the first is the cover).
export const MAX_PHOTOS = 4;
