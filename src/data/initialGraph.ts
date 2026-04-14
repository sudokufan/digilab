import type { Edge, Node } from "@xyflow/react";
import type { MLNodeData } from "../types/workflow";

// Fan-in seed: two data sources feed into a single transform, which then
// feeds a sink. Demonstrates that a node can have multiple inbound edges
// and motivates why "Add Node" can't guess the user's intended connection.
export const initialNodes: Node<MLNodeData>[] = [
  {
    id: "1",
    type: "data-source",
    position: { x: 0, y: 40 },
    data: { label: "Load Training Set", description: "train.csv" },
  },
  {
    id: "2",
    type: "data-source",
    position: { x: 0, y: 200 },
    data: { label: "Load Validation Set", description: "val.csv" },
  },
  {
    id: "3",
    type: "transform",
    position: { x: 300, y: 120 },
    data: { label: "Train Model", description: "XGBoost, 100 rounds" },
  },
  {
    id: "4",
    type: "sink",
    position: { x: 600, y: 120 },
    data: { label: "Save Model", description: "s3://models/latest" },
  },
];

export const initialEdges: Edge[] = [
  { id: "e1-3", source: "1", target: "3" },
  { id: "e2-3", source: "2", target: "3" },
  { id: "e3-4", source: "3", target: "4" },
];
