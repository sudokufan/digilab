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
import type { NodeType } from "../../types/workflow";
import { AddNodeButton } from "./AddNodeButton";
import { findFreePosition } from "./layout";
import { WorkflowNode } from "./WorkflowNode";
import { makeIsValidConnection } from "./validation";

// Defined at module scope so ReactFlow doesn't warn about a new object every render.
// All three types map to the same component as of today.
const nodeTypes = {
  "data-source": WorkflowNode,
  transform: WorkflowNode,
  sink: WorkflowNode,
};

export const WorkflowGraph = () => {
  // ReactFlowProvider is required so the inner component can use useReactFlow().
  return (
    <ReactFlowProvider>
      <WorkflowGraphInner />
    </ReactFlowProvider>
  );
};

const WorkflowGraphInner = () => {
  // Uncontrolled mode: ReactFlow owns the nodes/edges store. We read and
  // mutate synchronously via useReactFlow(), which avoids stale-closure bugs
  // on rapid clicks (useNodesState's setters are async via re-render, so
  // back-to-back handleAddNode calls would otherwise all see the same state).
  const { screenToFlowPosition, getNodes, addNodes, addEdges } = useReactFlow();

  const isValidConnection = useCallback(
    (c: Connection | Edge) => makeIsValidConnection(getNodes())(c),
    [getNodes],
  );

  const handleAddNode = useCallback(() => {
    const currentNodes = getNodes();

    // Anchor = most recently added node (last in the array). Insertion order
    // is preserved by applyNodeChanges, so this is deterministic.
    const anchor = currentNodes.at(-1) ?? null;

    // Derive the new node's type from the anchor's allowed downstream types so
    // the click always extends the chain. When the anchor is terminal (or the
    // graph is empty), start a fresh chain with a data-source.
    const nextType: NodeType = anchor
      ? (nodeConfig[anchor.type as NodeType].canConnectTo[0] ?? "data-source")
      : "data-source";

    // Place the new node in a free slot inside the current viewport (flow
    // coords). findFreePosition walks a grid and picks the slot closest to
    // the viewport center that doesn't overlap any existing node.
    const topLeft = screenToFlowPosition({ x: 0, y: 0 });
    const bottomRight = screenToFlowPosition({
      x: window.innerWidth,
      y: window.innerHeight,
    });
    const position = findFreePosition(currentNodes, {
      minX: topLeft.x,
      minY: topLeft.y,
      maxX: bottomRight.x,
      maxY: bottomRight.y,
    });

    const newId = crypto.randomUUID();
    addNodes({
      id: newId,
      type: nextType,
      position,
      data: { label: nodeConfig[nextType].label },
    });

    const canAutoConnect =
      anchor &&
      nodeConfig[anchor.type as NodeType].canConnectTo.includes(nextType);

    if (canAutoConnect) {
      addEdges({
        id: `e-${anchor.id}-${newId}`,
        source: anchor.id,
        target: newId,
      });
    }
  }, [screenToFlowPosition, getNodes, addNodes, addEdges]);

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
