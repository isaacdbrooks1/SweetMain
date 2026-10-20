// A simple line drawing of a row of Main Street shops: sign boards, striped
// awnings, windows and doors. Purely decorative.

type Shop = { w: number; h: number; sign: string; awning: "green" | "gilt"; door: "green" | "gilt" | "ink" };

const SHOPS: Shop[] = [
  { w: 150, h: 150, sign: "BAKERY", awning: "green", door: "gilt" },
  { w: 190, h: 176, sign: "BOOKS", awning: "gilt", door: "green" },
  { w: 130, h: 140, sign: "FLOWERS", awning: "green", door: "ink" },
  { w: 175, h: 188, sign: "HARDWARE", awning: "gilt", door: "green" },
  { w: 140, h: 156, sign: "CANDLES", awning: "green", door: "gilt" },
  { w: 185, h: 170, sign: "COFFEE", awning: "gilt", door: "green" },
  { w: 135, h: 146, sign: "SALON", awning: "green", door: "ink" },
];

const GROUND = 214;
const INK = "var(--ink)";
const FILL: Record<string, string> = { green: "var(--brand)", gilt: "var(--gilt)", ink: "var(--ink)" };

function Storefront({ x, shop }: { x: number; shop: Shop }) {
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
        fill={`url(#stripe-${shop.awning})`}
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
  // Lay the shops out left to right with small gaps, and a tree every few shops.
  const gap = 10;
  let x = 20;
  const placed: { x: number; shop: Shop }[] = [];
  const trees: number[] = [];
  SHOPS.forEach((shop, i) => {
    placed.push({ x, shop });
    x += shop.w + gap;
    if (i === 1 || i === 4) {
      trees.push(x + 18);
      x += 46;
    }
  });
  const width = x + 10;

  return (
    <svg
      viewBox={`0 0 ${width} ${GROUND + 26}`}
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden
      focusable="false"
    >
      <defs>
        <pattern id="stripe-green" width="24" height="10" patternUnits="userSpaceOnUse">
          <rect width="12" height="10" fill="var(--brand)" />
          <rect x="12" width="12" height="10" fill="var(--bg)" />
        </pattern>
        <pattern id="stripe-gilt" width="24" height="10" patternUnits="userSpaceOnUse">
          <rect width="12" height="10" fill="var(--gilt)" />
          <rect x="12" width="12" height="10" fill="var(--bg)" />
        </pattern>
      </defs>
      {placed.map((p) => <Storefront key={p.shop.sign} x={p.x} shop={p.shop} />)}
      {trees.map((t) => <Tree key={t} x={t} />)}
      {/* sidewalk */}
      <rect x={0} y={GROUND} width={width} height={26} fill="var(--subtle)" />
      <line x1={0} y1={GROUND} x2={width} y2={GROUND} stroke={INK} strokeWidth={2} />
    </svg>
  );
}
