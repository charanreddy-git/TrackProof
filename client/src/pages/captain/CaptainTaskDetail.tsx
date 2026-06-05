import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/StatusBadge";
import { MapView } from "../../components/MapView";
import { targetIcon } from "../../components/MapIcons";
import { PageLoader } from "../../components/ui/Spinner";
import { useTaskDetail, useStartTask } from "../../hooks/useTasks";
import { useGeolocation } from "../../hooks/useLocation";
import { useToast } from "../../components/ui/Toast";
import { CompassIcon, CameraIcon } from "../../components/Icons";

export function CaptainTaskDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: task, isLoading } = useTaskDetail(id!);
  const startTask = useStartTask();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { startTracking, isTracking } = useGeolocation();
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  if (isLoading || !task) return <PageLoader />;

  const handleStart = async () => {
    try {
      await startTask.mutateAsync(task.id);
      addToast("success", "Task started! Location tracking enabled.");
      cleanupRef.current = startTracking(task.id);
    } catch (err) {
      const errorMsg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to start task";
      addToast("error", errorMsg);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || "";
  const baseUrl = API_URL.replace("/api", "");

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Back */}
      <Link
        to="/captain/accepted"
        className="inline-flex items-center gap-1.5 text-[13px] text-surface-500 hover:text-surface-800 font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to My Tasks
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-surface-900 leading-snug">{task.title}</h1>
          <p className="text-sm text-surface-500 mt-1 line-clamp-2">{task.description}</p>
        </div>
        <StatusBadge status={task.status} size="md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Task Info + Actions */}
        <Card padding="md">
          <h2 className="text-[13px] font-bold text-surface-700 uppercase tracking-wider mb-4">
            Task Info
          </h2>
          <div className="space-y-0">
            <div className="flex justify-between items-center py-2.5 border-b border-surface-50">
              <span className="text-[13px] text-surface-500">Created by</span>
              <span className="text-[13px] font-medium text-surface-800">
                {task.createdBy.name}
              </span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-surface-50">
              <span className="text-[13px] text-surface-500">Posted</span>
              <span className="text-[13px] font-medium text-surface-800">
                {new Date(task.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
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
            {task.status === "ACCEPTED" && (
              <Button
                onClick={handleStart}
                isLoading={startTask.isPending}
                className="w-full bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                size="lg"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Task
              </Button>
            )}

            {task.status === "IN_PROGRESS" && (
              <>
                {!isTracking && (
                  <Button
                    onClick={() => {
                      cleanupRef.current = startTracking(task.id);
                      addToast("info", "Location tracking enabled");
                    }}
                    variant="secondary"
                    className="w-full"
                    size="lg"
                  >
                    <CompassIcon size={16} />
                    Enable Location Tracking
                  </Button>
                )}
                {isTracking && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft flex-shrink-0" />
                    <p className="text-[12.5px] text-emerald-700 font-medium">Location tracking active</p>
                  </div>
                )}
                <Button
                  onClick={() => navigate(`/captain/tasks/${task.id}/upload`)}
                  className="w-full"
                  size="lg"
                >
                  <CameraIcon size={16} />
                  Capture Evidence
                </Button>
              </>
            )}

            {task.status === "SUBMITTED" && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[12.5px] text-blue-700 font-medium">
                  Evidence submitted — awaiting user verification
                </p>
              </div>
            )}

            {task.status === "COMPLETED" && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl">
                <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-[12.5px] text-emerald-700 font-medium">
                  Task completed successfully
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
                  label: "Go here",
                  icon: targetIcon,
                },
              ]}
              height="280px"
            />
          </div>
          {/* Proximity callout */}
          <div className="mt-3 mx-2 mb-2 flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-[12px] text-amber-800 font-medium leading-snug">
              You must be within <strong>100 meters</strong> of this location to submit evidence
            </p>
          </div>
        </Card>
      </div>

      {/* Evidence */}
      {task.evidenceImage && (
        <Card padding="md">
          <h2 className="text-[13px] font-bold text-surface-700 uppercase tracking-wider mb-4">
            Submitted Evidence
          </h2>
          <div className="rounded-xl overflow-hidden border border-surface-100">
            <img
              src={`${baseUrl}${task.evidenceImage}`}
              alt="Submitted Evidence"
              className="w-full max-h-96 object-cover"
            />
          </div>
        </Card>
      )}
    </div>
  );
}
