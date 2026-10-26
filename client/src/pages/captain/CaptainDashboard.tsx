import { Card, TaskTable, PageLoader, Button } from "../../components";
import { useAuth } from "../../contexts";
import { useTaskList } from "../../hooks";
import {
  SearchIcon,
  ZapIcon,
  CheckCircleIcon,
  MapPinIcon,
  CameraIcon,
  IndianRupeeIcon,
} from "../../components/Icons";

export function CaptainDashboard() {
  const { data: allTasks, isLoading: loadingAll } = useTaskList();
  const { data: availableTasks, isLoading: loadingAvailable } = useTaskList("available");
  const { user } = useAuth();

  if (loadingAll || loadingAvailable) return <PageLoader />;

  const tasks = allTasks || [];
  const available = availableTasks || [];
  const firstName = user?.name?.split(" ")[0] || "there";

  const activeTasks = tasks.filter((task) =>
    ["ACCEPTED", "IN_PROGRESS"].includes(task.status)
  );
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED");
  const submittedTasks = tasks.filter((task) => task.status === "SUBMITTED");

  const stats = [
    {
      label: "Available now",
      value: available.length,
      icon: SearchIcon,
      highlight: available.length > 0,
    },
    {
      label: "Active visits",
      value: activeTasks.length,
      icon: ZapIcon,
    },
    {
      label: "Completed",
      value: completedTasks.length,
      icon: CheckCircleIcon,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-surface-950">
          Find work, {firstName}
        </h1>
        <p className="mt-1 text-sm text-surface-500">
          {available.length > 0
            ? `${available.length} property visit${available.length > 1 ? "s" : ""} available near you.`
            : "New property visits will appear here when they are posted."}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} padding="sm" className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-medium text-surface-500 sm:text-[13px]">{stat.label}</span>
                <Icon
                  size={16}
                  className={stat.highlight ? "text-accent-600" : "text-surface-300"}
                />
              </div>
              <span
                className={`text-3xl font-bold leading-none tabular-nums tracking-tight ${
                  stat.highlight ? "text-accent-700" : "text-surface-950"
                }`}
              >
                {stat.value}
              </span>
            </Card>
          );
        })}
      </div>

      {/* Available requests first — this is what an inspector needs to act on. */}
      {available.length > 0 && (
        <Card>
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-surface-950">New requests near you</h2>
              <p className="text-[13px] text-surface-500">Open a request to see the location and accept it.</p>
            </div>
            <span className="flex-shrink-0 rounded-full bg-accent-50 px-2.5 py-1 text-[11px] font-semibold text-accent-700">
              {available.length} open
            </span>
          </div>

          <TaskTable
            tasks={available}
            basePath="/captain/tasks"
            showCreatedBy
            emptyMessage="No open requests right now"
            emptyDescription="New property visits will appear here. Check back after some time."
          />
        </Card>
      )}

      {(activeTasks.length > 0 || submittedTasks.length > 0) && (
        <Card>
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-surface-950">Your active visits</h2>
              <p className="text-[13px] text-surface-500">
                {submittedTasks.length > 0
                  ? "Some visits are waiting for the requester to review your proof."
                  : "Travel to the property and submit your photo."}
              </p>
            </div>
            <Button to="/captain/accepted" variant="ghost" size="sm" className="min-h-11 flex-shrink-0">
              View all
            </Button>
          </div>
          <TaskTable
            tasks={[...activeTasks, ...submittedTasks]}
            basePath="/captain/tasks"
            showCreatedBy
          />
        </Card>
      )}

      {activeTasks.length === 0 && submittedTasks.length === 0 && available.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: MapPinIcon, title: "Check the location", desc: "Open a request and confirm it is reachable for you." },
            { icon: CameraIcon, title: "Take a proof photo", desc: "Use the in-app camera within 100 m of the pin." },
            { icon: IndianRupeeIcon, title: "Earn per visit", desc: "Completed visits stay in your history and are settled weekly." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-xl border border-surface-200 bg-white p-4">
                <Icon size={17} className="text-accent-600" />
                <p className="mt-2.5 text-sm font-semibold text-surface-900">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-surface-500">{item.desc}</p>
              </div>
            );
          })}
        </div>
      )}

      {activeTasks.length === 0 && submittedTasks.length === 0 && available.length === 0 && (
        <Card className="border-accent-100 bg-accent-50/40">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
              <SearchIcon size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-surface-900">You're all caught up</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-surface-600">
                There are no open requests near you right now. Keep this page
                open or check back later — new visits are posted through the day.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
