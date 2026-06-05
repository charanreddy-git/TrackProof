import { useParams, Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/StatusBadge";
import { MapView } from "../../components/MapView";
import { targetIcon } from "../../components/MapIcons";
import { PageLoader } from "../../components/ui/Spinner";
import { useTaskDetail, useCompleteTask } from "../../hooks/useTasks";
import { useTaskUpdates } from "../../hooks/useSocket";
import { useToast } from "../../components/ui/Toast";
import { useQueryClient } from "@tanstack/react-query";
import type { TaskStatus } from "../../types";

const TASK_STEPS: { status: TaskStatus; label: string; desc: string }[] = [
  { status: "OPEN", label: "Open", desc: "Awaiting captain" },
  { status: "ACCEPTED", label: "Accepted", desc: "Captain assigned" },
  { status: "IN_PROGRESS", label: "En Route", desc: "Captain travelling" },
  { status: "SUBMITTED", label: "Submitted", desc: "Evidence uploaded" },
  { status: "COMPLETED", label: "Complete", desc: "Verified" },
];

const statusOrder: Record<TaskStatus, number> = {
  OPEN: 0,
  ACCEPTED: 1,
  IN_PROGRESS: 2,
  SUBMITTED: 3,
  COMPLETED: 4,
};

export function UserTaskDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: task, isLoading } = useTaskDetail(id!);
  const completeTask = useCompleteTask();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  useTaskUpdates(id, {
    onAccepted: (data) => {
      addToast("info", `Captain ${data.captainName} accepted your task!`);
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
    onStarted: () => {
      addToast("info", "Captain has started the task!");
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
    onSubmitted: () => {
      addToast("success", "Captain submitted evidence! Review it now.");
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
  });

  if (isLoading || !task) return <PageLoader />;

  const handleComplete = async () => {
    try {
      await completeTask.mutateAsync(task.id);
      addToast("success", "Task marked as completed!");
    } catch (err) {
      const errorMsg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to complete task";
      addToast("error", errorMsg);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || "";
  const baseUrl = API_URL.replace("/api", "");
  const currentStep = statusOrder[task.status];

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Back */}
      <Link
        to="/user"
        className="inline-flex items-center gap-1.5 text-[13px] text-surface-500 hover:text-surface-800 font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-surface-900 leading-snug">{task.title}</h1>
          <p className="text-sm text-surface-500 mt-1 line-clamp-2">{task.description}</p>
        </div>
        <StatusBadge status={task.status} size="md" />
      </div>

      {/* Status Timeline */}
      <Card padding="md">
        <h2 className="text-[13px] font-bold text-surface-700 uppercase tracking-wider mb-4">
          Task Progress
        </h2>
        <div className="flex items-start gap-0">
          {TASK_STEPS.map((step, idx) => {
            const done = statusOrder[step.status] < currentStep;
            const active = step.status === task.status;


            const isLast = idx === TASK_STEPS.length - 1;

            return (
              <div key={step.status} className="flex flex-1 items-start relative">
                <div className="flex flex-col items-center w-full">
                  {/* Dot */}
                  <div
                    className={`
                      w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10
                      ${done ? "bg-emerald-500" : active ? "bg-primary-600 ring-4 ring-primary-100" : "bg-surface-100"}
                    `}
                  >
                    {done ? (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : active ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse-soft" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-surface-300" />
                    )}
                  </div>

                  {/* Line connector */}
                  {!isLast && (
                    <div className="absolute top-3.5 left-1/2 right-0 h-0.5 w-full -translate-y-1/2"
                      style={{ left: "50%", width: "100%" }}
                    >
                      <div className={`h-full ${done || active ? "bg-primary-200" : "bg-surface-100"}`} />
                    </div>
                  )}

                  {/* Label */}
                  <div className="mt-2 text-center px-0.5">
                    <p className={`text-[11px] font-semibold leading-tight ${active ? "text-primary-700" : done ? "text-emerald-700" : "text-surface-400"}`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-surface-400 leading-tight mt-0.5 hidden sm:block">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Task Details + Actions */}
        <Card padding="md">
          <h2 className="text-[13px] font-bold text-surface-700 uppercase tracking-wider mb-4">
            Task Info
          </h2>
          <div className="space-y-0">
            <div className="flex justify-between items-center py-2.5 border-b border-surface-50">
              <span className="text-[13px] text-surface-500">Created</span>
              <span className="text-[13px] font-medium text-surface-800">
                {new Date(task.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-surface-50">
              <span className="text-[13px] text-surface-500">Captain</span>
              <span className="text-[13px] font-medium text-surface-800">
                {task.acceptedBy?.name || (
                  <span className="text-surface-400">Not assigned yet</span>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-[13px] text-surface-500">Coordinates</span>
              <span className="text-[12px] font-mono text-surface-600">
                {task.targetLat.toFixed(4)}, {task.targetLng.toFixed(4)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 space-y-2.5">
            {task.status === "SUBMITTED" && (
              <Button
                onClick={handleComplete}
                isLoading={completeTask.isPending}
                className="w-full"
                size="lg"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Mark as Completed
              </Button>
            )}

            {["ACCEPTED", "IN_PROGRESS"].includes(task.status) && (
              <Link to={`/user/track/${task.id}`}>
                <Button variant="secondary" className="w-full" size="lg">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Track Captain Live
                </Button>
              </Link>
            )}

            {task.status === "OPEN" && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-soft flex-shrink-0" />
                <p className="text-[12.5px] text-blue-700 font-medium">
                  Waiting for a captain to accept this task
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Map */}
        <Card padding="sm">
          <h2 className="text-[13px] font-bold text-surface-700 uppercase tracking-wider mb-3 px-2 pt-2">
            Target Location
          </h2>
          <div className="rounded-xl overflow-hidden">
            <MapView
              center={[task.targetLat, task.targetLng]}
              zoom={16}
              markers={[
                {
                  position: [task.targetLat, task.targetLng],
                  label: "Target Location",
                  icon: targetIcon,
                },
              ]}
              height="320px"
            />
          </div>
        </Card>
      </div>

      {/* Evidence Image */}
      {task.evidenceImage && (
        <Card padding="md">
          <h2 className="text-[13px] font-bold text-surface-700 uppercase tracking-wider mb-4">
            Evidence Photo
          </h2>
          <div className="rounded-xl overflow-hidden border border-surface-100">
            <img
              src={`${baseUrl}${task.evidenceImage}`}
              alt="Verification Evidence"
              className="w-full max-h-96 object-cover"
            />
          </div>
        </Card>
      )}
    </div>
  );
}
