import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Het volledige woordmerk is op 64 pixels onleesbaar, dus alleen de K. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111111",
          color: "#ffffff",
          fontSize: 46,
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        K
      </div>
    ),
    size,
  );
}
