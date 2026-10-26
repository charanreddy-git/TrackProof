import { useParams } from "react-router-dom";
import {
  Card,
  Button,
  StatusBadge,
  MapView,
  targetIcon,
  PageLoader,
  useToast,
  CheckIcon,
  MapPinIcon,
  CameraIcon,
  NavigationIcon,
  ClockIcon,
} from "../../components";
import { useTaskDetail, useCompleteTask, useTaskUpdates } from "../../hooks";
import { useQueryClient } from "@tanstack/react-query";
import type { TaskStatus } from "../../types";

const TASK_STEPS: { status: TaskStatus; label: string; desc: string }[] = [
  { status: "OPEN", label: "Requested", desc: "Finding a local inspector" },
  { status: "ACCEPTED", label: "Inspector assigned", desc: "Your inspector is confirmed" },
  { status: "IN_PROGRESS", label: "On the way", desc: "Travelling to the property" },
  { status: "SUBMITTED", label: "Proof submitted", desc: "Your proof is ready to review" },
  { status: "COMPLETED", label: "Completed", desc: "You have reviewed the visit" },
];

const statusOrder: Record<TaskStatus, number> = {
  OPEN: 0,
  ACCEPTED: 1,
  IN_PROGRESS: 2,
  SUBMITTED: 3,
  COMPLETED: 4,
};

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function UserTaskDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: task, isLoading, isError } = useTaskDetail(id!);
  const completeTask = useCompleteTask();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  useTaskUpdates(id, {
    onAccepted: (data) => {
      addToast("info", `${data.captainName} accepted your visit.`);
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
    onStarted: () => {
      addToast("info", "Your inspector is on the way.");
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
    onSubmitted: () => {
      addToast("success", "Proof submitted — review the photo now.");
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
  });

  if (isLoading) return <PageLoader />;

  if (isError || !task) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="text-xl font-bold text-surface-950">Request not found</h1>
        <p className="mt-2 text-sm text-surface-500">
          This request may have been removed, or you may not have access to it.
        </p>
        <Button to="/user" className="mt-6">
          Back to my requests
        </Button>
      </div>
    );
  }

  const handleComplete = async () => {
    try {
      await completeTask.mutateAsync(task.id);
      addToast("success", "Visit marked as completed.");
    } catch (err) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "Could not complete this visit. Please try again.";
      addToast("error", errorMsg);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || "";
  const baseUrl = API_URL.replace("/api", "");
  const currentStep = statusOrder[task.status];
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${task.targetLat},${task.targetLng}`;

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button to="/user" variant="ghost" size="sm" className="-ml-2 min-h-11">
          <span aria-hidden="true">←</span>
          My requests
        </Button>
        <p className="text-xs text-surface-500">Requested {formatDateTime(task.createdAt)}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-surface-950">{task.title}</h1>
          <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-surface-600">
            {task.description}
          </p>
        </div>
        <StatusBadge status={task.status} size="md" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Side column */}
        <div className="order-last space-y-4 lg:order-first lg:col-span-5">
          {/* Next action */}
          <Card>
            <ActionPanel
              task={task}
              onComplete={handleComplete}
              isCompleting={completeTask.isPending}
            />
          </Card>

          {/* Progress */}
          <Card>
            <h2 className="text-sm font-bold text-surface-950">Visit progress</h2>
            <div className="relative mt-5 pl-7">
              <div className="absolute bottom-2 left-[9px] top-2 w-px bg-surface-150" />
              {TASK_STEPS.map((step) => {
                const done = statusOrder[step.status] < currentStep;
                const active = step.status === task.status;

                return (
                  <div key={step.status} className="relative flex items-start gap-3 pb-5 last:pb-0">
                    <div
                      className={`absolute -left-[27px] z-10 flex h-[19px] w-[19px] items-center justify-center rounded-full border-2 ${
                        done
                          ? "border-primary-600 bg-primary-600 text-white"
                          : active
                            ? "border-primary-600 bg-white text-primary-700 ring-4 ring-primary-50"
                            : "border-surface-200 bg-white text-surface-300"
                      }`}
                    >
                      {done ? (
                        <CheckIcon size={10} />
                      ) : (
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            active ? "bg-primary-600 animate-pulse-soft" : "bg-surface-300"
                          }`}
                        />
                      )}
                    </div>
                    <div className="-mt-0.5">
                      <p
                        className={`text-[13px] font-semibold ${
                          active ? "text-primary-800" : done ? "text-surface-800" : "text-surface-500"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="mt-0.5 text-xs text-surface-500">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Details */}
          <Card>
            <h2 className="text-sm font-bold text-surface-950">Visit details</h2>
            <dl className="mt-4 space-y-3 text-[13px]">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-surface-500">Inspector</dt>
                <dd className="text-right font-semibold text-surface-800">
                  {task.acceptedBy?.name || "Not assigned yet"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-surface-500">Property pin</dt>
                <dd className="text-right font-mono text-xs text-surface-700">
                  {task.targetLat.toFixed(6)}, {task.targetLng.toFixed(6)}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-surface-500">Proof rule</dt>
                <dd className="text-right font-medium text-surface-700">Within 100 m</dd>
              </div>
            </dl>
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary-700 hover:text-primary-800"
            >
              <MapPinIcon size={14} />
              Open property in Google Maps
            </a>
          </Card>

          {/* Evidence */}
          {task.evidenceImage && (
            <Card id="evidence">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-surface-950">Proof photo</h2>
                <a
                  href={`${baseUrl}${task.evidenceImage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary-700 hover:text-primary-800"
                >
                  Open full size ↗
                </a>
              </div>
              <div className="mt-3 overflow-hidden rounded-xl border border-surface-200 bg-surface-50">
                <img
                  src={`${baseUrl}${task.evidenceImage}`}
                  alt="Property proof submitted by the inspector"
                  className="max-h-80 w-full object-contain"
                />
              </div>
              <div className="mt-3 space-y-1.5 rounded-xl bg-surface-50 p-3 text-[11px] font-medium text-surface-600">
                <p className="flex items-center gap-1.5">
                  <CheckIcon size={12} className="text-primary-600" />
                  GPS-verified within 100 m of the pin
                </p>
                {task.evidenceCapturedAt && (
                  <p>Captured {formatDateTime(task.evidenceCapturedAt)}</p>
                )}
                {task.evidenceAccuracy != null && (
                  <p>GPS accuracy ±{Math.round(task.evidenceAccuracy)} m</p>
                )}
                {task.evidenceLat != null && task.evidenceLng != null && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${task.evidenceLat},${task.evidenceLng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1 font-semibold text-primary-700 hover:text-primary-800"
                  >
                    <MapPinIcon size={12} />
                    View photo location in Google Maps
                  </a>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Map */}
        <div className="order-first lg:order-last lg:col-span-7">
          <div className="h-[240px] overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-card sm:h-[320px] lg:h-full lg:min-h-[480px]">
            <MapView
              center={[task.targetLat, task.targetLng]}
              zoom={16}
              markers={[
                {
                  position: [task.targetLat, task.targetLng],
                  label: "Property location",
                  icon: targetIcon,
                },
              ]}
              height="100%"
              className="h-full rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionPanel({
  task,
  onComplete,
  isCompleting,
}: {
  task: { status: TaskStatus; id: string };
  onComplete: () => void;
  isCompleting: boolean;
}) {
  if (task.status === "SUBMITTED") {
    return (
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
            <CameraIcon size={16} />
          </span>
          <h2 className="text-sm font-bold text-surface-950">Your proof is ready</h2>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-surface-600">
          Review the photo below. Once you are satisfied, mark the visit complete.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <a
            href="#evidence"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-surface-200 bg-white px-4 text-sm font-semibold text-surface-800 transition-colors hover:bg-surface-50"
          >
            Review proof
          </a>
          <Button onClick={onComplete} isLoading={isCompleting} className="flex-1">
            Mark complete
          </Button>
        </div>
      </div>
    );
  }

  if (task.status === "IN_PROGRESS") {
    return (
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning-50 text-warning-700">
            <NavigationIcon size={16} />
          </span>
          <h2 className="text-sm font-bold text-surface-950">Inspector is on the way</h2>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-surface-600">
          Follow their trip live. A photo will appear here after they reach the property.
        </p>
        <Button to={`/user/track/${task.id}`} className="mt-4 w-full">
          Track live visit
        </Button>
      </div>
    );
  }

  if (task.status === "ACCEPTED") {
    return (
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-info-50 text-info-700">
            <ClockIcon size={16} />
          </span>
          <h2 className="text-sm font-bold text-surface-950">Inspector assigned</h2>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-surface-600">
          Your inspector has accepted the visit. We'll update this page when they
          start travelling to the property.
        </p>
      </div>
    );
  }

  if (task.status === "COMPLETED") {
    return (
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-50 text-success-700">
            <CheckIcon size={16} />
          </span>
          <h2 className="text-sm font-bold text-surface-950">Visit completed</h2>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-surface-600">
          This property check is complete. The photo and details are saved below
          for your records.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-100 text-surface-600">
          <MapPinIcon size={16} />
        </span>
        <h2 className="text-sm font-bold text-surface-950">Finding an inspector</h2>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-surface-600">
        Your request is open to local inspectors. Most visits are accepted within
        a few hours. You can leave this page — we'll notify you when someone
        accepts.
      </p>
    </div>
  );
}
