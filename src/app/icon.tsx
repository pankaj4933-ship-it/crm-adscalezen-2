import { ImageResponse } from "next/og";
import { ADSCALEZEN_FAVICON_B64, ADSCALEZEN_LOGO_B64 } from "@/lib/brand-assets";

// Serves the official AdScale Zen futuristic chrome ASZ emblem as the favicon.
// Next.js auto-injects <link rel="icon"> into <head>.

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  const iconSrc = ADSCALEZEN_FAVICON_B64 || ADSCALEZEN_LOGO_B64;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <img
          src={iconSrc}
          alt="AdScale Zen"
          width="64"
          height="64"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
