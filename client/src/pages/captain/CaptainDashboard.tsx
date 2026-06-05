import { Card } from "../../components/ui/Card";
import { TaskTable } from "../../components/TaskTable";
import { PageLoader } from "../../components/ui/Spinner";
import { useTaskList } from "../../hooks/useTasks";
import {
  SearchIcon,
  ZapIcon,
  ClipboardIcon,
  CheckCircleIcon,
} from "../../components/Icons";

export function CaptainDashboard() {
  const { data: allTasks, isLoading: loadingAll } = useTaskList();
  const { data: availableTasks, isLoading: loadingAvailable } =
    useTaskList("available");

  if (loadingAll || loadingAvailable) return <PageLoader />;

  const tasks = allTasks || [];
  const available = availableTasks || [];
  const myAccepted = tasks.filter((t) => t.status === "ACCEPTED");
  const myInProgress = tasks.filter((t) => t.status === "IN_PROGRESS");
  const mySubmitted = tasks.filter((t) => t.status === "SUBMITTED");
  const myCompleted = tasks.filter((t) => t.status === "COMPLETED");

  const stats = [
    { label: "Available", value: available.length, icon: SearchIcon, color: "from-blue-500 to-blue-700 text-white" },
    { label: "In Progress", value: myAccepted.length + myInProgress.length, icon: ZapIcon, color: "from-amber-500 to-orange-600 text-white" },
    { label: "Submitted", value: mySubmitted.length, icon: ClipboardIcon, color: "from-purple-500 to-purple-700 text-white" },
    { label: "Completed", value: myCompleted.length, icon: CheckCircleIcon, color: "from-emerald-500 to-emerald-700 text-white" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">
          Captain Dashboard
        </h1>
        <p className="text-sm text-surface-500 mt-1">
          Accept and complete verification tasks
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} padding="md" className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-surface-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-surface-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}
                >
                  <Icon size={20} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Active Tasks */}
      {(myAccepted.length > 0 || myInProgress.length > 0) && (
        <Card>
          <h2 className="text-lg font-semibold text-surface-900 mb-4">
            Active Tasks
          </h2>
          <TaskTable
            tasks={[...myInProgress, ...myAccepted]}
            basePath="/captain/tasks"
            showCreatedBy
          />
        </Card>
      )}

      {/* Available Tasks */}
      <Card>
        <h2 className="text-lg font-semibold text-surface-900 mb-4">
          Available Tasks
        </h2>
        <TaskTable
          tasks={available.slice(0, 5)}
          basePath="/captain/tasks"
          showCreatedBy
        />
      </Card>
    </div>
  );
}
