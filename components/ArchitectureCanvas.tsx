"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  Handle,
  Position,
  type NodeMouseHandler,
  type EdgeMouseHandler,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import NodeCard, {
  CATEGORY_PRIMARY,
  STATUS_ACCENT,
  STATUS_LABELS,
  type NodeCardData,
} from "@/components/NodeCard";
import type { ArchNode, ArchConnector } from "@/lib/types";

// ─── Zone panel node ──────────────────────────────────────────────────────────

interface ZonePanelData extends Record<string, unknown> {
  label: string;
  panelWidth: number;
  panelHeight: number;
  fillColor: string;
  strokeColor: string;
  textColor: string;
}

function ZonePanelNode({ data }: NodeProps<Node<ZonePanelData, "zonePanel">>) {
  return (
    <div
      style={{
        width: data.panelWidth,
        height: data.panelHeight,
        backgroundColor: data.fillColor,
        border: `2px solid ${data.strokeColor}`,
        borderRadius: 12,
        padding: "12px 16px",
        pointerEvents: "none",
        boxSizing: "border-box",
      }}
    >
      {data.label && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: data.textColor,
          }}
        >
          {data.label}
        </span>
      )}
    </div>
  );
}

// ─── Section header node ──────────────────────────────────────────────────────
// Replaces the floating primary node card — anchored at top of each zone panel

interface SectionHeaderData extends Record<string, unknown> {
  node: ArchNode;
  isSelected: boolean;
  isDimmed: boolean;
  headerWidth: number;
}

function SectionHeaderNode({
  data,
}: NodeProps<Node<SectionHeaderData, "sectionHeader">>) {
  const { node, isSelected, isDimmed, headerWidth } = data;
  const colors = CATEGORY_PRIMARY[node.category];
  const accentColor = STATUS_ACCENT[node.status];

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
      {/* Outer wrapper provides the selected ring */}
      <div
        style={{
          width: headerWidth,
          borderRadius: 10,
          boxShadow: isSelected
            ? `0 0 0 3px ${colors.stroke}, 0 6px 24px rgba(0,0,0,0.18)`
            : "0 4px 14px rgba(0,0,0,0.11)",
          opacity: isDimmed ? 0.18 : 1,
          transition: "opacity 0.2s ease, box-shadow 0.2s ease",
          overflow: "hidden",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {/* Colored header band */}
        <div
          style={{
            backgroundColor: colors.stroke,
            padding: "10px 16px 10px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.01em",
              lineHeight: 1.2,
            }}
          >
            {node.label}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                opacity: 0.85,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#ffffff",
                opacity: 0.85,
                whiteSpace: "nowrap",
              }}
            >
              {STATUS_LABELS[node.status]}
            </span>
          </div>
        </div>
        {/* Off-white body with sublabel */}
        <div
          style={{
            backgroundColor: colors.fill,
            borderLeft: `5px solid ${accentColor}`,
            padding: "8px 16px 10px 15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: colors.text,
              opacity: 0.7,
              lineHeight: 1.4,
              flex: 1,
            }}
          >
            {node.sublabel ?? "Click to view details"}
          </div>
          <span
            style={{
              fontSize: 10,
              color: colors.text,
              opacity: 0.4,
              whiteSpace: "nowrap",
              marginLeft: 10,
            }}
          >
            details →
          </span>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0, pointerEvents: "none" }}
      />
    </>
  );
}

// ─── Section header definitions ───────────────────────────────────────────────
// Primary nodes that become zone header banners instead of floating cards

const SECTION_HEADER_DEFS: Record<
  string,
  { position: { x: number; y: number }; width: number }
> = {
  ingestion_pipeline: { position: { x: -74,  y: 30  }, width: 420 },
  knowledge_stores:   { position: { x: 40,   y: 190 }, width: 287 },
  nucleus:            { position: { x: 480,  y: 190 }, width: 287 },
  satellites:         { position: { x: 1070, y: 190 }, width: 287 },
};

const SECTION_HEADER_IDS = new Set(Object.keys(SECTION_HEADER_DEFS));

// ─── Zone panel definitions ───────────────────────────────────────────────────

