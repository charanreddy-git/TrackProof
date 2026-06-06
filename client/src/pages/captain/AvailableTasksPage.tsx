import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { TaskCard } from "../../components/TaskCard";
import { Button } from "../../components/ui/Button";
import { PageLoader } from "../../components/ui/Spinner";
import { useTaskList, useAcceptTask } from "../../hooks/useTasks";
import { useToast } from "../../components/ui/Toast";
import { SearchIcon } from "../../components/Icons";

export function AvailableTasksPage() {
  const { data: tasks, isLoading } = useTaskList("available");
  const acceptTask = useAcceptTask();
  const { addToast } = useToast();
  const navigate = useNavigate();

  if (isLoading) return <PageLoader />;

  const availableTasks = tasks || [];

  const handleAccept = async (id: string) => {
    try {
      await acceptTask.mutateAsync(id);
      addToast("success", "Task accepted! Head to the location now.");
      navigate(`/captain/tasks/${id}`);
    } catch (err) {
      const errorMsg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to accept task";
      addToast("error", errorMsg);
    }
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 tracking-tight">Available Tasks</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            {availableTasks.length > 0
              ? `${availableTasks.length} task${availableTasks.length !== 1 ? "s" : ""} waiting to be accepted`
              : "Checking for new tasks…"}
          </p>
        </div>
        {availableTasks.length > 0 && (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-600 text-white text-xs font-bold">
            {availableTasks.length}
          </span>
        )}
      </div>

      {availableTasks.length === 0 ? (
        <Card padding="lg" className="text-center">
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center">
              <SearchIcon size={24} className="text-surface-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[15px] font-bold text-surface-700">No tasks available</h3>
              <p className="text-sm text-surface-400 max-w-xs mx-auto">
                New verification tasks will appear here. Check back shortly.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {availableTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              linkTo={`/captain/tasks/${task.id}`}
              actions={
                <Button
                  size="sm"
                  onClick={() => handleAccept(task.id)}
                  isLoading={acceptTask.isPending}
                  className="w-full"
                >
                  Accept Task
                </Button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
