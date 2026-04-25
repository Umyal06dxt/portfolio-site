import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const alt = "Umyal Dixit — AI Researcher & Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const imageData = await readFile(join(process.cwd(), "public/me.jpeg"));
  const base64 = `data:image/jpeg;base64,${imageData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#0d0d0d",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: 300,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(255,95,31,0.14) 0%, transparent 65%)",
          }}
        />

        {/* Left — text content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 60px",
            flex: 1,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Name */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: 80,
              fontWeight: 400,
              color: "#ede6d6",
              lineHeight: 0.88,
              letterSpacing: "-2px",
              marginBottom: 28,
            }}
          >
            <span>Umyal</span>
            <span>Dixit</span>
          </div>

          {/* Accent line */}
          <div
            style={{
              width: 48,
              height: 2,
              background: "#ff5f1f",
              marginBottom: 22,
            }}
          />

          {/* Role */}
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 17,
              color: "#9e9587",
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            AI Researcher & Builder
          </div>

          {/* Location */}
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 14,
              color: "#5a5550",
              letterSpacing: "1.5px",
              marginBottom: 44,
            }}
          >
            Gurugram, India · 10× Hackathon Winner
          </div>

          {/* Project tags */}
          <div style={{ display: "flex", gap: 10 }}>
            {["Veris", "Sukku", "Emotion AI"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "7px 16px",
                  border: "1px solid rgba(255,95,31,0.35)",
                  color: "#ff5f1f",
                  fontFamily: "monospace",
                  fontSize: 13,
                  letterSpacing: "1.5px",
                  background: "rgba(255,95,31,0.06)",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Right — headshot */}
        <div
          style={{
            width: 420,
            height: "100%",
            display: "flex",
            flexShrink: 0,
            position: "relative",
          }}
        >
          {/* Left-to-right fade overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 160,
              height: "100%",
              background:
                "linear-gradient(to right, #0d0d0d 0%, transparent 100%)",
              zIndex: 2,
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={base64}
            alt="Umyal Dixit"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
            }}
          />
        </div>

        {/* Domain watermark */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: 60,
            fontFamily: "monospace",
            fontSize: 13,
            color: "#3a3530",
            letterSpacing: "1.5px",
          }}
        >
          dixitumyal.com
        </div>
      </div>
    ),
    { ...size }
  );
}
