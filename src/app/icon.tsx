import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Honkbal: crèmewitte bol met twee rode stiksels. */
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
          background: "#0a1210",
        }}
      >
        <svg width="52" height="52" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="25" fill="#f2efe4" />
          <path
            d="M14 15c7 8 7 26 0 34M50 15c-7 8-7 26 0 34"
            stroke="#e4572e"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    size,
  );
}
