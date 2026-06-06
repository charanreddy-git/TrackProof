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
    },
    {
      label: "Active",
      value: activeTasks.length,
      icon: ZapIcon,
      urgent: activeTasks.length > 0,
    },
    {
      label: "Review",
      value: submittedTasks.length,
      icon: ClockIcon,
      urgent: submittedTasks.length > 0,
    },
    {
      label: "Done",
      value: completedTasks.length,
      icon: CheckCircleIcon,
    },
  ];

  const contextTitle = (() => {
    if (allTasks.length === 0) return "No tasks yet";
    if (submittedTasks.length > 0) return `${submittedTasks.length} task${submittedTasks.length > 1 ? "s" : ""} awaiting review`;
    if (activeTasks.length > 0) return `${activeTasks.length} active task${activeTasks.length > 1 ? "s" : ""}`;
    return `${completedTasks.length} task${completedTasks.length !== 1 ? "s" : ""} completed`;
  })();

  const contextSub = (() => {
    if (allTasks.length === 0) return "Create a verification task to get started";
    if (submittedTasks.length > 0) return "Evidence uploaded — review and mark as completed";
    if (activeTasks.length > 0) return "Captains are travelling to your locations";
    return "All tasks resolved";
  })();

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 tracking-tight">{contextTitle}</h1>
          <p className="text-sm text-surface-500 mt-0.5">{contextSub}</p>
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
            <Card key={stat.label} padding="sm" className={`relative flex flex-col justify-between min-h-[96px] ${stat.urgent ? "border-l-2 border-l-amber-400" : ""}`}>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-surface-500 font-medium">{stat.label}</span>
                <span className={stat.urgent ? "text-amber-400" : "text-surface-300"}>
                  <Icon size={18} />
                </span>
              </div>
              <span className="text-2xl font-bold text-surface-900 tabular-nums leading-none mt-4 block">
                {stat.value}
              </span>
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
