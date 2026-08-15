import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Kinheim scorebord";

/** Voorvertoning voor als de link in de groepsapp wordt gedeeld. */
export default function OpengraphImage() {
  const mark = readFileSync(join(process.cwd(), "public", "kinheim-wordmark.png"));
  const src = `data:image/png;base64,${mark.toString("base64")}`;

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
          background: "#111111",
          fontFamily: "sans-serif",
        }}
      >
        <img src={src} style={{ width: 620 }} alt="" />
        <div style={{ color: "#ffffff", fontSize: 64, fontWeight: 700, marginTop: 28 }}>
          Scorebord
        </div>
        <div style={{ color: "#be1e2d", fontSize: 30, marginTop: 8 }}>Toernooi</div>
      </div>
    ),
    size,
  );
}