const ZONE_PANELS: Node<ZonePanelData, "zonePanel">[] = [
  {
    id: "zone-ingestion",
    position: { x: -90, y: 20 },
    type: "zonePanel",
    data: {
      label: "",
      panelWidth: 460,
      panelHeight: 120,
      fillColor: "rgba(234,230,245,0.5)",
      strokeColor: "rgba(155,143,204,0.5)",
      textColor: "#9B8FCC",
    },
    draggable: false,
    selectable: false,
    focusable: false,
    zIndex: -1,
  },
  {
    id: "zone-knowledge",
    position: { x: 28, y: 175 },
    type: "zonePanel",
    data: {
      label: "",
      panelWidth: 315,
      panelHeight: 1115,
      fillColor: "rgba(227,244,238,0.5)",
      strokeColor: "rgba(122,191,160,0.5)",
      textColor: "#7ABFA0",
    },
    draggable: false,
    selectable: false,
    focusable: false,
    zIndex: -1,
  },
  {
    id: "zone-nucleus",
    position: { x: 468, y: 175 },
    type: "zonePanel",
    data: {
      label: "",
      panelWidth: 315,
      panelHeight: 790,
      fillColor: "rgba(234,230,245,0.5)",
      strokeColor: "rgba(155,143,204,0.5)",
      textColor: "#9B8FCC",
    },
    draggable: false,
    selectable: false,
    focusable: false,
    zIndex: -1,
  },
  {
    id: "zone-satellites",
    position: { x: 1058, y: 175 },
    type: "zonePanel",
    data: {
      label: "",
      panelWidth: 315,
      panelHeight: 790,
      fillColor: "rgba(230,240,250,0.5)",
      strokeColor: "rgba(122,174,212,0.5)",
      textColor: "#7AAED4",
    },
    draggable: false,
    selectable: false,
    focusable: false,
    zIndex: -1,
  },
  {
    id: "zone-design-pipelines",
    position: { x: 20, y: 1305 },
    type: "zonePanel",
    data: {
      label: "Design Pipelines",
      panelWidth: 600,
      panelHeight: 205,
      fillColor: "rgba(253,243,224,0.5)",
      strokeColor: "rgba(212,170,90,0.5)",
      textColor: "#D4AA5A",
    },
    draggable: false,
    selectable: false,
    focusable: false,
    zIndex: -1,
  },
];

// ─── Node types ───────────────────────────────────────────────────────────────

const nodeTypes = {
  archNode: NodeCard,
  zonePanel: ZonePanelNode,
  sectionHeader: SectionHeaderNode,
};

// ─── Edge routing config ─────────────────────────────────────────────────────
// Per-connector overrides that force arrows to travel along zone corridors,
// not through zone interiors.

// Connectors hidden from the canvas — relationship explained in detail panel
const HIDDEN_CONNECTOR_IDS = new Set(["account_to_stores"]);

interface EdgeRouting {
  sourcePosition?: Position;
  targetPosition?: Position;
  edgeType?: string;
}

