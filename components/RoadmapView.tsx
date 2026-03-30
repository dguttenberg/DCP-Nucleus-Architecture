"use client";

import { useState, useCallback, useEffect } from "react";
import {
  initiatives,
  phases,
  workstreams,
  phaseDescriptions,
} from "@/data/roadmap";
import type { Initiative, InitiativeStatus } from "@/data/roadmap";
import { CATEGORY_PRIMARY } from "@/components/NodeCard";

// ─── Status badge config ────────────────────────────────────────────────────

const STATUS_BADGE: Record<
  InitiativeStatus,
  { bg: string; text: string; label: string }
> = {
  "in-progress": { bg: "#E3F4EE", text: "#2D6E52", label: "In progress" },
  "next-up":     { bg: "#E6F0FA", text: "#1E5480", label: "Next up" },
  "dependent":   { bg: "#FDF3E0", text: "#7A5E1E", label: "Dependent" },
  "ongoing":     { bg: "#F0EFED", text: "#666666", label: "Ongoing" },
};

// ─── Initiative card ────────────────────────────────────────────────────────

function InitiativeCard({
  initiative,
  isSelected,
  isDimmed,
  onSelect,
}: {
  initiative: Initiative;
  isSelected: boolean;
  isDimmed: boolean;
  onSelect: (i: Initiative) => void;
}) {
  const colors = CATEGORY_PRIMARY[initiative.category];
  const badge = STATUS_BADGE[initiative.status];

  return (
    <button
      onClick={() => onSelect(initiative)}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        backgroundColor: colors.fill,
        border: `1px solid ${isSelected ? colors.stroke : colors.stroke}`,
        borderLeft: `4px solid ${colors.stroke}`,
        borderRadius: 4,
        padding: "8px 12px",
        cursor: "pointer",
        opacity: isDimmed ? 0.25 : 1,
        boxShadow: isSelected
          ? `0 0 0 2px ${colors.stroke}, 0 2px 8px rgba(0,0,0,0.1)`
          : "0 1px 3px rgba(0,0,0,0.05)",
        transition: "opacity 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: colors.text,
          lineHeight: 1.35,
          marginBottom: 6,
        }}
      >
        {initiative.title}
      </div>
      <span
        style={{
          display: "inline-block",
          padding: "2px 6px",
          borderRadius: 3,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          backgroundColor: badge.bg,
          color: badge.text,
        }}
      >
        {badge.label}
      </span>
    </button>
  );
}

// ─── Detail panel ────────────────────────────────────────────────────────────

