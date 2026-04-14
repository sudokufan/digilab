import type { Connection, Edge, Node } from "@xyflow/react";
import { nodeConfig } from "../../data/nodeConfig";
import type { NodeType } from "../../types/workflow";

export const makeIsValidConnection =
  (nodes: Node[]) =>
  (c: Connection | Edge): boolean => {
    if (c.source === c.target) return false;

    const src = nodes.find((n) => n.id === c.source);
    const tgt = nodes.find((n) => n.id === c.target);
    if (!src?.type || !tgt?.type) return false;

    return nodeConfig[src.type as NodeType].canConnectTo.includes(
      tgt.type as NodeType,
    );
  };
