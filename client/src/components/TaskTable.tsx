import { Link } from "react-router-dom";
import { StatusBadge } from "./StatusBadge";
import { ClipboardIcon } from "./Icons";
import type { Task } from "../types";

interface TaskTableProps {
  tasks: Task[];
  basePath: string;
  showCreatedBy?: boolean;
  showAcceptedBy?: boolean;
}

export function TaskTable({
  tasks,
  basePath,
  showCreatedBy = false,
  showAcceptedBy = false,
}: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 flex flex-col items-center justify-center">
        <ClipboardIcon size={40} className="text-surface-300 mb-3" />
        <p className="text-surface-500 text-sm font-medium">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface-100">
            <th className="text-left py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">
              Task
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">
              Status
            </th>
            {showCreatedBy && (
              <th className="text-left py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                Created By
              </th>
            )}
            {showAcceptedBy && (
              <th className="text-left py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                Captain
              </th>
            )}
            <th className="text-left py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">
              Created
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-50">
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="hover:bg-surface-50 transition-colors"
            >
              <td className="py-3.5 px-4">
                <div>
                  <p className="font-medium text-surface-900 text-sm">
                    {task.title}
                  </p>
                  <p className="text-xs text-surface-500 mt-0.5 line-clamp-1">
                    {task.description}
                  </p>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <StatusBadge status={task.status} />
              </td>
              {showCreatedBy && (
                <td className="py-3.5 px-4 text-sm text-surface-600">
                  {task.createdBy.name}
                </td>
              )}
              {showAcceptedBy && (
                <td className="py-3.5 px-4 text-sm text-surface-600">
                  {task.acceptedBy?.name || "—"}
                </td>
              )}
              <td className="py-3.5 px-4 text-sm text-surface-500">
                {new Date(task.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3.5 px-4 text-right">
                <Link
                  to={`${basePath}/${task.id}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium hover:underline"
                >
                  View →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
