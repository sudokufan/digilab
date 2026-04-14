import type { Node, XYPosition } from "@xyflow/react";

type Rect = { minX: number; minY: number; maxX: number; maxY: number };

// Approximate card size for the new (unmeasured) node. Existing nodes use
// their actual measured dimensions when available.
const DEFAULT_NODE_WIDTH = 200;
const DEFAULT_NODE_HEIGHT = 100;
const MARGIN = 40;

// Sampling step for candidate positions. Much smaller than a node so we can
// land inside gaps between existing nodes even when they don't align to a
// coarse grid.
const STEP = 40;

const overlapsAny = (pos: XYPosition, nodes: Node[]): boolean => {
  const right = pos.x + DEFAULT_NODE_WIDTH;
  const bottom = pos.y + DEFAULT_NODE_HEIGHT;

  return nodes.some((n) => {
    const nw = n.measured?.width ?? DEFAULT_NODE_WIDTH;
    const nh = n.measured?.height ?? DEFAULT_NODE_HEIGHT;
    const nLeft = n.position.x - MARGIN;
    const nRight = n.position.x + nw + MARGIN;
    const nTop = n.position.y - MARGIN;
    const nBottom = n.position.y + nh + MARGIN;

    return pos.x < nRight && right > nLeft && pos.y < nBottom && bottom > nTop;
  });
};

// Find a position inside `viewport` (flow coords) that doesn't overlap any
// existing node. Samples a dense grid, picks the candidate closest to the
// viewport center that both fits within the viewport and doesn't collide.
// Falls back to the viewport center if every candidate is blocked.
export const findFreePosition = (nodes: Node[], viewport: Rect): XYPosition => {
  const width = viewport.maxX - viewport.minX;
  const height = viewport.maxY - viewport.minY;

  const centerX = viewport.minX + width / 2 - DEFAULT_NODE_WIDTH / 2;
  const centerY = viewport.minY + height / 2 - DEFAULT_NODE_HEIGHT / 2;

  const cols = Math.max(1, Math.floor(width / STEP));
  const rows = Math.max(1, Math.floor(height / STEP));

  const candidates: XYPosition[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      candidates.push({
        x: viewport.minX + c * STEP,
        y: viewport.minY + r * STEP,
      });
    }
  }
  candidates.sort(
    (a, b) =>
      (a.x - centerX) ** 2 +
      (a.y - centerY) ** 2 -
      (b.x - centerX) ** 2 -
      (b.y - centerY) ** 2,
  );

  for (const pos of candidates) {
    if (pos.x + DEFAULT_NODE_WIDTH > viewport.maxX) continue;
    if (pos.y + DEFAULT_NODE_HEIGHT > viewport.maxY) continue;
    if (!overlapsAny(pos, nodes)) return pos;
  }

  return { x: centerX, y: centerY };
};
