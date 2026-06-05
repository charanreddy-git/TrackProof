import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { TaskTable } from "../../components/TaskTable";
import { PageLoader } from "../../components/ui/Spinner";
import { useTaskList } from "../../hooks/useTasks";
import {
  ClipboardIcon,
  ZapIcon,
  ClockIcon,
  CheckCircleIcon,
} from "../../components/Icons";

export function UserDashboard() {
  const { data: tasks, isLoading } = useTaskList();

  if (isLoading) return <PageLoader />;

  const allTasks = tasks || [];
  const activeTasks = allTasks.filter((t) =>
    ["ACCEPTED", "IN_PROGRESS"].includes(t.status)
  );
  const submittedTasks = allTasks.filter((t) => t.status === "SUBMITTED");
  const completedTasks = allTasks.filter((t) => t.status === "COMPLETED");

  const stats = [
    { label: "Total Tasks", value: allTasks.length, icon: ClipboardIcon, color: "from-primary-500 to-primary-700 text-white" },
    { label: "Active", value: activeTasks.length, icon: ZapIcon, color: "from-amber-500 to-orange-600 text-white" },
    { label: "Pending Review", value: submittedTasks.length, icon: ClockIcon, color: "from-blue-500 to-blue-700 text-white" },
    { label: "Completed", value: completedTasks.length, icon: CheckCircleIcon, color: "from-emerald-500 to-emerald-700 text-white" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
          <p className="text-sm text-surface-500 mt-1">
            Overview of your verification tasks
          </p>
        </div>
        <Link
          to="/user/create-task"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </Link>
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

      {/* Recent Tasks */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900">
            Recent Tasks
          </h2>
          {allTasks.length > 0 && (
            <Link
              to="/user/tasks"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all →
            </Link>
          )}
        </div>
        <TaskTable
          tasks={allTasks.slice(0, 10)}
          basePath="/user/tasks"
          showAcceptedBy
        />
      </Card>
    </div>
  );
}
