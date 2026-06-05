import { Link } from "react-router-dom";
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
  const myInProgress = tasks.filter((t) =>
    ["ACCEPTED", "IN_PROGRESS"].includes(t.status)
  );
  const mySubmitted = tasks.filter((t) => t.status === "SUBMITTED");
  const myCompleted = tasks.filter((t) => t.status === "COMPLETED");

  const stats = [
    {
      label: "Available",
      value: available.length,
      icon: SearchIcon,
      href: "/captain/available",
      highlight: available.length > 0,
      highlightLabel: "New",
      highlightColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      label: "Active",
      value: myInProgress.length,
      icon: ZapIcon,
      href: "/captain/accepted",
      highlight: myInProgress.length > 0,
      highlightLabel: "Active",
      highlightColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      label: "Submitted",
      value: mySubmitted.length,
      icon: ClipboardIcon,
    },
    {
      label: "Completed",
      value: myCompleted.length,
      icon: CheckCircleIcon,
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-surface-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          {available.length > 0
            ? `${available.length} task${available.length !== 1 ? "s" : ""} available to accept`
            : "No new tasks available right now"}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const card = (
            <Card key={stat.label} padding="sm" className="relative flex flex-col justify-between min-h-[96px] h-full">
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

          return stat.href ? (
            <Link key={stat.label} to={stat.href} className="block">
              {card}
            </Link>
          ) : (
            <div key={stat.label}>{card}</div>
          );
        })}
      </div>

      {/* Active Tasks */}
      {myInProgress.length > 0 && (
        <Card padding="md">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse-soft" />
            <h2 className="text-[14px] font-bold text-surface-900">Active Tasks</h2>
          </div>
          <p className="text-[12px] text-surface-400 mb-4">Tasks you're currently working on</p>
          <TaskTable
            tasks={myInProgress}
            basePath="/captain/tasks"
            showCreatedBy
          />
        </Card>
      )}

      {/* Available Tasks Preview */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[14px] font-bold text-surface-900">Available Tasks</h2>
          {available.length > 5 && (
            <Link
              to="/captain/available"
              className="text-[12.5px] text-primary-600 hover:text-primary-700 font-semibold"
            >
              View all
            </Link>
          )}
        </div>
        <p className="text-[12px] text-surface-400 mb-4">Browse and accept tasks near you</p>
        <TaskTable
          tasks={available.slice(0, 5)}
          basePath="/captain/tasks"
          showCreatedBy
          emptyMessage="No available tasks"
          emptyAction={{ label: "Browse all tasks", to: "/captain/available" }}
        />
      </Card>
    </div>
  );
}
