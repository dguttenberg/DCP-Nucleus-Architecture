"use client";

import type { NarrativeChapter } from "@/lib/types";

interface NarrativeViewProps {
  chapters: NarrativeChapter[];
  onSwitchToArchitecture: () => void;
}

export default function NarrativeView({
  chapters,
  onSwitchToArchitecture,
}: NarrativeViewProps) {
  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        backgroundColor: "#F5F4F0",
      }}
    >
      <div
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "60px 32px 80px",
        }}
      >
        {/* Title */}
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#AAAAAA",
              marginBottom: 12,
            }}
          >
            Brand Gravity — DCP AI Innovation & Delivery
          </div>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 500,
              color: "#1a1a1a",
              margin: "0 0 16px",
              lineHeight: 1.25,
              letterSpacing: "-0.025em",
            }}
          >
            The Architecture and the Thinking
          </h1>
          <p
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: "#666666",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            This document encodes the architecture of Brand Gravity and the
            reasoning behind every decision in it. Read this to understand the
            system. Then explore the interactive diagram to navigate it.
          </p>
        </div>

        {/* How to use callout */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #E8E8E4",
            borderLeft: "4px solid #9B8FCC",
            borderRadius: 6,
            padding: "16px 20px",
            marginBottom: 48,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#9B8FCC",
              marginBottom: 8,
            }}
          >
            How to use this
          </div>
          <p
            style={{
              fontSize: 14,
              color: "#555555",
              lineHeight: 1.7,
              margin: "0 0 14px",
            }}
          >
            Read the narrative here first. When you are ready to explore the
            system in detail, switch to{" "}
            <strong style={{ fontWeight: 600, color: "#1a1a1a" }}>
              Architecture
            </strong>{" "}
            — an interactive diagram where every node and connector is
            clickable. Click any element to open a detail panel with the full
            rationale, key decisions, and open questions behind it.
          </p>
          <button
            onClick={onSwitchToArchitecture}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              backgroundColor: "#1a1a1a",
              color: "#ffffff",
              border: "none",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              letterSpacing: "-0.01em",
            }}
          >
            Explore the Architecture →
          </button>
        </div>

        {/* Chapters */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {chapters.map((chapter, index) => (
            <div
              key={index}
              style={{
                borderTop: "1px solid #E0DFD9",
                paddingTop: 36,
                paddingBottom: 36,
              }}
            >
              <h2
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#999490",
                  margin: "0 0 16px",
                }}
              >
                {chapter.title}
              </h2>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: "#333333",
                  lineHeight: 1.8,
                  whiteSpace: "pre-line",
                }}
              >
                {chapter.body}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div
          style={{
            borderTop: "1px solid #E0DFD9",
            paddingTop: 36,
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <p
            style={{
              fontSize: 15,
              color: "#555555",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            You now have the full picture. Explore the interactive diagram to
            navigate the architecture node by node, read the reasoning behind
            each decision, and see where the open questions live.
          </p>
          <button
            onClick={onSwitchToArchitecture}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              backgroundColor: "#1a1a1a",
              color: "#ffffff",
              border: "none",
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              alignSelf: "flex-start",
            }}
          >
            Explore the Architecture →
          </button>
          <div
            style={{
              fontSize: 12,
              color: "#AAAAAA",
              lineHeight: 1.6,
              marginTop: 8,
            }}
          >
            Source session: Doug Guttenberg + Claude, DCP AI Innovation and
            Delivery, March 2026.
          </div>
        </div>
      </div>
    </div>
  );
}
