import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { MLNodeData, NodeType } from "../../types/workflow";
import {
  hasIncomingRule,
  hasOutgoingRule,
  nodeConfig,
} from "../../data/nodeConfig";

type WorkflowNodeProps = NodeProps<Node<MLNodeData, NodeType>>;

export const WorkflowNode = ({ type, data }: WorkflowNodeProps) => {
  const config = nodeConfig[type];
  const { accent } = config;

  return (
    <div
      className={`min-w-45 rounded-lg border-2 ${accent.border} bg-white shadow-md`}
    >
      {hasIncomingRule(type) && (
        <Handle
          type="target"
          position={Position.Left}
          className={`h-3 w-3 ${accent.handle} border-2 border-white`}
        />
      )}

      <div className="px-4 py-3">
        <span
          className={`inline-block rounded px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide ${accent.chipBg} ${accent.chipText}`}
        >
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
          className={`h-3 w-3 ${accent.handle} border-2 border-white`}
        />
      )}
    </div>
  );
};
