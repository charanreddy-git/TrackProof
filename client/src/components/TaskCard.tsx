import { Link } from "react-router-dom";
import { StatusBadge } from "./StatusBadge";
import type { Task } from "../types";

interface TaskCardProps {
  task: Task;
  linkTo: string;
  actions?: React.ReactNode;
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

export function TaskCard({ task, linkTo, actions }: TaskCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-card hover:shadow-card-hover hover:border-surface-300 transition-all duration-200 overflow-hidden flex flex-col animate-fade-in">
      {/* Card header */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <StatusBadge status={task.status} />
          <span className="text-[11px] text-surface-400 font-medium flex-shrink-0 mt-0.5">
            {timeAgo(task.createdAt)}
          </span>
        </div>

        <Link to={linkTo} className="block group">
          <h3 className="font-semibold text-[14px] text-surface-900 group-hover:text-primary-700 transition-colors leading-snug line-clamp-2">
            {task.title}
          </h3>
          <p className="text-[12.5px] text-surface-500 mt-1.5 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        </Link>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 mt-auto border-t border-surface-50 bg-surface-50/50">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-surface-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-[11.5px] text-surface-500 font-medium">Location pin set</span>
        </div>
      </div>

      {/* Actions slot */}
      {actions && (
        <div className="px-4 pb-4 pt-1">
          {actions}
        </div>
      )}
    </div>
  );
}
