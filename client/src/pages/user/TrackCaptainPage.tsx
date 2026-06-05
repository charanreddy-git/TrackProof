import { useParams, Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { LiveTracker } from "../../components/LiveTracker";
import { PageLoader } from "../../components/ui/Spinner";
import { useTaskDetail } from "../../hooks/useTasks";
import { useSocket } from "../../hooks/useSocket";
import { useEffect } from "react";

export function TrackCaptainPage() {
  const { id } = useParams<{ id: string }>();
  const { data: task, isLoading } = useTaskDetail(id!);
  const { joinRoom, leaveRoom } = useSocket();

  useEffect(() => {
    if (id) {
      joinRoom(id);
      return () => leaveRoom(id);
    }
  }, [id, joinRoom, leaveRoom]);

  if (isLoading || !task) return <PageLoader />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to={`/user/tasks/${task.id}`}
        className="inline-flex items-center gap-1 text-sm text-surface-500 hover:text-surface-700"
      >
        ← Back to Task
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-surface-900">
          Track Captain — {task.title}
        </h1>
        <p className="text-sm text-surface-500 mt-1">
          Real-time tracking of captain{" "}
          {task.acceptedBy?.name || "Unknown"}
        </p>
      </div>

      <Card padding="lg">
        <LiveTracker
          taskId={task.id}
          targetLat={task.targetLat}
          targetLng={task.targetLng}
          height="500px"
        />
      </Card>
    </div>
  );
}
