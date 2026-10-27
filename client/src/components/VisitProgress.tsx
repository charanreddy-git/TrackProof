import { STATUS_ORDER, TASK_STEPS } from "../utils/task";
import type { TaskStatus } from "../types";

interface VisitProgressProps {
  status: TaskStatus;
  className?: string;
}

/**
 * A compact, Rapido-style progress track. It answers two questions at a
 * glance: where the visit is now, and what happens next.
 */
export function VisitProgress({ status, className = "" }: VisitProgressProps) {
  const current = STATUS_ORDER[status];
  const currentStep = TASK_STEPS[current];
  const nextStep = TASK_STEPS[current + 1];
  const isDone = status === "COMPLETED";

  return (
    <div className={className}>
      <div
        className="flex items-center gap-1"
        role="img"
        aria-label={
          isDone
            ? "Visit completed"
            : `Visit progress: ${currentStep.label}, step ${current + 1} of ${TASK_STEPS.length}`
        }
      >
        {TASK_STEPS.map((step, index) => (
          <span
            key={step.status}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              index < current
                ? "bg-primary-600"
                : index === current
                  ? isDone
                    ? "bg-primary-600"
                    : "bg-accent-400"
                  : "bg-surface-200"
            }`}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-[11px] font-bold text-surface-900">
          {isDone ? "Completed" : currentStep.label}
        </p>
        <p className="truncate text-[10px] font-semibold text-surface-500">
          {isDone ? "All done" : nextStep ? `Next: ${nextStep.label}` : "Final step"}
        </p>
      </div>
    </div>
  );
}