const EDGE_ROUTING: Record<string, EdgeRouting> = {
  // Main flow: horizontal between zone section headers
  brand_materials_to_ingestion: {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  ingestion_to_stores: {
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  stores_to_nucleus: {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  // Highlighted SKILL.md loop — routes through the nucleus↔satellites corridor
  skill_to_interpretation: {
    sourcePosition: Position.Left,
    targetPosition: Position.Right,
    edgeType: "smoothstep",
  },
  interpretation_to_satellite: {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    edgeType: "smoothstep",
  },
  // Token pipelines — straight vertical drops into design pipelines zone below
  tokens_to_adobe: {
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  tokens_to_figma: {
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  // Deferred connection — exits TOP of nucleus, routes UP to The Machine above
  nucleus_to_machine: {
    sourcePosition: Position.Top,
    targetPosition: Position.Bottom,
    edgeType: "smoothstep",
  },
};

// ─── Virtual input node ───────────────────────────────────────────────────────

const BRAND_MATERIALS_NODE: ArchNode = {
  id: "brand_materials_input",
  label: "Brand materials",
  sublabel: "Decks · briefs · guidelines · notes",
  category: "external",
  status: "existing-partial",
  position: { x: -280, y: 40 },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface ArchitectureCanvasProps {
  nodes: ArchNode[];
  connectors: ArchConnector[];
  selectedId: string | null;
  onNodeSelect: (node: ArchNode) => void;
  onConnectorSelect: (connector: ArchConnector) => void;
}

export default function ArchitectureCanvas({
  nodes: archNodes,
  connectors,
  selectedId,
  onNodeSelect,
  onConnectorSelect,
}: ArchitectureCanvasProps) {
  const allArchNodes = useMemo(
    () => [BRAND_MATERIALS_NODE, ...archNodes],
    [archNodes]
  );

  // Nodes connected to the selected node (including the selected node itself)
  const connectedIds = useMemo(() => {
    if (!selectedId) return new Set<string>();
    const ids = new Set<string>();
    for (const c of connectors) {
      if (c.from === selectedId || c.to === selectedId) {
        ids.add(c.from);
        ids.add(c.to);
      }
    }
    ids.add(selectedId);
    return ids;
  }, [selectedId, connectors]);

  // Section header nodes — rendered as wide zone banners, not cards
  const sectionHeaderNodes: Node<SectionHeaderData, "sectionHeader">[] =
    useMemo(() => {
      return allArchNodes
        .filter((n) => SECTION_HEADER_IDS.has(n.id))
        .map((node) => {
          const def = SECTION_HEADER_DEFS[node.id];
          return {
            id: node.id,
            position: def.position,
            type: "sectionHeader" as const,
            data: {
              node,
              isSelected: selectedId === node.id,
              isDimmed: selectedId !== null && !connectedIds.has(node.id),
              headerWidth: def.width,
            },
            draggable: false,
            selectable: true,
            zIndex: 1,
          };
        });
    }, [allArchNodes, selectedId, connectedIds]);

  // Regular card nodes — skip section headers (they get their own node type)
  const contentNodes: Node<NodeCardData, "archNode">[] = useMemo(() => {
    return allArchNodes
      .filter((node) => !SECTION_HEADER_IDS.has(node.id))
      .map((node) => ({
        id: node.id,
        position: node.position,
        type: "archNode" as const,
        data: {
          node,
          isSelected: selectedId === node.id,
          isDimmed: selectedId !== null && !connectedIds.has(node.id),
        },
        draggable: false,
        selectable: true,
        zIndex: 1,
      }));
  }, [allArchNodes, selectedId, connectedIds]);

  // Combine: zone panels (behind) → section headers → content nodes
  const rfNodes = useMemo(
    () => [...ZONE_PANELS, ...sectionHeaderNodes, ...contentNodes],
    [sectionHeaderNodes, contentNodes]
  );

  const rfEdges: Edge[] = useMemo(() => {
    return connectors
      .filter((conn) => !HIDDEN_CONNECTOR_IDS.has(conn.id))
      .map((conn) => {
        const isDashed = conn.style === "dashed";
        const isHighlighted = conn.style === "highlighted";

        const isConnectedToSelected =
          selectedId !== null &&
          (conn.from === selectedId ||
            conn.to === selectedId ||
            connectedIds.has(conn.from) ||
            connectedIds.has(conn.to));

        const edgeDimmed = selectedId !== null && !isConnectedToSelected;

        const strokeColor = isHighlighted
          ? "#9B8FCC"
          : edgeDimmed
          ? "#E0DFDA"
          : "#BBBBBB";

        const routing = EDGE_ROUTING[conn.id];
        const edgeType =
          routing?.edgeType ??
          (conn.style === "curved" ? "smoothstep" : "default");

        return {
          id: conn.id,
          source: conn.from,
          target: conn.to,
          sourcePosition: routing?.sourcePosition,
          targetPosition: routing?.targetPosition,
          label: conn.label,
          labelStyle: {
            fontSize: 9,
            fill: edgeDimmed ? "#DDDDDD" : "#AAAAAA",
            fontFamily: "var(--font-inter), Arial, sans-serif",
            fontWeight: 500,
          },
          labelBgStyle: {
            fill: "#F5F4F0",
            fillOpacity: 0.92,
          },
          labelBgPadding: [4, 3] as [number, number],
          labelBgBorderRadius: 2,
          animated: isHighlighted,
          style: {
            stroke: strokeColor,
            strokeWidth: isHighlighted ? 2 : 1.5,
            strokeDasharray: isDashed ? "6 4" : undefined,
            opacity: edgeDimmed ? 0.2 : 1,
            transition: "opacity 0.2s ease",
          },
          markerEnd: {
            type: MarkerType.Arrow,
            color: strokeColor,
            strokeWidth: 1.5,
            width: 14,
            height: 14,
          },
          type: edgeType,
          interactionWidth: 20,
          zIndex: 0,
        };
      });
  }, [connectors, selectedId, connectedIds]);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, rfNode) => {
      const archNode = allArchNodes.find((n) => n.id === rfNode.id);
      if (archNode) onNodeSelect(archNode);
    },
    [allArchNodes, onNodeSelect]
  );

  const onEdgeClick: EdgeMouseHandler = useCallback(
    (_, edge) => {
      const conn = connectors.find((c) => c.id === edge.id);
      if (conn) onConnectorSelect(conn);
    },
    [connectors, onConnectorSelect]
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        minZoom={0.2}
        maxZoom={1.5}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#E2E1DD" gap={28} size={1} />
        <Controls position="bottom-right" showInteractive={false} />
        <StatusLegend />
      </ReactFlow>
    </div>
  );
}

// ─── Status legend ─────────────────────────────────────────────────────────────

const LEGEND_ITEMS = [
  { label: "Built", color: "#2D6E52" },
  { label: "Built — partial", color: "#1E5480" },
  { label: "In development", color: "#C49A30" },
  { label: "Specced", color: "#AAAAAA" },
  { label: "Deferred", color: "#DDDDDD" },
];

function StatusLegend() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        left: 16,
        backgroundColor: "rgba(255,255,255,0.92)",
        border: "1px solid #E8E8E4",
        borderRadius: 6,
        padding: "10px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 5,
        zIndex: 10,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#AAAAAA",
          marginBottom: 2,
        }}
      >
        Build status
      </div>
      {LEGEND_ITEMS.map(({ label, color }) => (
        <div
          key={label}
          style={{ display: "flex", alignItems: "center", gap: 7 }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: color,
              flexShrink: 0,
              border: color === "#DDDDDD" ? "1px solid #CCCCCC" : "none",
            }}
          />
          <span style={{ fontSize: 11, color: "#666666" }}>{label}</span>
        </div>
      ))}
    </div>
  );
}
