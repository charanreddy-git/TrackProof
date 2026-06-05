import { Card } from "../../components/ui/Card";
import { TaskTable } from "../../components/TaskTable";
import { PageLoader } from "../../components/ui/Spinner";
import { useTaskList } from "../../hooks/useTasks";

export function AcceptedTasksPage() {
  const { data: tasks, isLoading } = useTaskList("accepted");

  if (isLoading) return <PageLoader />;

  const myTasks = tasks || [];
  const activeTasks = myTasks.filter((t) =>
    ["ACCEPTED", "IN_PROGRESS"].includes(t.status)
  );

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 tracking-tight">My Tasks</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            {activeTasks.length > 0
              ? `${activeTasks.length} active task${activeTasks.length !== 1 ? "s" : ""}`
              : "Tasks you have accepted"}
          </p>
        </div>
        {activeTasks.length > 0 && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full ring-1 ring-amber-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse-soft" />
            {activeTasks.length} active
          </span>
        )}
      </div>

      <Card padding="md">
        <TaskTable
          tasks={myTasks}
          basePath="/captain/tasks"
          showCreatedBy
          emptyMessage="No accepted tasks"
          emptyAction={{ label: "Browse available tasks", to: "/captain/available" }}
        />
      </Card>
    </div>
  );
}
