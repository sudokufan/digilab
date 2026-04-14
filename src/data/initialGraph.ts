import type { Edge, Node } from "@xyflow/react";
import type { MLNodeData } from "../types/workflow";

export const initialNodes: Node<MLNodeData>[] = [
  {
    id: "1",
    type: "data-source",
    position: { x: 0, y: 120 },
    data: { label: "Load Dataset", description: "training_set.csv" },
  },
  {
    id: "2",
    type: "transform",
    position: { x: 280, y: 120 },
    data: { label: "Train Model", description: "XGBoost, 100 rounds" },
  },
  {
    id: "3",
    type: "sink",
    position: { x: 560, y: 120 },
    data: { label: "Save Model", description: "s3://models/latest" },
  },
];

export const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
];
