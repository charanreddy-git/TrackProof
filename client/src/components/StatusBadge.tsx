import { Badge } from "./ui/Badge";
import type { TaskStatus } from "../types";

const statusConfig: Record<
  TaskStatus,
  { label: string; variant: "default" | "primary" | "success" | "warning" | "danger" | "info"; dot: boolean }
> = {
  OPEN: { label: "Open", variant: "info", dot: true },
  ACCEPTED: { label: "Accepted", variant: "primary", dot: true },
  IN_PROGRESS: { label: "In Progress", variant: "warning", dot: true },
  SUBMITTED: { label: "Submitted", variant: "success", dot: false },
  COMPLETED: { label: "Completed", variant: "success", dot: false },
};

interface StatusBadgeProps {
  status: TaskStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} dot={config.dot} size={size}>
      {config.label}
    </Badge>
  );
}
