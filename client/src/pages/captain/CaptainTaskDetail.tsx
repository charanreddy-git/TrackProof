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
    <div className="h-full flex flex-col max-w-7xl mx-auto space-y-4">
      {/* Back */}
      <div>
        <Link
          to="/captain/accepted"
          className="inline-flex items-center gap-1.5 text-[13px] text-surface-500 hover:text-surface-800 font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Tasks
        </Link>
      </div>

      {/* Grid container: Split on lg screens */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
        {/* Left Column: Details Pane (Scrollable on lg) */}
        <div className="lg:col-span-5 flex flex-col space-y-4 lg:max-h-[calc(100vh-180px)] lg:overflow-y-auto lg:pr-2">
          {/* Header Card */}
          <Card padding="md">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-surface-900 leading-snug tracking-tight">{task.title}</h1>
                <p className="text-xs text-surface-500 mt-1.5 leading-relaxed">{task.description}</p>
              </div>
              <StatusBadge status={task.status} size="sm" />
            </div>
          </Card>

          {/* Actions — shown immediately for quick access */}
          {(task.status === "ACCEPTED" || task.status === "IN_PROGRESS" || task.status === "SUBMITTED" || task.status === "COMPLETED") && (
            <Card padding="md">
              <div className="space-y-2">
                {task.status === "ACCEPTED" && (
                  <Button
                    onClick={handleStart}
                    isLoading={startTask.isPending}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                    size="md"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                        size="md"
                      >
                        <CompassIcon size={15} className="mr-1.5" />
                        Enable Location Tracking
                      </Button>
                    )}
                    {isTracking && (
                      <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-soft flex-shrink-0" />
                        <p className="text-[11px] text-emerald-700 font-semibold">Location tracking active</p>
                      </div>
                    )}
                    <Button
                      onClick={() => navigate(`/captain/tasks/${task.id}/upload`)}
                      className="w-full"
                      size="md"
                    >
                      <CameraIcon size={15} className="mr-1.5" />
                      Capture Evidence
                    </Button>
                    <div className="flex items-start gap-2 pt-1">
                      <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-[11.5px] text-surface-500 leading-snug">
                        Must be within <strong className="text-surface-700">100m</strong> of target to submit
                      </p>
                    </div>
                  </>
                )}

                {task.status === "SUBMITTED" && (
                  <div className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-100 rounded-lg">
                    <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-[11px] text-blue-700 font-semibold">
                      Evidence submitted — awaiting user verification
                    </p>
                  </div>
                )}

                {task.status === "COMPLETED" && (
                  <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-[11px] text-emerald-700 font-semibold">
                      Task completed successfully
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Task Info */}
          <Card padding="md">
            <h2 className="text-[11px] font-bold text-surface-400 uppercase tracking-wider mb-3">
              Task Details
            </h2>
            <div className="divide-y divide-surface-100 text-xs">
              <div className="flex justify-between py-2">
                <span className="text-surface-500">Created by</span>
                <span className="font-semibold text-surface-800">{task.createdBy.name}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-surface-500">Posted</span>
                <span className="font-semibold text-surface-800">
                  {new Date(task.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-surface-500">Coordinates</span>
                <span className="font-mono text-surface-600">
                  {task.targetLat.toFixed(6)}, {task.targetLng.toFixed(6)}
                </span>
              </div>
            </div>
          </Card>

          {/* Evidence Image Card */}
          {task.evidenceImage && (
            <Card padding="md">
              <h2 className="text-[11px] font-bold text-surface-400 uppercase tracking-wider mb-3">
                Submitted Evidence
              </h2>
              <div className="rounded-lg overflow-hidden border border-surface-200 bg-surface-50">
                <img
                  src={`${baseUrl}${task.evidenceImage}`}
                  alt="Submitted Evidence"
                  className="w-full max-h-64 object-cover"
                />
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Prominent Map Pane */}
        <div className="lg:col-span-7 flex flex-col h-[350px] lg:h-auto min-h-[300px]">
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
      </div>
    </div>
  );
}
