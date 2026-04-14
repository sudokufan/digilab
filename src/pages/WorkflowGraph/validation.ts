import type { Connection, Edge, Node } from "@xyflow/react";
import { nodeConfig } from "../../data/nodeConfig";
import type { NodeType } from "../../types/workflow";

export const makeIsValidConnection =
  (nodes: Node[]) =>
  (c: Connection | Edge): boolean => {
    // self-loop guard, incase canConnectTo data isn't properly protective
    if (c.source === c.target) return false;

    const source = nodes.find((n) => n.id === c.source);
    const target = nodes.find((n) => n.id === c.target);
    if (!source?.type || !target?.type) return false;

    return nodeConfig[source.type as NodeType].canConnectTo.includes(
      target.type as NodeType,
    );
  };
