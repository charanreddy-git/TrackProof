import { useParams, Link } from "react-router-dom";
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
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Back */}
      <Link
        to={`/user/tasks/${task.id}`}
        className="inline-flex items-center gap-1.5 text-[13px] text-surface-500 hover:text-surface-800 font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Task
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-surface-900 leading-tight">{task.title}</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          Live tracking{task.acceptedBy?.name ? ` · ${task.acceptedBy.name}` : ""}
        </p>
      </div>

      {/* Tracker — no card wrapper so map gets full real estate */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden">
        <LiveTracker
          taskId={task.id}
          targetLat={task.targetLat}
          targetLng={task.targetLng}
          height="calc(100vh - 280px)"
        />
      </div>
    </div>
  );
}
