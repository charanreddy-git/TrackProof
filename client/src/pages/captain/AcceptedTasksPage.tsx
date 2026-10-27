import { TaskTable, PageLoader, Button } from "../../components";
import { useTaskList } from "../../hooks";
import {
  ClipboardIcon,
  CompassIcon,
  CameraIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "../../components/Icons";

function todayLabel(): string {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

export function AcceptedTasksPage() {
  const { data: tasks, isLoading } = useTaskList("accepted");

  if (isLoading) return <PageLoader />;

  const allTasks = tasks || [];
  const activeTasks = allTasks.filter((task) =>
    ["ACCEPTED", "IN_PROGRESS", "SUBMITTED"].includes(task.status)
  );
  const completedTasks = allTasks.filter((task) => task.status === "COMPLETED");
  const hasTasks = allTasks.length > 0;

  const summary = [
    {
      label: "Active visits",
      value: allTasks.filter((task) =>
        ["ACCEPTED", "IN_PROGRESS"].includes(task.status)
      ).length,
      icon: CompassIcon,
      tint: "bg-info-50 text-info-700",
    },
    {
      label: "Awaiting review",
      value: allTasks.filter((task) => task.status === "SUBMITTED").length,
      icon: CameraIcon,
      tint: "bg-accent-50 text-accent-700",
    },
    {
      label: "Completed",
      value: completedTasks.length,
      icon: CheckCircleIcon,
      tint: "bg-success-50 text-success-700",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-surface-500 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
            {todayLabel()}
          </p>
          <h1 className="mt-2.5 text-[2.1rem] font-extrabold leading-[1.03] tracking-[-0.04em] text-surface-950 sm:text-[2.6rem]">
            My visits
          </h1>
          <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-surface-600">
            {hasTasks
              ? `${activeTasks.length} active and ${completedTasks.length} completed. Everything you accept stays in this list.`
              : "Visits you accept will appear here, from assignment through proof."}
          </p>
        </div>
        <Button
          to="/captain/dashboard"
          variant="accent"
          className="w-full flex-shrink-0 sm:w-auto"
        >
          Find more work
          <ArrowRightIcon size={15} />
        </Button>
      </div>

      {hasTasks && (
        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {summary.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-surface-200 bg-white p-3.5 shadow-sm"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.tint}`}
                >
                  <Icon size={16} />
                </span>
                <p className="mt-3 text-[1.7rem] font-extrabold leading-none tracking-[-0.04em] text-surface-950">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-[10.5px] font-semibold leading-tight text-surface-500">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6">
        <section className="min-w-0">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11.5px] font-bold text-primary-700">
                In your hands
              </p>
              <h2 className="mt-0.5 text-[1.45rem] font-extrabold tracking-[-0.03em] text-surface-950">
                Active visits
              </h2>
            </div>
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-surface-500 shadow-sm">
              {activeTasks.length} open
            </span>
          </div>

          <TaskTable
            tasks={activeTasks}
            basePath="/captain/tasks"
            showCreatedBy
            emptyMessage="No active visits"
            emptyDescription="Accept a request from the dashboard to start a visit."
            emptyAction={{
              label: "Find available work",
              to: "/captain/dashboard",
            }}
          />
        </section>

        {completedTasks.length > 0 && (
          <section className="min-w-0">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11.5px] font-bold text-primary-700">
                  All done
                </p>
                <h2 className="mt-0.5 text-[1.45rem] font-extrabold tracking-[-0.03em] text-surface-950">
                  Completed visits
                </h2>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-surface-500 shadow-sm">
                {completedTasks.length} completed
              </span>
            </div>

            <TaskTable
              tasks={completedTasks}
              basePath="/captain/tasks"
              showCreatedBy
            />
          </section>
        )}

        {!hasTasks && (
          <div className="rounded-2xl bg-surface-100 px-4 py-3.5">
            <p className="flex items-start gap-2 text-[11.5px] leading-relaxed text-surface-600">
              <ClipboardIcon
                size={14}
                className="mt-0.5 flex-shrink-0 text-primary-600"
              />
              Your accepted visits appear here. New requests show up on the Find
              work page during the day.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
