import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Het Scorebord — honkbaltoernooi";

/** Voorvertoning voor als de link in de groepsapp wordt gedeeld. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 88px",
          background: "linear-gradient(135deg, #111d18 0%, #0a1210 60%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="60" height="60" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="25" fill="#f2efe4" />
            <path
              d="M14 15c7 8 7 26 0 34M50 15c-7 8-7 26 0 34"
              stroke="#e4572e"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          <span
            style={{
              color: "#e4572e",
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Honkbaltoernooi
          </span>
        </div>

        <div
          style={{
            color: "#f2efe4",
            fontSize: 132,
            fontWeight: 800,
            letterSpacing: -4,
            marginTop: 24,
          }}
        >
          Het Scorebord
        </div>

        <div style={{ color: "#8ba096", fontSize: 36, marginTop: 16 }}>
          Home run +25 · Kledingstuk vergeten −3 · Biertje voor de coach +0,2
        </div>
      </div>
    ),
    size,
  );
}
