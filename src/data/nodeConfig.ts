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
