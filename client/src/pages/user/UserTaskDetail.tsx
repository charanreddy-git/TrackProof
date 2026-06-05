import { useParams, Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/StatusBadge";
import { MapView, targetIcon } from "../../components/MapView";
import { PageLoader } from "../../components/ui/Spinner";
import { useTaskDetail, useCompleteTask } from "../../hooks/useTasks";
import { useTaskUpdates } from "../../hooks/useSocket";
import { useToast } from "../../components/ui/Toast";
import { useQueryClient } from "@tanstack/react-query";

export function UserTaskDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: task, isLoading } = useTaskDetail(id!);
  const completeTask = useCompleteTask();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  // Listen for real-time updates
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
    } catch (err: any) {
      addToast("error", err.response?.data?.message || "Failed to complete task");
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || "";
  const baseUrl = API_URL.replace("/api", "");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        to="/user"
        className="inline-flex items-center gap-1 text-sm text-surface-500 hover:text-surface-700"
      >
        ← Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">{task.title}</h1>
          <p className="text-sm text-surface-500 mt-1">{task.description}</p>
        </div>
        <StatusBadge status={task.status} size="md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Details */}
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
              <span className="text-sm text-surface-500">Created</span>
              <span className="text-sm text-surface-700">
                {new Date(task.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-surface-50">
              <span className="text-sm text-surface-500">Captain</span>
              <span className="text-sm text-surface-700">
                {task.acceptedBy?.name || "Not assigned"}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-surface-500">Location</span>
              <span className="text-sm text-surface-700 font-mono">
                {task.targetLat.toFixed(4)}, {task.targetLng.toFixed(4)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            {task.status === "SUBMITTED" && (
              <Button
                onClick={handleComplete}
                isLoading={completeTask.isPending}
                className="w-full"
              >
                ✓ Mark as Completed
              </Button>
            )}

            {["ACCEPTED", "IN_PROGRESS"].includes(task.status) && (
              <Link to={`/user/track/${task.id}`}>
                <Button variant="secondary" className="w-full">
                  🗺 Track Captain
                </Button>
              </Link>
            )}
          </div>
        </Card>

        {/* Map */}
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
                label: "Target Location",
                icon: targetIcon,
              },
            ]}
            height="300px"
          />
        </Card>
      </div>

      {/* Evidence Image */}
      {task.evidenceImage && (
        <Card>
          <h2 className="text-lg font-semibold text-surface-900 mb-4">
            📸 Evidence
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
