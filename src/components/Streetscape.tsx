// A simple line drawing of a row of Main Street shops: sign boards, striped
// awnings, windows and doors. Purely decorative.

type Shop = { w: number; h: number; sign: string; awning: "green" | "gilt"; door: "green" | "gilt" | "ink" };

const SHOPS: Shop[] = [
  { w: 160, h: 152, sign: "BAKERY", awning: "green", door: "gilt" },
  { w: 190, h: 178, sign: "BOOKS", awning: "gilt", door: "green" },
  { w: 150, h: 146, sign: "FLOWERS", awning: "green", door: "ink" },
  { w: 185, h: 170, sign: "COFFEE", awning: "gilt", door: "green" },
  { w: 150, h: 156, sign: "SALON", awning: "green", door: "gilt" },
];

const GROUND = 214;
const INK = "var(--ink)";
const FILL: Record<string, string> = { green: "var(--brand)", gilt: "var(--gilt)", ink: "var(--ink)" };

function Storefront({ x, shop, fit }: { x: number; shop: Shop; fit: string }) {
  const { w, h } = shop;
  const top = GROUND - h;
  const awningTop = top + 54;
  const awningBottom = awningTop + 24;
  const scallops = Math.max(4, Math.round(w / 22));
  const r = w / scallops / 2;
  const doorW = 30;
  const glassTop = awningBottom + 14;

  let scallopPath = `M ${x} ${awningBottom}`;
  for (let i = 0; i < scallops; i++) scallopPath += ` a ${r} ${r} 0 0 0 ${2 * r} 0`;
  scallopPath += " Z";

  return (
    <g>
      {/* building */}
      <rect x={x} y={top} width={w} height={h} fill="var(--bg)" stroke={INK} strokeWidth={2} />
      <rect x={x - 4} y={top - 6} width={w + 8} height={8} fill={INK} />
      {/* painted sign board */}
      <rect x={x + 14} y={top + 14} width={w - 28} height={26} rx={3} fill={INK} />
      <text
        x={x + w / 2}
        y={top + 32}
        textAnchor="middle"
        fill="var(--gilt)"
        fontSize={12}
        fontWeight={800}
        letterSpacing={2}
      >
        {shop.sign}
      </text>
      {/* striped awning with a scalloped edge */}
      <path
        d={`M ${x + 8} ${awningTop} H ${x + w - 8} L ${x + w} ${awningBottom} H ${x} Z`}
        fill={`url(#stripe-${shop.awning}-${fit})`}
        stroke={INK}
        strokeWidth={2}
      />
      <path d={scallopPath} fill={FILL[shop.awning]} stroke={INK} strokeWidth={2} />
      {/* shop window and door */}
      <rect
        x={x + 12}
        y={glassTop}
        width={w - doorW - 36}
        height={GROUND - glassTop - 16}
        fill="var(--brand-soft)"
        stroke={INK}
        strokeWidth={2}
      />
      <rect
        x={x + w - doorW - 12}
        y={glassTop}
        width={doorW}
        height={GROUND - glassTop}
        fill={FILL[shop.door]}
        stroke={INK}
        strokeWidth={2}
      />
      <circle cx={x + w - 18} cy={glassTop + (GROUND - glassTop) / 2} r={2.5} fill={shop.door === "gilt" ? INK : "var(--bg)"} />
    </g>
  );
}

function Tree({ x }: { x: number }) {
  return (
    <g>
      <line x1={x} y1={GROUND} x2={x} y2={GROUND - 44} stroke={INK} strokeWidth={3} />
      <circle cx={x} cy={GROUND - 62} r={24} fill="var(--brand)" stroke={INK} strokeWidth={2} />
    </g>
  );
}

export default function Streetscape({ className = "" }: { className?: string }) {
  // Lay the shops out left to right with roomy gaps, and one tree in the middle.
  const gap = 28;
  let x = 30;
  const placed: { x: number; shop: Shop }[] = [];
  const trees: number[] = [];
  SHOPS.forEach((shop, i) => {
    placed.push({ x, shop });
    x += shop.w + gap;
    if (i === 2) {
      trees.push(x + 22);
      x += 72;
    }
  });
  const width = x + 2;

  // Phones crop the row at the sides; wider screens show the whole row centered.
  const drawing = (fit: "slice" | "meet", cls: string) => (
    <svg
      viewBox={`0 0 ${width} ${GROUND + 1}`}
      preserveAspectRatio={`xMidYMax ${fit}`}
      className={cls}
      aria-hidden
      focusable="false"
    >
      <defs>
        <pattern id={`stripe-green-${fit}`} width="24" height="10" patternUnits="userSpaceOnUse">
          <rect width="12" height="10" fill="var(--brand)" />
          <rect x="12" width="12" height="10" fill="var(--bg)" />
        </pattern>
        <pattern id={`stripe-gilt-${fit}`} width="24" height="10" patternUnits="userSpaceOnUse">
          <rect width="12" height="10" fill="var(--gilt)" />
          <rect x="12" width="12" height="10" fill="var(--bg)" />
        </pattern>
      </defs>
      {placed.map((p) => <Storefront key={p.shop.sign} x={p.x} shop={p.shop} fit={fit} />)}
      {trees.map((t) => <Tree key={t} x={t} />)}
    </svg>
  );

  return (
    <div className={className} aria-hidden>
      {drawing("slice", "block h-36 w-full sm:hidden")}
      {drawing("meet", "hidden h-52 w-full sm:block")}
      {/* the sidewalk runs the full width of the page */}
      <div className="h-6 border-y-2 border-ink bg-subtle" />
    </div>
  );
}
