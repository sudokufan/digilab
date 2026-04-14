import { useCallback } from "react";
import {
  Background,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Connection,
  type Edge,
} from "@xyflow/react";

import { nodeConfig } from "../../data/nodeConfig";
import { initialEdges, initialNodes } from "../../data/initialGraph";
import { AddNodeButton } from "../../components/AddNodeButton";
import { WorkflowNode } from "../../components/WorkflowNode";
import { findFreePosition } from "./layout";
import { makeIsValidConnection } from "./validation";

// The type created by the Add Node button. Fixed to `transform` because
// transforms are the only type with both an inbound and outbound rule, so
// they compose into any part of a chain. The user then drags to connect —
// auto-connecting would have to guess the intended predecessor, which is
// meaningless once nodes can have multiple inbound edges (see the fan-in
// seed graph). A future Add Node UI would let the user pick the type.
const NEW_NODE_TYPE = "transform" as const;

const nodeTypes = {
  "data-source": WorkflowNode,
  transform: WorkflowNode,
  sink: WorkflowNode,
};

export const WorkflowGraph = () => {
  return (
    <ReactFlowProvider>
      <WorkflowGraphInner />
    </ReactFlowProvider>
  );
};

const WorkflowGraphInner = () => {
  const { screenToFlowPosition, getNodes, addNodes } = useReactFlow();

  const isValidConnection = useCallback(
    (c: Connection | Edge) => makeIsValidConnection(getNodes())(c),
    [getNodes],
  );

  const handleAddNode = useCallback(() => {
    // Place the new node in a free slot inside the current viewport (flow
    // coords). findFreePosition picks the slot closest to the viewport
    // center that doesn't overlap any existing node.
    const topLeft = screenToFlowPosition({ x: 0, y: 0 });
    const bottomRight = screenToFlowPosition({
      x: window.innerWidth,
      y: window.innerHeight,
    });
    const position = findFreePosition(getNodes(), {
      minX: topLeft.x,
      minY: topLeft.y,
      maxX: bottomRight.x,
      maxY: bottomRight.y,
    });

    addNodes({
      id: crypto.randomUUID(),
      type: NEW_NODE_TYPE,
      position,
      data: { label: nodeConfig[NEW_NODE_TYPE].label },
    });
  }, [screenToFlowPosition, getNodes, addNodes]);

  return (
    <ReactFlow
      defaultNodes={initialNodes}
      defaultEdges={initialEdges}
      isValidConnection={isValidConnection}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.3 }}
    >
      <Background />
      <Controls />
      <Panel position="top-left">
        <AddNodeButton onAdd={handleAddNode} />
      </Panel>
    </ReactFlow>
  );
};
