import { Link } from "react-router-dom";
import { StatusBadge } from "./StatusBadge";
import { ClipboardIcon } from "./Icons";
import type { Task } from "../types";

interface TaskTableProps {
  tasks: Task[];
  basePath: string;
  showCreatedBy?: boolean;
  showAcceptedBy?: boolean;
  emptyMessage?: string;
  emptyAction?: { label: string; to: string };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const statusRowClass: Record<string, string> = {
  OPEN: "task-row-open",
  ACCEPTED: "task-row-accepted",
  IN_PROGRESS: "task-row-in_progress",
  SUBMITTED: "task-row-submitted",
  COMPLETED: "task-row-completed",
};

export function TaskTable({
  tasks,
  basePath,
  showCreatedBy = false,
  showAcceptedBy = false,
  emptyMessage = "No tasks yet",
  emptyAction,
}: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-14 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-surface-100 flex items-center justify-center">
          <ClipboardIcon size={22} className="text-surface-400" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-surface-700">{emptyMessage}</p>
          <p className="text-xs text-surface-400">Tasks will appear here once created</p>
        </div>
        {emptyAction && (
          <Link
            to={emptyAction.to}
            className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            {emptyAction.label}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="divide-y divide-surface-50">
      {tasks.map((task) => (
        <Link
          key={task.id}
          to={`${basePath}/${task.id}`}
          className={`
            flex items-center gap-4 py-3.5 px-4 -mx-4 
            hover:bg-surface-50 active:bg-surface-100
            transition-colors duration-100 group
            ${statusRowClass[task.status] || ""}
          `}
          style={{ paddingLeft: "calc(1rem + 3px)" }}
        >
          {/* Title + meta */}
          <div className="flex-1 min-w-0">
            <p className="text-[13.5px] font-semibold text-surface-900 truncate group-hover:text-primary-700 transition-colors">
              {task.title}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <StatusBadge status={task.status} />
              {showCreatedBy && (
                <span className="text-[11px] text-surface-400">
                  by {task.createdBy.name}
                </span>
              )}
              {showAcceptedBy && task.acceptedBy && (
                <span className="text-[11px] text-surface-400">
                  · {task.acceptedBy.name}
                </span>
              )}
            </div>
          </div>

          {/* Time + Arrow */}
          <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
            <span className="text-[11px] text-surface-400 tabular-nums">{timeAgo(task.createdAt)}</span>
            <svg className="w-3.5 h-3.5 text-surface-300 group-hover:text-surface-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
}
