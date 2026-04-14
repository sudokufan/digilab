import type { NodeType } from "../types/workflow";

export type NodeConfigEntry = {
  label: string;
  canConnectTo: NodeType[];
};

export const nodeConfig: Record<NodeType, NodeConfigEntry> = {
  "data-source": {
    label: "Load Dataset",
    canConnectTo: ["transform"],
  },
  transform: {
    label: "Train Model",
    canConnectTo: ["sink"],
  },
  sink: {
    label: "Save Model",
    canConnectTo: [],
  },
};

export const hasIncomingRule = (type: NodeType): boolean =>
  (Object.keys(nodeConfig) as NodeType[]).some((t) =>
    nodeConfig[t].canConnectTo.includes(type),
  );

export const hasOutgoingRule = (type: NodeType): boolean =>
  nodeConfig[type].canConnectTo.length > 0;
