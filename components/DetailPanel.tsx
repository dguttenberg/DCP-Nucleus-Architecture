"use client";

import { useEffect, useCallback } from "react";
import type { ArchNode, ArchConnector, Status } from "@/lib/types";

type Selected =
  | { type: "node"; item: ArchNode }
  | { type: "connector"; item: ArchConnector };

interface DetailPanelProps {
  selected: Selected;
  nodes: ArchNode[];
  connectors: ArchConnector[];
  onClose: () => void;
  onNodeSelect: (node: ArchNode) => void;
}

const STATUS_LABELS: Record<Status, string> = {
  built: "Built",
  "built-partial": "Built — partial",
  "in-development": "In development",
  specced: "Specced",
  deferred: "Deferred",
  "existing-partial": "Existing — partial",
};

const STATUS_COLORS: Record<
  Status,
  { bg: string; text: string; border: string }
> = {
  built: { bg: "#E3F4EE", text: "#2D6E52", border: "#7ABFA0" },
  "built-partial": { bg: "#E6F0FA", text: "#1E5480", border: "#7AAED4" },
  "in-development": { bg: "#FDF3E0", text: "#7A5E1E", border: "#D4AA5A" },
  specced: { bg: "#FDF3E0", text: "#7A5E1E", border: "#D4AA5A" },
  deferred: { bg: "#F0EFED", text: "#666666", border: "#AAAAAA" },
  "existing-partial": { bg: "#E3F4EE", text: "#2D6E52", border: "#7ABFA0" },
};

