"use client";

import QRCode from "react-qr-code";

const FALLBACK_ORIGIN = "https://newww.website";

function siteOrigin() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return fromEnv && fromEnv.length > 0 ? fromEnv : FALLBACK_ORIGIN;
}

export default function SiteQrCode() {
  const value = `${siteOrigin()}/`;

  return (
    <div className="inline-flex flex-col gap-3">
      <div className="rounded-xl bg-white p-2 shadow-sm">
        <QRCode
          value={value}
          size={112}
          level="M"
          bgColor="#ffffff"
          fgColor="#111111"
        />
      </div>
    </div>
  );
}
