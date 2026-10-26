import { useParams, Link } from "react-router-dom";
import { LiveTracker, PageLoader, Card, Button } from "../../components";
import { useTaskDetail, useSocket } from "../../hooks";
import { useEffect } from "react";

export function TrackCaptainPage() {
  const { id } = useParams<{ id: string }>();
  const { data: task, isLoading, isError } = useTaskDetail(id!);
  const { joinRoom, leaveRoom } = useSocket();

  useEffect(() => {
    if (id) {
      joinRoom(id);
      return () => leaveRoom(id);
    }
  }, [id, joinRoom, leaveRoom]);

  if (isLoading) return <PageLoader />;

  if (isError || !task) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="text-xl font-bold text-surface-950">Visit not found</h1>
        <p className="mt-2 text-sm text-surface-500">
          This request may have been removed, or you may not have access to it.
        </p>
        <Button to="/user" className="mt-6">
          Back to my requests
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-3">
      <div className="flex items-center gap-3">
        <Link
          to={`/user/tasks/${task.id}`}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-900"
          aria-label="Back to request"
        >
          <span aria-hidden="true" className="text-lg leading-none">←</span>
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold text-surface-950">{task.title}</h1>
          <p className="text-xs text-surface-500">
            Live visit{task.acceptedBy?.name ? ` · ${task.acceptedBy.name}` : ""}
          </p>
        </div>
      </div>

      <Card padding="none" className="overflow-hidden rounded-2xl">
        <LiveTracker
          taskId={task.id}
          targetLat={task.targetLat}
          targetLng={task.targetLng}
          height="calc(100dvh - 360px)"
        />
      </Card>
    </div>
  );
}
