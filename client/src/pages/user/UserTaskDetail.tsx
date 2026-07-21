import { useParams } from "react-router-dom";
import { Card, Button, StatusBadge, MapView, targetIcon, PageLoader, useToast } from "../../components";
import { useTaskDetail, useCompleteTask, useTaskUpdates } from "../../hooks";
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
    <div className="h-full flex flex-col max-w-7xl mx-auto space-y-4">
      <div>
        <Button to="/user" variant="ghost" size="sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch flex-1">
        <div className="order-first lg:order-last lg:col-span-7 flex flex-col h-[220px] sm:h-[280px] lg:h-auto lg:min-h-[400px]">
          <div className="border border-surface-200 rounded-xl overflow-hidden shadow-sm h-full flex-1 relative bg-white">
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
              height="100%"
            />
          </div>
        </div>

        <div className="order-last lg:order-first lg:col-span-5 flex flex-col space-y-4 lg:max-h-[calc(100vh-180px)] lg:overflow-y-auto lg:pr-2">
          <Card padding="md">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-surface-900 leading-snug tracking-tight">{task.title}</h1>
                <p className="text-xs text-surface-500 mt-1.5 leading-relaxed">{task.description}</p>
              </div>
              <StatusBadge status={task.status} size="sm" />
            </div>
          </Card>

          <Card padding="md">
            <h2 className="text-[11px] font-bold text-surface-400 uppercase tracking-wider mb-4">
              Task Status
            </h2>
            <div className="relative pl-6 space-y-5">
              <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-surface-100" />
              {TASK_STEPS.map((step) => {
                const done = statusOrder[step.status] < currentStep;
                const active = step.status === task.status;
                return (
                  <div key={step.status} className="relative flex gap-3.5 items-start">
                    <div
                      className={`
                        absolute -left-[22px] w-5 h-5 rounded-full flex items-center justify-center z-10 text-[10px] font-bold border transition-all duration-200
                        ${done ? "bg-emerald-500 border-emerald-500 text-white" : active ? "bg-primary-600 border-primary-600 ring-4 ring-primary-100 text-white" : "bg-white border-surface-200 text-surface-400"}
                      `}
                    >
                      {done ? (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : active ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-soft" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-surface-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[12.5px] font-semibold ${active ? "text-primary-700" : done ? "text-emerald-700" : "text-surface-500"}`}>
                        {step.label}
                      </p>
                      <p className="text-[11px] text-surface-400 mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card padding="md">
            <div className="space-y-2">
              {task.status === "SUBMITTED" && (
                <Button
                  onClick={handleComplete}
                  isLoading={completeTask.isPending}
                  className="w-full"
                  size="md"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Mark as Completed
                </Button>
              )}

              {task.status === "IN_PROGRESS" && (
                <Button to={`/user/track/${task.id}`} variant="secondary" className="w-full" size="md">
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Track Live Location
                </Button>
              )}

              {task.status === "OPEN" && (
                <div className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-100 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse-soft flex-shrink-0" />
                  <p className="text-[11.5px] text-blue-700 font-semibold">
                    Awaiting captain assignment
                  </p>
                </div>
              )}

              {task.status === "COMPLETED" && (
                <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-[11px] text-emerald-700 font-semibold">Verification complete</p>
                </div>
              )}
            </div>
          </Card>

          {task.evidenceImage && (
            <Card padding="md">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[11px] font-bold text-surface-400 uppercase tracking-wider">
                  Evidence Photo
                </h2>
                <a
                  href={`${baseUrl}${task.evidenceImage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-primary-600 hover:text-primary-700"
                >
                  View full size ↗
                </a>
              </div>
              <div className="rounded-lg overflow-hidden border border-surface-200 bg-surface-50">
                <img
                  src={`${baseUrl}${task.evidenceImage}`}
                  alt="Verification Evidence"
                  className="w-full max-h-80 object-contain"
                />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
