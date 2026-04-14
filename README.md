# Workflow Graph Prototype

A small React + TypeScript + ReactFlow app that renders an ML workflow graph, lets you add nodes dynamically, and validates edges so only compatible connections can be made.

## Getting started

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually <http://localhost:5173>).

## Approach

The workflow is modeled as three node types — `data-source`, `transform`, `sink` — displayed as `Load Dataset`, `Train Model`, `Save Model`. Each type declares its display metadata and its allowed downstream connections in a single declarative table ([src/data/nodeConfig.ts](src/data/nodeConfig.ts)).

One generic [WorkflowNode](src/components/WorkflowNode.tsx) component renders all three types, reading its schema from that table based on ReactFlow's native `node.type` field. Adding a new type is one entry in the config — no new component, no new validation branch.

The orchestrator lives at [src/pages/WorkflowGraph/index.tsx](src/pages/WorkflowGraph/index.tsx) — it owns graph state (via ReactFlow's internal store in uncontrolled mode) and wires up the Add Node + validation handlers. Presentational children ([WorkflowNode](src/components/WorkflowNode.tsx), [AddNodeButton](src/components/AddNodeButton.tsx)) stay dumb and receive data/callbacks via props.

## Design decisions

- **`node.type` is the single source of truth for type.** ReactFlow already has a first-class `type` field that drives the `nodeTypes` map; duplicating it in `data.nodeType` would be a second source of truth. Keeping it on the node itself lets `MLNodeData` stay purely presentational (`{ label, description? }`) and lets future per-type renderers be swapped in with zero refactor.

- **Adjacency rules, not typed ports.** With three node types and one logical input/output each, a `canConnectTo: NodeType[]` list per entry is shorter and clearer than per-handle port typing. Every rule the brief's bonus task needs falls out of the table: no backwards edges, no same-type connections, no step-skipping, no self-loops (self-loop is guarded explicitly in [validation.ts](src/pages/WorkflowGraph/validation.ts)).

- **Add Node auto-connects when possible.** The brief's third bullet says the click should "render an edge that allows it to connect to another node", so clicking `Add Node` creates a `transform` node offset from the rightmost existing node _and_ auto-appends an edge from that rightmost node when the adjacency rule permits. If it doesn't (e.g. the rightmost is a `sink`), the node is added standalone and the user can drag-connect manually. `transform` was chosen as the fixed Add Node type because it has both an inbound and outbound rule, so it's usually insertable mid-chain.

- **`isValidConnection` on `<ReactFlow>`.** ReactFlow invokes it during drag, so invalid drops are rejected visually before `onConnect` fires — better UX than rejecting after-the-fact.

- **Tailwind 4 via `@tailwindcss/vite`.** The xyflow stylesheet is imported in [src/index.css](src/index.css) immediately after `@import "tailwindcss"` per the ReactFlow + Tailwind 4 docs, so React Flow's styles win the cascade over Tailwind's resets.

## What I'd improve with more time

- **Node picker UI for Add Node.** Choose the type (and label/description) before adding, instead of always appending a `transform`.
- **Delete + undo.** ReactFlow's default backspace-delete works but isn't surfaced in the UI, and there's no undo stack.
- **Unit tests for [validation.ts](src/pages/WorkflowGraph/validation.ts).** It's a pure function and the highest-ROI first test — cover the self-loop, same-type, backwards, and step-skip cases.
- **Cycle detection.** Not needed in the current 3-type topology (the rules form a DAG by construction), but would need a traversal if rules became more permissive.
- **Node configuration UI.** Click a node to edit its label/description/parameters (dataset path, hyperparameters, etc.).
- **Persistence.** The graph currently resets on reload; `localStorage` or a backend would make the prototype feel real.
- **Accessibility pass** on custom handles (keyboard connection, focus rings, ARIA labels).

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — TypeScript check + production build
- `npm run lint` — ESLint
- `npm run preview` — preview the built app
