import type { NodeType } from "../types/workflow";

export type NodeConfigEntry = {
  label: string;
  description: string;
  canConnectTo: NodeType[];
  accent: {
    border: string;
    chipBg: string;
    chipText: string;
    handle: string;
  };
};

export const nodeConfig: Record<NodeType, NodeConfigEntry> = {
  "data-source": {
    label: "Load Dataset",
    description: "Loads a dataset from disk",
    canConnectTo: ["transform"],
    accent: {
      border: "border-emerald-400",
      chipBg: "bg-emerald-50",
      chipText: "text-emerald-700",
      handle: "!bg-emerald-500",
    },
  },
  transform: {
    label: "Train Model",
    description: "Trains a model on input data",
    canConnectTo: ["sink"],
    accent: {
      border: "border-indigo-400",
      chipBg: "bg-indigo-50",
      chipText: "text-indigo-700",
      handle: "!bg-indigo-500",
    },
  },
  sink: {
    label: "Save Model",
    description: "Persists a trained model",
    canConnectTo: [],
    accent: {
      border: "border-rose-400",
      chipBg: "bg-rose-50",
      chipText: "text-rose-700",
      handle: "!bg-rose-500",
    },
  },
};

export const hasIncomingRule = (type: NodeType): boolean =>
  (Object.keys(nodeConfig) as NodeType[]).some((t) =>
    nodeConfig[t].canConnectTo.includes(type),
  );

export const hasOutgoingRule = (type: NodeType): boolean =>
  nodeConfig[type].canConnectTo.length > 0;
