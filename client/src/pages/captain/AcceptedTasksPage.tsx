import { Card } from "../../components/ui/Card";
import { TaskTable } from "../../components/TaskTable";
import { PageLoader } from "../../components/ui/Spinner";
import { useTaskList } from "../../hooks/useTasks";

export function AcceptedTasksPage() {
  const { data: tasks, isLoading } = useTaskList("accepted");

  if (isLoading) return <PageLoader />;

  const myTasks = tasks || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">My Tasks</h1>
        <p className="text-sm text-surface-500 mt-1">
          Tasks you've accepted and are working on
        </p>
      </div>

      <Card>
        <TaskTable tasks={myTasks} basePath="/captain/tasks" showCreatedBy />
      </Card>
    </div>
  );
}
