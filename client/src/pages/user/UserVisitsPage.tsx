import { useState } from "react";
import { TaskTable, PageLoader, Button } from "../../components";
import { useTaskList } from "../../hooks";
import { PlusIcon } from "../../components/Icons";
import { isActiveStatus, sortForRequester } from "../../utils/task";

type VisitTab = "active" | "past";

const TABS: { id: VisitTab; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "past", label: "Past" },
];

export function UserVisitsPage() {
  const { data: tasks, isLoading } = useTaskList();
  const [chosenTab, setChosenTab] = useState<VisitTab | null>(null);

  if (isLoading) return <PageLoader />;

  const allTasks = tasks || [];
  const activeTasks = sortForRequester(
    allTasks.filter((task) => isActiveStatus(task.status))
  );
  const pastTasks = allTasks
    .filter((task) => task.status === "COMPLETED")
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  const counts: Record<VisitTab, number> = {
    active: activeTasks.length,
    past: pastTasks.length,
  };
  // Land on Past when that is the only place with visits to show.
  const tab: VisitTab =
    chosenTab ?? (activeTasks.length === 0 && pastTasks.length > 0 ? "past" : "active");
  const visibleTasks = tab === "active" ? activeTasks : pastTasks;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[2rem] font-extrabold leading-[1.05] tracking-[-0.04em] text-surface-950 sm:text-[2.4rem]">
            My visits
          </h1>
          <p className="mt-1.5 max-w-md text-[12.5px] leading-relaxed text-surface-600">
            Track live visits and open past proof, all in one place.
          </p>
        </div>
        <Button
          to="/user/create-task"
          variant="accent"
          size="sm"
          className="min-h-11 flex-shrink-0 px-3.5"
        >
          <PlusIcon size={15} />
          Book a visit
        </Button>
      </div>

      <div
        role="tablist"
        aria-label="Visit history"
        className="mt-5 grid grid-cols-2 gap-1.5 rounded-2xl border border-surface-200 bg-white p-1.5 shadow-sm"
      >
        {TABS.map((item) => {
          const selected = tab === item.id;
          return (
            <button
              key={item.id}
              id={`user-visits-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="user-visits-panel"
              onClick={() => setChosenTab(item.id)}
              className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-[12.5px] font-bold transition-colors ${
                selected
                  ? "bg-primary-800 text-white shadow-sm"
                  : "text-surface-600 hover:bg-surface-50 hover:text-surface-950"
              }`}
            >
              {item.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold tabular-nums ${
                  selected
                    ? "bg-white/15 text-white"
                    : "bg-surface-100 text-surface-500"
                }`}
              >
                {counts[item.id]}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id="user-visits-panel"
        role="tabpanel"
        aria-labelledby={`user-visits-tab-${tab}`}
        className="mt-4"
      >
        <TaskTable
          tasks={visibleTasks}
          basePath="/user/tasks"
          showAcceptedBy
          emptyMessage={tab === "active" ? "No active visits" : "No past visits yet"}
          emptyDescription={
            tab === "active"
              ? "Book a property visit and follow its progress here."
              : "Completed visits and their proof will appear here."
          }
          emptyAction={
            tab === "active"
              ? { label: "Book a visit", to: "/user/create-task" }
              : undefined
          }
        />
      </div>
    </div>
  );
}
