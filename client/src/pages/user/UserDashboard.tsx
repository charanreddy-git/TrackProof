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
      label: "Total Tasks",
      value: allTasks.length,
      icon: ClipboardIcon,
    },
    {
      label: "Active Tasks",
      value: activeTasks.length,
      icon: ZapIcon,
      highlight: activeTasks.length > 0,
      highlightLabel: "Active",
      highlightColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      label: "Pending Review",
      value: submittedTasks.length,
      icon: ClockIcon,
      highlight: submittedTasks.length > 0,
      highlightLabel: "Review",
      highlightColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      label: "Completed",
      value: completedTasks.length,
      icon: CheckCircleIcon,
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
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-[13px] font-semibold rounded-lg hover:bg-primary-700 active:scale-95 transition-all shadow-sm"
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
            <Card key={stat.label} padding="sm" className="relative flex flex-col justify-between min-h-[96px]">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-surface-500 font-medium">{stat.label}</span>
                <span className="text-surface-400">
                  <Icon size={16} />
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-2xl font-bold text-surface-900 tabular-nums leading-none">
                  {stat.value}
                </span>
                {stat.highlight && (
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${stat.highlightColor}`}>
                    {stat.highlightLabel}
                  </span>
                )}
              </div>
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
