import type { TaskStatus } from "../types";
import { CheckIcon } from "./Icons";

const statusConfig: Record<
  TaskStatus,
  { label: string; classes: string; dot: string | null }
> = {
  OPEN: {
    label: "New request",
    classes: "bg-surface-100 text-surface-700 ring-1 ring-surface-200",
    dot: "bg-surface-400",
  },
  ACCEPTED: {
    label: "Inspector assigned",
    classes: "bg-info-50 text-info-700 ring-1 ring-info-100",
    dot: "bg-info-500",
  },
  IN_PROGRESS: {
    label: "On the way",
    classes: "bg-warning-50 text-warning-700 ring-1 ring-warning-100",
    dot: "bg-warning-500",
  },
  SUBMITTED: {
    label: "Proof ready",
    classes: "bg-violet-50 text-violet-700 ring-1 ring-violet-100",
    dot: "bg-violet-500",
  },
  COMPLETED: {
    label: "Completed",
    classes: "bg-success-50 text-success-700 ring-1 ring-success-100",
    dot: null,
  },
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
      {config.dot ? (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot} ${
            status === "IN_PROGRESS" ? "animate-pulse-soft" : ""
          }`}
        />
      ) : (
        <CheckIcon size={11} className="flex-shrink-0" />
      )}
      {config.label}
    </span>
  );
}
