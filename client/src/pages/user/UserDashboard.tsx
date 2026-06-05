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
    {
      label: "Total",
      value: allTasks.length,
      icon: ClipboardIcon,
      iconColor: "text-primary-600",
      iconBg: "bg-primary-50",
    },
    {
      label: "Active",
      value: activeTasks.length,
      icon: ZapIcon,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
      highlight: activeTasks.length > 0,
    },
    {
      label: "Review",
      value: submittedTasks.length,
      icon: ClockIcon,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      highlight: submittedTasks.length > 0,
    },
    {
      label: "Done",
      value: completedTasks.length,
      icon: CheckCircleIcon,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            {allTasks.length === 0 ? "No tasks yet" : `${allTasks.length} task${allTasks.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <Link
          to="/user/create-task"
          id="create-task-btn"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-[13px] font-semibold rounded-xl hover:bg-primary-700 active:scale-95 transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">New Task</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} padding="sm" className={`relative ${stat.highlight ? "ring-1 ring-amber-200" : ""}`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                  <Icon size={15} className={stat.iconColor} />
                </div>
                {stat.highlight && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse-soft" />
                )}
              </div>
              <p className="text-2xl font-bold text-surface-900 tabular-nums leading-none">
                {stat.value}
              </p>
              <p className="text-[12px] text-surface-500 mt-1 font-medium">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Recent Tasks */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[14px] font-bold text-surface-900">Recent Tasks</h2>
          {allTasks.length > 5 && (
            <Link
              to="/user/tasks"
              className="text-[12.5px] text-primary-600 hover:text-primary-700 font-semibold"
            >
              View all
            </Link>
          )}
        </div>
        <p className="text-[12px] text-surface-400 mb-4">
          Your most recent verification requests
        </p>
        <TaskTable
          tasks={allTasks.slice(0, 8)}
          basePath="/user/tasks"
          showAcceptedBy
          emptyMessage="No tasks yet"
          emptyAction={{ label: "Create your first task", to: "/user/create-task" }}
        />
      </Card>
    </div>
  );
}
