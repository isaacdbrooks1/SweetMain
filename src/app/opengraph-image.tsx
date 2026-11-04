import { ImageResponse } from "next/og";

// The picture shown when someone shares a Sweet Main link (Facebook, texts, Slack…).
export const alt = "Sweet Main: find and support small businesses near you";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Overpass (the site's street-sign font). Google serves a .ttf when asked without
// a browser user agent, which is the format the image renderer can use.
async function overpass(weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Overpass:wght@${weight}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const [bold, regular] = await Promise.all([overpass(800), overpass(400)]);
  const fonts = [
    ...(bold ? [{ name: "Overpass", data: bold, weight: 800 as const, style: "normal" as const }] : []),
    ...(regular ? [{ name: "Overpass", data: regular, weight: 400 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          color: "#1e2420",
          fontFamily: "Overpass",
        }}
      >
        {/* The street sign: green plate, white inner border */}
        <div style={{ display: "flex", background: "#0b6b3a", padding: 12, borderRadius: 26 }}>
          <div
            style={{
              display: "flex",
              border: "7px solid #ffffff",
              borderRadius: 16,
              padding: "22px 48px 12px",
              color: "#ffffff",
              fontSize: 104,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            Sweet Main
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 56, fontWeight: 800, marginTop: 52, letterSpacing: -1 }}>
          Find and support small businesses near you
        </div>
        <div style={{ display: "flex", fontSize: 32, fontWeight: 400, color: "#5f6b64", marginTop: 16 }}>
          Independent shops, makers and services. Free for every business.
        </div>
        <div style={{ display: "flex", width: 240, height: 10, background: "#f2b233", marginTop: 40, borderRadius: 5 }} />
      </div>
    ),
    { ...size, fonts },
  );
}
