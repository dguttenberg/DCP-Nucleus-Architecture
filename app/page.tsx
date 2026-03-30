"use client";

import { useState, useCallback } from "react";
import { nodes, connectors, narrative } from "@/data/architecture";
import type { ArchNode, ArchConnector } from "@/lib/types";
import NavBar, { type Mode } from "@/components/NavBar";
import ArchitectureCanvas from "@/components/ArchitectureCanvas";
import DetailPanel from "@/components/DetailPanel";
import NarrativeView from "@/components/NarrativeView";
import RoadmapView from "@/components/RoadmapView";

type Selected =
  | { type: "node"; item: ArchNode }
  | { type: "connector"; item: ArchConnector };

export default function Home() {
  const [mode, setMode] = useState<Mode>("narrative");
  const [selected, setSelected] = useState<Selected | null>(null);

  const handleNodeSelect = useCallback((node: ArchNode) => {
    setSelected({ type: "node", item: node });
  }, []);

  const handleConnectorSelect = useCallback((connector: ArchConnector) => {
    setSelected({ type: "connector", item: connector });
  }, []);

  const handleClose = useCallback(() => setSelected(null), []);

  const handleModeChange = useCallback((newMode: Mode) => {
    setMode(newMode);
    if (newMode !== "architecture") setSelected(null);
  }, []);

  const switchToArchitecture = useCallback(() => {
    setMode("architecture");
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <NavBar mode={mode} onModeChange={handleModeChange} />
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {mode === "narrative" ? (
          <NarrativeView
            chapters={narrative}
            onSwitchToArchitecture={switchToArchitecture}
          />
        ) : mode === "roadmap" ? (
          <RoadmapView />
        ) : (
          <ArchitectureCanvas
            nodes={nodes}
            connectors={connectors}
            selectedId={selected?.item.id ?? null}
            onNodeSelect={handleNodeSelect}
            onConnectorSelect={handleConnectorSelect}
          />
        )}
        {mode === "architecture" && selected && (
          <DetailPanel
            selected={selected}
            nodes={nodes}
            connectors={connectors}
            onClose={handleClose}
            onNodeSelect={handleNodeSelect}
          />
        )}
      </div>
    </div>
  );
}
