import { ImageResponse } from "next/og";

// Shared branded OG image: V1.5 editorial look - white field, LINK + Rescue
// wordmark, big ink headline with a full stop, burgundy guide line.
export const OG_SIZE = { width: 1200, height: 630 };

export function ogImage(title: string, eyebrow = "Business rescue assessment") {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span style={{ fontSize: 44, fontWeight: 800, color: "#000000", letterSpacing: -1 }}>
            LINK
          </span>
          <span style={{ fontSize: 40, fontWeight: 800, color: "#7B1E3A", letterSpacing: -1 }}>
            Rescue
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              width: 64,
              height: 5,
              background: "#7B1E3A",
              marginBottom: 22,
              display: "flex",
            }}
          />
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: 3,
              marginBottom: 18,
            }}
          >
            {eyebrow}
          </span>
          <span
            style={{
              fontSize: title.length > 45 ? 56 : 68,
              fontWeight: 800,
              color: "#000000",
              letterSpacing: -2,
              lineHeight: 1.05,
              maxWidth: 1000,
            }}
          >
            {title}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span
            style={{
              display: "flex",
              background: "#7B1E3A",
              color: "#ffffff",
              borderRadius: 999,
              padding: "6px 18px",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Confidential. Two minutes. Instant result.
          </span>
          <span style={{ fontSize: 22, fontWeight: 600, color: "#9ca3af" }}>
            rescue.link.com.au
          </span>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
