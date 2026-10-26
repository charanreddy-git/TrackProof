import { Link } from "react-router-dom";
import { StatusBadge } from "./StatusBadge";
import { ClipboardIcon, ArrowRightIcon } from "./Icons";
import type { Task } from "../types";

interface TaskTableProps {
  tasks: Task[];
  basePath: string;
  showCreatedBy?: boolean;
  showAcceptedBy?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyAction?: { label: string; to: string };
}

function formatTaskTime(dateStr: string): string {
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
}

export function TaskTable({
  tasks,
  basePath,
  showCreatedBy = false,
  showAcceptedBy = false,
  emptyMessage = "No requests yet",
  emptyDescription = "New requests will appear here.",
  emptyAction,
}: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-100">
          <ClipboardIcon size={22} className="text-surface-500" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-surface-800">{emptyMessage}</p>
          <p className="max-w-xs text-[13px] leading-relaxed text-surface-500">{emptyDescription}</p>
        </div>
        {emptyAction && (
          <Link
            to={emptyAction.to}
            className="mt-1 inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
          >
            {emptyAction.label}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="divide-y divide-surface-100">
      {tasks.map((task) => (
        <Link
          key={task.id}
          to={`${basePath}/${task.id}`}
          className="group flex items-center gap-3 py-3.5 transition-colors first:pt-1 last:pb-1 hover:bg-surface-50/60 sm:gap-4"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-surface-900 transition-colors group-hover:text-primary-800">
              {task.title}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-surface-500">
              <StatusBadge status={task.status} />
              {showAcceptedBy && task.acceptedBy && (
                <span className="truncate">Inspector: {task.acceptedBy.name}</span>
              )}
              {showCreatedBy && (
                <span className="truncate">By {task.createdBy.name}</span>
              )}
              <span className="text-surface-500">{formatTaskTime(task.createdAt)}</span>
            </div>
          </div>

          <ArrowRightIcon
            size={16}
            className="flex-shrink-0 text-surface-300 transition-colors group-hover:text-surface-600"
          />
        </Link>
      ))}
    </div>
  );
}
