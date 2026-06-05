import type { TaskStatus } from "../types";

const statusConfig: Record<
  TaskStatus,
  { label: string; classes: string; dot: boolean }
> = {
  OPEN: {
    label: "Open",
    classes: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
    dot: true,
  },
  ACCEPTED: {
    label: "Accepted",
    classes: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
    dot: true,
  },
  IN_PROGRESS: {
    label: "In Progress",
    classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    dot: true,
  },
  SUBMITTED: {
    label: "Submitted",
    classes: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    dot: false,
  },
  COMPLETED: {
    label: "Completed",
    classes: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    dot: false,
  },
};

const dotColors: Record<TaskStatus, string> = {
  OPEN: "bg-blue-500",
  ACCEPTED: "bg-indigo-500",
  IN_PROGRESS: "bg-amber-500",
  SUBMITTED: "bg-emerald-500",
  COMPLETED: "bg-emerald-500",
};

interface StatusBadgeProps {
  status: TaskStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClass = size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[11px]";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-semibold rounded-full whitespace-nowrap
        ${config.classes}
        ${sizeClass}
      `}
    >
      {config.dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[status]} animate-pulse-soft`}
        />
      )}
      {config.label}
    </span>
  );
}
