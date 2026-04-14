import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { MLNodeData, NodeType } from "../../types/workflow";
import { hasIncomingRule, hasOutgoingRule } from "../../data/nodeConfig";

type WorkflowNodeProps = NodeProps<Node<MLNodeData, NodeType>>;

export const WorkflowNode = ({ type, data }: WorkflowNodeProps) => {
  return (
    <div
      data-node-type={type}
      className="min-w-45 rounded-lg border-2 border-(--accent-border) bg-white shadow-md"
    >
      {hasIncomingRule(type) && (
        <Handle
          type="target"
          position={Position.Left}
          className="h-3 w-3 border-2 border-white bg-(--accent-solid)!"
        />
      )}

      <div className="px-4 py-3">
        <span className="inline-block rounded px-2 py-0.5 font-mono text-[10px] tracking-wide uppercase bg-(--accent-bg) text-(--accent-fg)">
          {type}
        </span>
        <div className="mt-2 text-sm font-semibold text-slate-900">
          {data.label}
        </div>
        {data.description && (
          <div className="mt-0.5 text-xs text-slate-500">
            {data.description}
          </div>
        )}
      </div>

      {hasOutgoingRule(type) && (
        <Handle
          type="source"
          position={Position.Right}
          className="h-3 w-3 border-2 border-white bg-(--accent-solid)!"
        />
      )}
    </div>
  );
};