function Section({
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

function BodyText({ children }: { children: React.ReactNode }) {
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

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 10,
            fontSize: 14,
            color: "#555555",
            lineHeight: 1.7,
          }}
        >
          <span
            style={{
              flexShrink: 0,
              marginTop: 6,
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: "#CCCCCC",
            }}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function DetailPanel({
  selected,
  nodes,
  connectors,
  onClose,
  onNodeSelect,
}: DetailPanelProps) {
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

  const getConnectedNodes = (nodeId: string) => {
    const connected: { node: ArchNode; direction: "from" | "to" }[] = [];
    for (const conn of connectors) {
      if (conn.from === nodeId && conn.to !== nodeId) {
        const n = nodes.find((n) => n.id === conn.to);
        if (n) connected.push({ node: n, direction: "to" });
      }
      if (conn.to === nodeId && conn.from !== nodeId) {
        const n = nodes.find((n) => n.id === conn.from);
        if (n) connected.push({ node: n, direction: "from" });
      }
    }
    return connected;
  };

  return (
    <>
      {/* Backdrop (click to close) */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 19,
          background: "transparent",
        }}
      />

      {/* Panel */}
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
            <div style={{ flex: 1, minWidth: 0 }}>
              {selected.type === "node" ? (
                <>
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 500,
                      color: "#1a1a1a",
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {selected.item.label}
                  </h2>
                  {selected.item.sublabel && (
                    <div
                      style={{
                        fontSize: 13,
                        color: "#888888",
                        marginTop: 4,
                      }}
                    >
                      {selected.item.sublabel}
                    </div>
                  )}
                </>
              ) : (
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: "#1a1a1a",
                    margin: 0,
                    lineHeight: 1.35,
                  }}
                >
                  {selected.item.label ?? "Connector"}
                </h2>
              )}
            </div>
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

          {/* Status badge — nodes only */}
          {selected.type === "node" && (
            <div style={{ marginTop: 12 }}>
              {(() => {
                const s = selected.item.status;
                const sc = STATUS_COLORS[s];
                return (
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 8px",
                      borderRadius: 3,
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      backgroundColor: sc.bg,
                      color: sc.text,
                      border: `1px solid ${sc.border}`,
                    }}
                  >
                    {STATUS_LABELS[s]}
                  </span>
                );
              })()}
            </div>
          )}
        </div>

        {/* Scrollable content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px 32px",
          }}
        >
          {selected.type === "node" ? (
            <NodePanelContent
              node={selected.item}
              connectedNodes={getConnectedNodes(selected.item.id)}
              onNodeSelect={onNodeSelect}
            />
          ) : (
            <ConnectorPanelContent
              connector={selected.item}
              nodes={nodes}
              onNodeSelect={onNodeSelect}
            />
          )}
        </div>
      </div>
    </>
  );
}

function NodePanelContent({
  node,
  connectedNodes,
  onNodeSelect,
}: {
  node: ArchNode;
  connectedNodes: { node: ArchNode; direction: "from" | "to" }[];
  onNodeSelect: (node: ArchNode) => void;
}) {
  return (
    <>
      {node.what && (
        <Section title="What">
          <BodyText>{node.what}</BodyText>
        </Section>
      )}

      {node.why && (
        <Section title="Why">
          <BodyText>{node.why}</BodyText>
        </Section>
      )}

      {node.how && (
        <Section title="How">
          <BodyText>{node.how}</BodyText>
        </Section>
      )}

      {node.why_deferred && (
        <Section title="Why deferred">
          <BodyText>{node.why_deferred}</BodyText>
        </Section>
      )}

      {node.strategic_context && (
        <Section title="Strategic context">
          <BodyText>{node.strategic_context}</BodyText>
        </Section>
      )}

      {node.decisions && node.decisions.length > 0 && (
        <Section title="Key decisions">
          <BulletList items={node.decisions} />
        </Section>
      )}

      {node.open_questions && node.open_questions.length > 0 && (
        <Section title="Open questions">
          <BulletList items={node.open_questions} />
        </Section>
      )}

      {node.status_detail && (
        <Section title="Build status">
          <BodyText>{node.status_detail}</BodyText>
        </Section>
      )}

      {connectedNodes.length > 0 && (
        <Section title="Connected to">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {connectedNodes.map(({ node: cn }) => (
              <button
                key={cn.id}
                onClick={() => onNodeSelect(cn)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  background: "#F9F9F7",
                  border: "1px solid #EBEBЕ7",
                  borderRadius: 4,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#F0EFEB")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#F9F9F7")
                }
              >
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a" }}
                  >
                    {cn.label}
                  </div>
                  {cn.sublabel && (
                    <div style={{ fontSize: 11, color: "#888888", marginTop: 1 }}>
                      {cn.sublabel}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

function ConnectorPanelContent({
  connector,
  nodes,
  onNodeSelect,
}: {
  connector: ArchConnector;
  nodes: ArchNode[];
  onNodeSelect: (node: ArchNode) => void;
}) {
  const fromNode = nodes.find((n) => n.id === connector.from);
  const toNode = nodes.find((n) => n.id === connector.to);

  return (
    <>
      {connector.description && (
        <Section title="What travels here">
          <BodyText>{connector.description}</BodyText>
        </Section>
      )}

      <Section title="Connection">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {fromNode && (
            <button
              onClick={() => onNodeSelect(fromNode)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                background: "#F9F9F7",
                border: "1px solid #EBEBЕ7",
                borderRadius: 4,
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#F0EFEB")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#F9F9F7")
              }
            >
              <span style={{ fontSize: 10, color: "#AAAAAA", minWidth: 30 }}>
                From
              </span>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a" }}>
                {fromNode.label}
              </span>
            </button>
          )}
          <div
            style={{
              textAlign: "center",
              fontSize: 16,
              color: "#CCCCCC",
              lineHeight: 1,
            }}
          >
            ↓
          </div>
          {toNode && (
            <button
              onClick={() => onNodeSelect(toNode)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                background: "#F9F9F7",
                border: "1px solid #EBEBЕ7",
                borderRadius: 4,
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#F0EFEB")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#F9F9F7")
              }
            >
              <span style={{ fontSize: 10, color: "#AAAAAA", minWidth: 30 }}>
                To
              </span>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a" }}>
                {toNode.label}
              </span>
            </button>
          )}
        </div>
      </Section>
    </>
  );
}
