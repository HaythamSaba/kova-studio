import { ImageResponse } from "next/og";

export const alt = "Kova Studio — Crafted with intent. Built to endure.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#050505",
          color: "#f0ebe3",
        }}
      >
        {/* ── Mark — matches favicon.svg ───────────────── */}
        <div
          style={{
            display: "flex",
            width: "64px",
            height: "64px",
            backgroundColor: "#c17f3e",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "28px",
              height: "28px",
              backgroundColor: "#f0ebe3",
              transform: "rotate(45deg)",
            }}
          />
        </div>

        {/* ── Title + tagline ───────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              fontSize: "92px",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Kova Studio
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "30px",
              color: "#9e9690",
              maxWidth: "820px",
            }}
          >
            Crafted with intent. Built to endure.
          </div>
        </div>

        {/* ── Footer label ───────────────────────────────── */}
        <div
          style={{
            display: "flex",
            fontSize: "20px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#9e9690",
          }}
        >
          Digital Studio — Ljubljana
        </div>
      </div>
    ),
    { ...size },
  );
}
