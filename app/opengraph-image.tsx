import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Trainovate Technologies — Workforce Transformation OS";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(circle at 70% 30%, #00E5C733, transparent 55%), #05070A",
          color: "#E8ECF1",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            letterSpacing: 4,
            color: "#00E5C7",
            textTransform: "uppercase",
          }}
        >
          <span>[ TRAINOVATE / SDVOSB ]</span>
          <span>trainovate.tech</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 92,
              lineHeight: 1.0,
              letterSpacing: -2,
              fontStyle: "italic",
              maxWidth: 900,
              fontWeight: 400,
            }}
          >
            We engineer the doctrine of modern safety.
          </div>
          <div style={{ marginTop: 40, fontSize: 22, color: "#5C6B7E", maxWidth: 760 }}>
            AI-powered learning, EHS instrumentation, and immersive content for
            the industries the world depends on.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#5C6B7E",
          }}
        >
          <span>Veteran-Owned · SDVOSB · DVOSB</span>
          <span>Las Vegas, NV</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
