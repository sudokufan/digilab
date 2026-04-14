# Workflow Graph Prototype

A small React + TypeScript + ReactFlow app that renders an ML workflow graph, lets you add nodes dynamically, and validates edges so only compatible connections can be made.

## Getting started

```
npm install
npm run dev
```

Open the URL printed by Vite (usually <http://localhost:5173>).

## Approach

The workflow is modeled as three node types — `data-source`, `transform`, `sink` — displayed as `Load Dataset`, `Train Model`, `Save Model`. Each type declares its display metadata and its allowed downstream connections in a single declarative table ([src/data/nodeConfig.ts](src/data/nodeConfig.ts)).

The `canConnectTo` value in nodeConfig illustrates one-way connections in order to configure WorkflowNode to show whether an incoming or outgoing handle is present. The [WorkflowNode](src/components/WorkflowNode.tsx) component renders all three types, reading its schema from that table based on ReactFlow's native `node.type` field.

The orchestrator lives at [src/pages/WorkflowGraph/index.tsx](src/pages/WorkflowGraph/index.tsx) — it owns graph state (via ReactFlow's internal store in uncontrolled mode) and wires up the Add Node + validation handlers. Presentational children ([WorkflowNode](src/components/WorkflowNode.tsx), [AddNodeButton](src/components/AddNodeButton.tsx)) stay dumb and receive data/callbacks via props. We're in uncontrolled mode so that we always see the latest state by reading ReactFlow's store without being dependent on React's re-renders.

## Design decisions

- With three node types and one logical input/output each, a `canConnectTo: NodeType[]` list per entry is shorter and clearer than per-handle port typing. Every rule the brief's bonus task needs falls out of the table: no backwards edges, no same-type connections, no step-skipping, no self-loops (self-loop is also guarded explicitly in [validation.ts](src/pages/WorkflowGraph/validation.ts)).

- Add Node creates an unconnected `transform`, and the user drags to wire it up. An earlier version auto-connected the new node to the most recently added one, but that stops making sense as soon as the graph has multiple valid predecessors, which is highly likely with a one-to-many relationship of nodes in a more complex application. The button places the new node in a free slot inside the current viewport and leaves connection intent to the user. `transform` is the fixed type because it has both an inbound and outbound rule, so it composes into any part of a chain. To render the new node, a grid layout is generated to find a spot in the viewport that doesn't conflict with an existing node; it generates in the centre if no such spot exists.

- Files structured into components, pages, data, types, to make it easy to find what you're looking for. This also keeps App.tsx clean with a level of abstraction that supports adding future pages.

## What I'd improve with more time

- Node picker UI for Add Node: choosing the type (and label/description) before adding, instead of always creating a `transform` node.
- Unit tests, starting with [validation.ts](src/pages/WorkflowGraph/validation.ts), covering the self-loop, same-type, backwards, and step-skip cases. Data validation tests would also be useful.
- Node configuration UI: click a node to edit its label/description/parameters (dataset path, hyperparameters, etc.).
- Persistence: the graph currently resets on reload, but `localStorage` or a backend would be needed for a more complex production app
- Accessibility pass on custom handles (keyboard connection, focus rings, ARIA labels)
- adding a dedicated /styles directory for things like typography and brand colour variables, as well as installing prettier
- would consider moving layout.ts and validation.ts to a /helpers directory if they're likely to end up being used in other places across the codebase as it grows in complexity
- I don't love the `position` data in the node array; ideally this could be auto-generated rather than hard-coded

## Scripts

- `npm run dev` to start Vite dev server
- `npm run build` runs TypeScript check + production build
