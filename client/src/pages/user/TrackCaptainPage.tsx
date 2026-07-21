import { useParams, Link } from "react-router-dom";
import { LiveTracker, PageLoader } from "../../components";
import { useTaskDetail, useSocket } from "../../hooks";
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
    <div className="max-w-4xl mx-auto space-y-3">
      {/* Compact header: back + title in one row */}
      <div className="flex items-center gap-3">
        <Link
          to={`/user/tasks/${task.id}`}
          className="flex-shrink-0 p-1.5 -ml-1.5 rounded-lg hover:bg-surface-100 transition-colors text-surface-500 hover:text-surface-800"
          aria-label="Back to task"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="min-w-0">
          <h1 className="text-[15px] font-bold text-surface-900 leading-tight truncate">{task.title}</h1>
          <p className="text-xs text-surface-500 mt-0">
            Live tracking{task.acceptedBy?.name ? ` · ${task.acceptedBy.name}` : ""}
          </p>
        </div>
      </div>

      {/* Tracker — minimal chrome, map gets maximum height */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden">
        <LiveTracker
          taskId={task.id}
          targetLat={task.targetLat}
          targetLng={task.targetLng}
          height="calc(100vh - 220px)"
        />
      </div>
    </div>
  );
}
