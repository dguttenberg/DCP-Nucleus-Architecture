"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { Node } from "@xyflow/react";
import type { ArchNode, Category, Status } from "@/lib/types";

export interface NodeCardData extends Record<string, unknown> {
  node: ArchNode;
  isSelected: boolean;
  isDimmed: boolean;
}

export type NodeCardNode = Node<NodeCardData, "archNode">;

// Primary nodes: full category fill, stronger presence
export const CATEGORY_PRIMARY: Record<
  Category,
  { fill: string; stroke: string; text: string }
> = {
  core:             { fill: "#EAE6F5", stroke: "#9B8FCC", text: "#4A3D8A" },
  knowledge:        { fill: "#E3F4EE", stroke: "#7ABFA0", text: "#2D6E52" },
  satellite:        { fill: "#E6F0FA", stroke: "#7AAED4", text: "#1E5480" },
  agent:            { fill: "#FCEEE8", stroke: "#D4845A", text: "#8A3D1E" },
  evolving:         { fill: "#FDF3E0", stroke: "#D4AA5A", text: "#7A5E1E" },
  external:         { fill: "#FDF3E0", stroke: "#D4AA5A", text: "#7A5E1E" },
  "low-confidence": { fill: "#F0EFED", stroke: "#AAAAAA", text: "#666666" },
};

// Secondary nodes: lighter tint, quieter presence
const CATEGORY_SECONDARY: Record<
  Category,
  { fill: string; stroke: string; text: string }
> = {
  core:             { fill: "#F3F1FB", stroke: "#C0BADF", text: "#5A4F9A" },
  knowledge:        { fill: "#F2FAF6", stroke: "#AADAC7", text: "#3A7E62" },
  satellite:        { fill: "#EFF6FC", stroke: "#AACDE5", text: "#2A6490" },
  agent:            { fill: "#FEF6F2", stroke: "#E8B49C", text: "#9A4D2E" },
  evolving:         { fill: "#FEF9EF", stroke: "#E3CC9A", text: "#8A6E2E" },
  external:         { fill: "#FEF9EF", stroke: "#E3CC9A", text: "#8A6E2E" },
  "low-confidence": { fill: "#F8F7F6", stroke: "#CCCCCC", text: "#777777" },
};

// Left accent color — communicates build status at a glance
export const STATUS_ACCENT: Record<Status, string> = {
  built:            "#2D6E52",
  "built-partial":  "#1E5480",
  "in-development": "#C49A30",
  specced:          "#AAAAAA",
  deferred:         "#D8D8D8",
  "existing-partial": "#4A7A5E",
};

export const STATUS_LABELS: Record<Status, string> = {
  built:            "Built",
  "built-partial":  "Built — partial",
  "in-development": "In development",
  specced:          "Specced",
  deferred:         "Deferred",
  "existing-partial": "Existing",
};

export default function NodeCard({ data }: NodeProps<NodeCardNode>) {
  const { node, isSelected, isDimmed } = data;
  const isPrimary = !node.parent;
  const colors = isPrimary
    ? CATEGORY_PRIMARY[node.category]
    : CATEGORY_SECONDARY[node.category];
  const accentColor = STATUS_ACCENT[node.status];
  const isDashed = node.style === "dashed";
  const borderStyle = isDashed ? "dashed" : "solid";

  if (isPrimary) {
    return (
      <>
        <Handle type="target" position={Position.Left}   style={{ opacity: 0, pointerEvents: "none" }} />
        <Handle type="target" position={Position.Top}    style={{ opacity: 0, pointerEvents: "none" }} />
        <div
          style={{
            backgroundColor: colors.fill,
            borderTop:    `2px ${borderStyle} ${colors.stroke}`,
            borderRight:  `2px ${borderStyle} ${colors.stroke}`,
            borderBottom: `2px ${borderStyle} ${colors.stroke}`,
            borderLeft:   `6px solid ${accentColor}`,
            borderRadius: 8,
            padding: "14px 18px",
            minWidth: 200,
            maxWidth: 250,
            opacity: isDimmed ? 0.18 : 1,
            boxShadow: isSelected
              ? `0 0 0 3px ${colors.stroke}, 0 4px 16px rgba(0,0,0,0.14)`
              : "0 2px 8px rgba(0,0,0,0.08)",
            transition: "opacity 0.2s ease, box-shadow 0.2s ease",
            userSelect: "none",
          }}
        >
          {node.badge && (
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", color: colors.text, opacity: 0.55, marginBottom: 4,
            }}>
              {node.badge}
            </div>
          )}
          <div style={{ fontSize: 15, fontWeight: 600, color: colors.text, lineHeight: 1.3 }}>
            {node.label}
          </div>
          {node.sublabel && (
            <div style={{
              fontSize: 12, fontWeight: 400, color: colors.text,
              opacity: 0.62, marginTop: 3, lineHeight: 1.35,
            }}>
              {node.sublabel}
            </div>
          )}
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              backgroundColor: accentColor, flexShrink: 0,
            }} />
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", color: colors.text, opacity: 0.55,
            }}>
              {STATUS_LABELS[node.status]}
            </span>
          </div>
        </div>
        <Handle type="source" position={Position.Right}  style={{ opacity: 0, pointerEvents: "none" }} />
        <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: "none" }} />
      </>
    );
  }

  // Secondary node — lighter, smaller, clearly subordinate
  return (
    <>
      <Handle type="target" position={Position.Left}   style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="target" position={Position.Top}    style={{ opacity: 0, pointerEvents: "none" }} />
      <div
        style={{
          backgroundColor: colors.fill,
          borderTop:    `1px ${borderStyle} ${colors.stroke}`,
          borderRight:  `1px ${borderStyle} ${colors.stroke}`,
          borderBottom: `1px ${borderStyle} ${colors.stroke}`,
          borderLeft:   `3px solid ${accentColor}`,
          borderRadius: 5,
          padding: "9px 13px",
          minWidth: 165,
          maxWidth: 215,
          opacity: isDimmed ? 0.18 : 1,
          boxShadow: isSelected
            ? `0 0 0 2px ${colors.stroke}, 0 2px 10px rgba(0,0,0,0.1)`
            : "0 1px 3px rgba(0,0,0,0.04)",
          transition: "opacity 0.2s ease, box-shadow 0.2s ease",
          userSelect: "none",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 500, color: colors.text, lineHeight: 1.35 }}>
          {node.label}
        </div>
        {node.sublabel && (
          <div style={{
            fontSize: 10, fontWeight: 400, color: colors.text,
            opacity: 0.55, marginTop: 2, lineHeight: 1.3,
          }}>
            {node.sublabel}
          </div>
        )}
        <div style={{ marginTop: 7, display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{
            width: 5, height: 5, borderRadius: "50%",
            backgroundColor: accentColor, flexShrink: 0,
          }} />
          <span style={{
            fontSize: 8, fontWeight: 700, letterSpacing: "0.07em",
            textTransform: "uppercase", color: colors.text, opacity: 0.5,
          }}>
            {STATUS_LABELS[node.status]}
          </span>
        </div>
      </div>
      <Handle type="source" position={Position.Right}  style={{ opacity: 0, pointerEvents: "none" }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: "none" }} />
    </>
  );
}
