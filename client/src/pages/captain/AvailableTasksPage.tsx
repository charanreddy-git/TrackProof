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

  if (isLoading) return <PageLoader />;

  const availableTasks = tasks || [];

  const handleAccept = async (id: string) => {
    try {
      await acceptTask.mutateAsync(id);
      addToast("success", "Task accepted! You can start working on it.");
    } catch (err: any) {
      addToast("error", err.response?.data?.message || "Failed to accept task");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">
          Available Tasks
        </h1>
        <p className="text-sm text-surface-500 mt-1">
          Browse and accept verification tasks
        </p>
      </div>

      {availableTasks.length === 0 ? (
        <Card className="text-center py-16 flex flex-col items-center justify-center">
          <SearchIcon size={48} className="text-surface-300 mb-4" />
          <h3 className="text-lg font-semibold text-surface-700">
            No tasks available
          </h3>
          <p className="text-sm text-surface-500 mt-1">
            Check back later for new verification tasks
          </p>
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