function DetailPanel({
  initiative,
  onClose,
}: {
  initiative: Initiative;
  onClose: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const colors = CATEGORY_PRIMARY[initiative.category];
  const badge = STATUS_BADGE[initiative.status];

  const deps = initiative.dependencies ?? [];
  const depTitles = deps.map(
    (id) => initiatives.find((i) => i.id === id)?.title ?? id
  );

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 19,
          background: "transparent",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 420,
          backgroundColor: "#ffffff",
          borderLeft: "1px solid #E8E8E4",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.07)",
          animation: "slideInPanel 0.22s ease",
        }}
      >
        <style>{`
          @keyframes slideInPanel {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid #F0EFEB",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "#1a1a1a",
                margin: 0,
                lineHeight: 1.3,
                flex: 1,
              }}
            >
              {initiative.title}
            </h2>
            <button
              onClick={onClose}
              style={{
                flexShrink: 0,
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "1px solid #E8E8E4",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 16,
                color: "#999999",
                marginTop: 2,
              }}
            >
              ×
            </button>
          </div>

          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <span
              style={{
                display: "inline-block",
                padding: "3px 8px",
                borderRadius: 3,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                backgroundColor: badge.bg,
                color: badge.text,
              }}
            >
              {badge.label}
            </span>
            <span
              style={{
                display: "inline-block",
                padding: "3px 8px",
                borderRadius: 3,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                backgroundColor: colors.fill,
                color: colors.text,
                border: `1px solid ${colors.stroke}`,
              }}
            >
              {initiative.category}
            </span>
          </div>
        </div>

        {/* Scrollable content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px 32px",
          }}
        >
          <PanelSection title="What">
            <PanelBody>{initiative.what}</PanelBody>
          </PanelSection>

          <PanelSection title="Why">
            <PanelBody>{initiative.why}</PanelBody>
          </PanelSection>

          <PanelSection title="Owner">
            <PanelBody>{initiative.owner}</PanelBody>
          </PanelSection>

          {depTitles.length > 0 && (
            <PanelSection title="Depends on">
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {depTitles.map((t, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      gap: 10,
                      marginBottom: 8,
                      fontSize: 13,
                      color: "#555555",
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        marginTop: 5,
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        backgroundColor: "#CCCCCC",
                      }}
                    />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </PanelSection>
          )}

          {initiative.clientPressureTest && (
            <PanelSection title="Client pressure test">
              <PanelBody>{initiative.clientPressureTest}</PanelBody>
            </PanelSection>
          )}
        </div>
      </div>
    </>
  );
}

function PanelSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#AAAAAA",
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function PanelBody({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 14,
        fontWeight: 400,
        color: "#555555",
        lineHeight: 1.7,
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

// ─── Main RoadmapView ────────────────────────────────────────────────────────

export default function RoadmapView() {
  const [selected, setSelected] = useState<Initiative | null>(null);
  const [highlight, setHighlight] = useState<{
    type: "phase" | "workstream";
    value: number;
  } | null>(null);

  const handleSelect = useCallback((i: Initiative) => {
    setSelected((prev) => (prev?.id === i.id ? null : i));
    setHighlight(null);
  }, []);

  const handleClose = useCallback(() => setSelected(null), []);

  const getInitiatives = (ws: number, phase: number) =>
    initiatives.filter((i) => i.workstream === ws && i.phase === phase);

  const isCardDimmed = (initiative: Initiative) => {
    if (highlight) {
      if (highlight.type === "phase") return initiative.phase !== highlight.value;
      if (highlight.type === "workstream") return initiative.workstream !== highlight.value;
    }
    return false;
  };

  const toggleHighlight = (type: "phase" | "workstream", value: number) => {
    setHighlight((prev) =>
      prev?.type === type && prev?.value === value ? null : { type, value }
    );
    setSelected(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#F5F4F0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Scrollable grid area */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "auto" }}>
        <div style={{ minWidth: 900, padding: "32px 32px 48px" }}>

          {/* Grid */}
          <div style={{ display: "flex" }}>

            {/* Left: workstream label column */}
            <div style={{ width: 200, flexShrink: 0 }}>
              {/* Spacer for phase header */}
              <div style={{ height: 88 }} />
              {workstreams.map((ws) => {
                const rowItems = initiatives.filter((i) => i.workstream === ws.id);
                const rowHeight = Math.max(
                  ...phases.map((p) => {
                    const count = rowItems.filter((i) => i.phase === p.id).length;
                    return count * 72 + (count - 1) * 6 + 24;
                  })
                );
                const isHighlighted =
                  highlight?.type === "workstream" && highlight.value === ws.id;

                return (
                  <div
                    key={ws.id}
                    onClick={() => toggleHighlight("workstream", ws.id)}
                    style={{
                      height: rowHeight,
                      paddingRight: 16,
                      paddingTop: 12,
                      cursor: "pointer",
                      borderRadius: "6px 0 0 6px",
                      backgroundColor: isHighlighted
                        ? "rgba(26,26,26,0.04)"
                        : "transparent",
                      transition: "background 0.15s",
                      borderBottom: "1px solid #E8E7E3",
                    }}
                    onMouseEnter={(e) => {
                      if (!isHighlighted)
                        e.currentTarget.style.backgroundColor =
                          "rgba(26,26,26,0.025)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isHighlighted
                        ? "rgba(26,26,26,0.04)"
                        : "transparent";
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: isHighlighted ? "#1a1a1a" : "#999490",
                        lineHeight: 1.4,
                        marginBottom: 4,
                        transition: "color 0.15s",
                      }}
                    >
                      WS{ws.id}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: isHighlighted ? "#333333" : "#666666",
                        lineHeight: 1.4,
                        marginBottom: 4,
                        transition: "color 0.15s",
                      }}
                    >
                      {ws.label}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 400,
                        color: "#AAAAAA",
                        lineHeight: 1.4,
                      }}
                    >
                      {ws.owner}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: phase columns */}
            <div style={{ flex: 1, position: "relative" }}>

              {/* Milestone marker */}
              <div
                style={{
                  position: "absolute",
                  left: "25%",
                  top: 88,
                  bottom: 0,
                  width: 0,
                  borderLeft: "2px dashed #BBBBBB",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              />
              {/* Milestone flag */}
              <div
                style={{
                  position: "absolute",
                  left: "25%",
                  top: 20,
                  transform: "translateX(-50%)",
                  zIndex: 3,
                  pointerEvents: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    backgroundColor: "#1a1a1a",
                    color: "#ffffff",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    padding: "3px 8px",
                    borderRadius: 3,
                    whiteSpace: "nowrap",
                  }}
                >
                  Day 90
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#888888",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    lineHeight: 1.3,
                  }}
                >
                  Definition complete —
                  <br />
                  story and demo materials exist
                </div>
              </div>

              {/* Phase header row */}
              <div style={{ display: "flex", marginBottom: 0 }}>
                {phases.map((phase) => {
                  const isHighlighted =
                    highlight?.type === "phase" && highlight.value === phase.id;
                  return (
                    <div
                      key={phase.id}
                      onClick={() => toggleHighlight("phase", phase.id)}
                      style={{
                        flex: 1,
                        padding: "12px 12px 16px",
                        cursor: "pointer",
                        borderRadius: "6px 6px 0 0",
                        backgroundColor: isHighlighted
                          ? "rgba(26,26,26,0.04)"
                          : "transparent",
                        transition: "background 0.15s",
                        borderBottom: "1px solid #E8E7E3",
                      }}
                      onMouseEnter={(e) => {
                        if (!isHighlighted)
                          e.currentTarget.style.backgroundColor =
                            "rgba(26,26,26,0.025)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isHighlighted
                          ? "rgba(26,26,26,0.04)"
                          : "transparent";
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: isHighlighted ? "#1a1a1a" : "#AAAAAA",
                          marginBottom: 3,
                          transition: "color 0.15s",
                        }}
                      >
                        {phase.label}
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: isHighlighted ? "#1a1a1a" : "#333333",
                          lineHeight: 1.3,
                          marginBottom: 4,
                          transition: "color 0.15s",
                        }}
                      >
                        {phase.subtitle}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#999999",
                          lineHeight: 1.5,
                        }}
                      >
                        {phaseDescriptions[phase.id]}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Initiative cells grid */}
              {workstreams.map((ws) => {
                // Calculate row height to match the workstream label column
                const rowItems = initiatives.filter((i) => i.workstream === ws.id);
                const rowHeight = Math.max(
                  ...phases.map((p) => {
                    const count = rowItems.filter((i) => i.phase === p.id).length;
                    return count * 72 + (count - 1) * 6 + 24;
                  })
                );

                return (
                  <div
                    key={ws.id}
                    style={{
                      display: "flex",
                      borderBottom: "1px solid #E8E7E3",
                      height: rowHeight,
                    }}
                  >
                    {phases.map((phase) => {
                      const cellInitiatives = getInitiatives(ws.id, phase.id);
                      return (
                        <div
                          key={phase.id}
                          style={{
                            flex: 1,
                            padding: "12px 10px",
                            borderRight:
                              phase.id < 4 ? "1px solid #E8E7E3" : "none",
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                          }}
                        >
                          {cellInitiatives.map((initiative) => (
                            <InitiativeCard
                              key={initiative.id}
                              initiative={initiative}
                              isSelected={selected?.id === initiative.id}
                              isDimmed={isCardDimmed(initiative)}
                              onSelect={handleSelect}
                            />
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        >
          <div style={{ position: "relative", height: "100%", pointerEvents: "auto" }}>
            <DetailPanel initiative={selected} onClose={handleClose} />
          </div>
        </div>
      )}
    </div>
  );
}
