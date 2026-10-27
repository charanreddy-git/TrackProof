import { TaskTable, PageLoader, Button } from "../../components";
import { useAuth } from "../../contexts";
import { useTaskList } from "../../hooks";
import {
  CheckIcon,
  MapPinIcon,
  CameraIcon,
  ArrowRightIcon,
  SearchIcon,
  ClipboardIcon,
  CompassIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from "../../components/Icons";

function todayLabel(): string {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

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
  const submittedTasks = tasks.filter((task) => task.status === "SUBMITTED");
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED");

  const summary = [
    {
      label: "Available now",
      value: available.length,
      icon: SearchIcon,
      tint: "bg-accent-50 text-accent-700",
      highlight: available.length > 0,
    },
    {
      label: "Active visits",
      value: activeTasks.length,
      icon: CompassIcon,
      tint: "bg-info-50 text-info-700",
    },
    {
      label: "Awaiting review",
      value: submittedTasks.length,
      icon: CameraIcon,
      tint: "bg-primary-50 text-primary-700",
    },
    {
      label: "Completed",
      value: completedTasks.length,
      icon: CheckCircleIcon,
      tint: "bg-success-50 text-success-700",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-surface-500 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
            {todayLabel()}
          </p>
          <h1 className="mt-2.5 text-[2.1rem] font-extrabold leading-[1.03] tracking-[-0.04em] text-surface-950 sm:text-[2.6rem]">
            Find work near you, {firstName}.
          </h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-surface-600">
            {available.length > 0
              ? `${available.length} property visit${available.length > 1 ? "s" : ""} available around you right now.`
              : "No open visits on the board right now. New requests appear through the day."}
          </p>
        </div>
        <Button to="/captain/accepted" variant="secondary" className="w-full flex-shrink-0 sm:w-auto">
          My visits
          <ArrowRightIcon size={15} />
        </Button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {summary.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-2xl border bg-white p-3.5 shadow-sm ${
                stat.highlight ? "border-accent-200" : "border-surface-200"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.tint}`}>
                  <Icon size={16} />
                </span>
                {stat.highlight && (
                  <span className="rounded-full bg-accent-100 px-2 py-0.5 text-[9.5px] font-bold text-accent-800">
                    Open
                  </span>
                )}
              </div>
              <p className="mt-3 text-[1.9rem] font-extrabold leading-none tracking-[-0.04em] text-surface-950">
                {stat.value}
              </p>
              <p className="mt-1.5 text-[11px] font-semibold text-surface-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.45fr_0.55fr]">
        <div className="space-y-5 min-w-0">
          <section>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11.5px] font-bold text-primary-700">Open requests</p>
                <h2 className="mt-0.5 text-[1.5rem] font-extrabold tracking-[-0.03em] text-surface-950">
                  Available visits
                </h2>
              </div>
              {available.length > 0 && (
                <span className="rounded-full bg-accent-100 px-2.5 py-1 text-[10px] font-bold text-accent-800">
                  {available.length} nearby
                </span>
              )}
            </div>

            <TaskTable
              tasks={available}
              basePath="/captain/tasks"
              showCreatedBy
              emptyMessage="The board is quiet"
              emptyDescription="New visits will appear here when requesters book them."
            />

            {available.length === 0 && (
              <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-surface-200 bg-white px-3.5 py-3 shadow-sm">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-surface-400" />
                <p className="text-[11.5px] leading-relaxed text-surface-500">
                  Keep this page open and check back — there is nothing to refresh
                  manually. New requests arrive during the day.
                </p>
              </div>
            )}
          </section>

          {(activeTasks.length > 0 || submittedTasks.length > 0) && (
            <section>
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11.5px] font-bold text-primary-700">In your hands</p>
                  <h2 className="mt-0.5 text-[1.5rem] font-extrabold tracking-[-0.03em] text-surface-950">
                    Active visits
                  </h2>
                </div>
                <Button to="/captain/accepted" variant="ghost" size="sm">
                  View all
                </Button>
              </div>

              <TaskTable
                tasks={[...activeTasks, ...submittedTasks]}
                basePath="/captain/tasks"
                showCreatedBy
              />
            </section>
          )}

          {available.length === 0 &&
            activeTasks.length === 0 &&
            submittedTasks.length === 0 && (
              <div className="overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-card">
                <div className="bg-accent-50/80 p-5 sm:p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-accent-700 shadow-sm">
                    <ClipboardIcon size={21} />
                  </span>
                  <h2 className="mt-4 text-[1.45rem] font-extrabold leading-tight tracking-[-0.03em] text-surface-950">
                    Nothing on the board yet.
                  </h2>
                  <p className="mt-2 max-w-md text-[12.5px] leading-relaxed text-surface-600">
                    Your accepted visits and completed work stay in your history. New
                    requests appear here as soon as a requester books one.
                  </p>
                  <Button to="/captain/accepted" variant="secondary" size="sm" className="mt-4">
                    Open my visits
                  </Button>
                </div>
              </div>
            )}
        </div>

        <aside className="min-w-0 space-y-3.5">
          <div className="rounded-3xl bg-primary-900 p-5 text-white shadow-card">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-accent-300">
              <MapPinIcon size={13} />
              Before you accept
            </p>
            <h2 className="mt-2.5 text-[1.35rem] font-extrabold leading-tight tracking-[-0.03em]">
              Check you can reach the pin.
            </h2>
            <div className="mt-3 space-y-2">
              {[
                "Open the map and confirm the route",
                "Make sure you can arrive within a few hours",
                "Keep location on while travelling",
                "Take proof only within 100 m",
              ].map((item) => (
                <p key={item} className="flex items-start gap-2 text-[11px] leading-relaxed text-primary-200">
                  <CheckIcon size={12} className="mt-0.5 flex-shrink-0 text-accent-400" />
                  {item}
                </p>
              ))}
            </div>
            <p className="mt-3 border-t border-white/15 pt-3 text-[10.5px] leading-relaxed text-primary-300">
              Completed work stays in your visit history and settles on the current
              payout cycle.
            </p>
          </div>

          <div className="rounded-2xl border border-surface-200 bg-white p-4 shadow-sm">
            <p className="flex items-center gap-1.5 text-[11.5px] font-bold text-surface-800">
              <ShieldCheckIcon size={14} className="text-primary-600" />
              The proof standard
            </p>
            <div className="mt-3 flex items-end gap-2 border-b border-surface-100 pb-3">
              <p className="text-[2.9rem] font-extrabold leading-[0.8] tracking-[-0.055em] text-surface-950">100</p>
              <div className="pb-0.5">
                <p className="text-[11px] font-bold text-primary-700">metres</p>
                <p className="text-[10px] font-medium text-surface-500">maximum radius</p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {[
                { icon: MapPinIcon, text: "The pin is the destination, not the area." },
                { icon: CameraIcon, text: "The server checks GPS at upload." },
                { icon: CheckIcon, text: "Proof can’t be moved after submission." },
              ].map(({ icon: Icon, text }) => (
                <p key={text} className="flex items-start gap-2 text-[11px] leading-relaxed text-surface-600">
                  <Icon size={12} className="mt-0.5 flex-shrink-0 text-primary-600" />
                  {text}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-surface-100 p-4">
            <p className="text-[11.5px] font-bold text-surface-800">Inspector support</p>
            <p className="mt-1 text-[11px] leading-relaxed text-surface-500">
              Stuck on a visit? Write to{" "}
              <a href="mailto:field@trackproof.in" className="font-bold text-primary-700 underline underline-offset-2">
                field@trackproof.in
              </a>
              .
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
