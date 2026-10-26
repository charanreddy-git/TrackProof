import { Card, TaskTable, PageLoader } from "../../components";
import { useTaskList } from "../../hooks";

export function AcceptedTasksPage() {
  const { data: tasks, isLoading } = useTaskList("accepted");

  if (isLoading) return <PageLoader />;

  const allTasks = tasks || [];
  const activeTasks = allTasks.filter((task) =>
    ["ACCEPTED", "IN_PROGRESS", "SUBMITTED"].includes(task.status)
  );
  const completedTasks = allTasks.filter((task) => task.status === "COMPLETED");
  const hasTasks = allTasks.length > 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-surface-950">My visits</h1>
        <p className="mt-1 text-sm text-surface-500">
          {hasTasks
            ? `${activeTasks.length} active · ${completedTasks.length} completed`
            : "Property visits you accept will appear here."}
        </p>
      </div>

      <Card>
        <div className="mb-2">
          <h2 className="text-base font-bold text-surface-950">Active visits</h2>
          <p className="text-[13px] text-surface-500">
            These visits still need your action or the requester's review.
          </p>
        </div>
        <TaskTable
          tasks={activeTasks}
          basePath="/captain/tasks"
          showCreatedBy
          emptyMessage="No active visits"
          emptyDescription="Accept a request from Find work to start earning."
          emptyAction={{ label: "Find available work", to: "/captain/dashboard" }}
        />
      </Card>

      {completedTasks.length > 0 && (
        <Card>
          <div className="mb-2">
            <h2 className="text-base font-bold text-surface-950">Completed visits</h2>
            <p className="text-[13px] text-surface-500">Your finished property checks.</p>
          </div>
          <TaskTable tasks={completedTasks} basePath="/captain/tasks" showCreatedBy />
        </Card>
      )}
    </div>
  );
}
