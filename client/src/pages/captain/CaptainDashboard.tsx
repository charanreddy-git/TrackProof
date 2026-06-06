import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { TaskTable } from "../../components/TaskTable";
import { PageLoader } from "../../components/ui/Spinner";
import { useTaskList } from "../../hooks/useTasks";
import {
  ZapIcon,
  ClipboardIcon,
  CheckCircleIcon,
  IndianRupeeIcon,
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

  const totalEarnings = myCompleted.length * 150; // Base estimated payout

  const stats = [
    {
      label: "Active",
      value: myInProgress.length,
      icon: ZapIcon,
      href: "/captain/accepted",
      urgent: myInProgress.length > 0,
      highlight: true,
    },
    {
      label: "Pending",
      value: mySubmitted.length,
      icon: ClipboardIcon,
    },
    {
      label: "Completed",
      value: myCompleted.length,
      icon: CheckCircleIcon,
    },
    {
      label: "Earnings",
      value: `₹${totalEarnings}`,
      icon: IndianRupeeIcon,
      highlight: true,
    },
  ];

  const hasCurrentAction = myInProgress.length > 0 || mySubmitted.length > 0;

  const contextTitle = (() => {
    if (myInProgress.length > 0) return `${myInProgress.length} active task${myInProgress.length > 1 ? "s" : ""}`;
    if (available.length > 0) return `${available.length} tasks nearby`;
    return "No new tasks";
  })();

  const contextSub = (() => {
    if (myInProgress.length > 0) return "Head to the location and submit evidence";
    if (available.length > 0) return "Accept a task to get started";
    return "Check back shortly for new verification tasks";
  })();

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-surface-900 tracking-tight">{contextTitle}</h1>
        <p className="text-sm text-surface-500 mt-0.5">{contextSub}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isUrgent = stat.urgent;
          const card = (
            <Card key={stat.label} padding="sm" className={`relative flex flex-col justify-between min-h-[96px] h-full ${isUrgent ? "border-l-2 border-l-amber-400" : ""}`}>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-surface-500 font-medium">{stat.label}</span>
                <span className={isUrgent ? "text-amber-400" : stat.highlight ? "text-emerald-500" : "text-surface-300"}>
                  <Icon size={18} />
                </span>
              </div>
              <span className={`text-2xl font-bold tabular-nums leading-none mt-4 block ${stat.highlight && stat.label === "Earnings" ? "text-emerald-600" : "text-surface-900"}`}>
                {stat.value}
              </span>
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

      {/* Your Current Action Section */}
      {hasCurrentAction && (
        <Card padding="md" className="border-amber-200 bg-amber-50/30">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse-soft" />
            <h2 className="text-[14px] font-bold text-surface-900">Your Current Tasks</h2>
          </div>
          <p className="text-[12px] text-surface-400 mb-4">Complete these tasks to earn your payout.</p>
          <TaskTable
            tasks={[...myInProgress, ...mySubmitted]}
            basePath="/captain/tasks"
            showCreatedBy
          />
        </Card>
      )}

      {/* Tasks Near You */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[14px] font-bold text-surface-900">Tasks Near You</h2>
        </div>
        <p className="text-[12px] text-surface-400 mb-4">Browse and accept available verification tasks.</p>
        
        {available.length > 0 ? (
          <TaskTable
            tasks={available.slice(0, 5)}
            basePath="/captain/tasks"
            showCreatedBy
          />
        ) : (
          <div className="text-center py-6">
             <p className="text-[13px] text-surface-500 font-medium">No tasks available nearby right now.</p>
             <p className="text-[12px] text-surface-400 mt-1">We'll notify you when a new request is created.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
