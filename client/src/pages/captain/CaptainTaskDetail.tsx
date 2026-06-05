import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/StatusBadge";
import { MapView, targetIcon } from "../../components/MapView";
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

  // Cleanup tracking on unmount
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
      // Start sending location updates
      cleanupRef.current = startTracking(task.id);
    } catch (err: any) {
      addToast("error", err.response?.data?.message || "Failed to start task");
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || "";
  const baseUrl = API_URL.replace("/api", "");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/captain/accepted"
        className="inline-flex items-center gap-1 text-sm text-surface-500 hover:text-surface-700"
      >
        ← Back to My Tasks
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">{task.title}</h1>
          <p className="text-sm text-surface-500 mt-1">{task.description}</p>
        </div>
        <StatusBadge status={task.status} size="md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-surface-900 mb-4">
            Task Information
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-surface-50">
              <span className="text-sm text-surface-500">Status</span>
              <StatusBadge status={task.status} />
            </div>
            <div className="flex justify-between py-2 border-b border-surface-50">
              <span className="text-sm text-surface-500">Created By</span>
              <span className="text-sm text-surface-700">
                {task.createdBy.name}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-surface-50">
              <span className="text-sm text-surface-500">Target Location</span>
              <span className="text-sm text-surface-700 font-mono">
                {task.targetLat.toFixed(4)}, {task.targetLng.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-surface-500">Created</span>
              <span className="text-sm text-surface-700">
                {new Date(task.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            {task.status === "ACCEPTED" && (
              <Button
                onClick={handleStart}
                isLoading={startTask.isPending}
                className="w-full"
              >
                🚀 Start Task
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
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <CompassIcon size={16} /> Enable Location Tracking
                  </Button>
                )}
                <Button
                  onClick={() => navigate(`/captain/tasks/${task.id}/upload`)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <CameraIcon size={16} /> Capture Evidence
                </Button>
              </>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-surface-900 mb-4">
            Target Location
          </h2>
          <MapView
            center={[task.targetLat, task.targetLng]}
            zoom={16}
            markers={[
              {
                position: [task.targetLat, task.targetLng],
                label: "Target — Go here!",
                icon: targetIcon,
              },
            ]}
            height="300px"
          />
          <p className="text-xs text-surface-500 mt-3">
            📍 You must be within <strong>100 meters</strong> of this location
            to submit evidence
          </p>
        </Card>
      </div>

      {/* Evidence Image */}
      {task.evidenceImage && (
        <Card>
          <h2 className="text-lg font-semibold text-surface-900 mb-4">
            📸 Submitted Evidence
          </h2>
          <div className="rounded-xl overflow-hidden border border-surface-200">
            <img
              src={`${baseUrl}${task.evidenceImage}`}
              alt="Evidence"
              className="w-full max-h-96 object-cover"
            />
          </div>
        </Card>
      )}
    </div>
  );
}
