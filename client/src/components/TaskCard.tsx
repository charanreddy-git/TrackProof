import { Link } from "react-router-dom";
import { Card } from "./ui/Card";
import { StatusBadge } from "./StatusBadge";
import type { Task } from "../types";

interface TaskCardProps {
  task: Task;
  linkTo: string;
  actions?: React.ReactNode;
}

export function TaskCard({ task, linkTo, actions }: TaskCardProps) {
  return (
    <Card hover className="animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <StatusBadge status={task.status} />
        <span className="text-xs text-surface-400">
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>

      <Link to={linkTo} className="block group">
        <h3 className="font-semibold text-surface-900 group-hover:text-primary-600 transition-colors">
          {task.title}
        </h3>
        <p className="text-sm text-surface-500 mt-1 line-clamp-2">
          {task.description}
        </p>
      </Link>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-surface-100">
        <svg className="w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-xs text-surface-500 font-mono">
          {task.targetLat.toFixed(4)}, {task.targetLng.toFixed(4)}
        </span>
      </div>

      {actions && (
        <div className="mt-3 pt-3 border-t border-surface-100 flex gap-2">
          {actions}
        </div>
      )}
    </Card>
  );
}
