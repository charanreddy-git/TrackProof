import { Link } from "react-router-dom";
import { Card, TaskTable, PageLoader, Button } from "../../components";
import { useAuth } from "../../contexts";
import { useTaskList } from "../../hooks";
import {
  ClipboardIcon,
  ZapIcon,
  CheckCircleIcon,
  CameraIcon,
  MapPinIcon,
  CheckIcon,
} from "../../components/Icons";

export function UserDashboard() {
  const { data: tasks, isLoading } = useTaskList();
  const { user } = useAuth();

  if (isLoading) return <PageLoader />;

  const allTasks = tasks || [];
  const activeTasks = allTasks.filter((task) =>
    ["ACCEPTED", "IN_PROGRESS"].includes(task.status)
  );
  const submittedTasks = allTasks.filter((task) => task.status === "SUBMITTED");
  const completedTasks = allTasks.filter((task) => task.status === "COMPLETED");

  const firstName = user?.name?.split(" ")[0] || "there";

  const subtitle = (() => {
    if (allTasks.length === 0) return "Request a visit and get photo proof from your property.";
    if (submittedTasks.length > 0) {
      return `${submittedTasks.length} visit${submittedTasks.length > 1 ? "s" : ""} ready for you to review.`;
    }
    if (activeTasks.length > 0) {
      return `${activeTasks.length} visit${activeTasks.length > 1 ? "s" : ""} in progress right now.`;
    }
    return "Your property visits are all up to date.";
  })();

  const stats = [
    {
      label: "All requests",
      value: allTasks.length,
      icon: ClipboardIcon,
    },
    {
      label: "In progress",
      value: activeTasks.length,
      icon: ZapIcon,
    },
    {
      label: "Ready to review",
      value: submittedTasks.length,
      icon: CameraIcon,
      highlight: submittedTasks.length > 0,
    },
    {
      label: "Completed",
      value: completedTasks.length,
      icon: CheckCircleIcon,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-950">
            Hello, {firstName}
          </h1>
          <p className="mt-1 text-sm text-surface-500">{subtitle}</p>
        </div>
        <Button to="/user/create-task" className="w-full sm:w-auto">
          <span aria-hidden="true" className="text-base leading-none">+</span>
          Request a visit
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} padding="sm" className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-surface-500">{stat.label}</span>
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

      {allTasks.length === 0 ? (
        <Card padding="lg">
          <div className="max-w-lg">
            <h2 className="text-lg font-bold tracking-tight text-surface-950">
              Your first visit starts here
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-surface-600">
              Pin the property you want checked, add a short note, and a local
              inspector will visit.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: MapPinIcon,
                title: "Pin the property",
                desc: "Paste a Google Maps link or tap the map.",
              },
              {
                icon: CameraIcon,
                title: "We visit",
                desc: "An inspector travels to the exact location.",
              },
              {
                icon: CheckCircleIcon,
                title: "Review proof",
                desc: "See a GPS-verified photo in your dashboard.",
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="rounded-xl border border-surface-200 bg-surface-50/60 p-4">
                  <div className="flex items-center justify-between">
                    <Icon size={18} className="text-primary-700" />
                    <span className="text-[11px] font-bold text-surface-300">0{index + 1}</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-surface-900">{step.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-surface-500">{step.desc}</p>
                </div>
              );
            })}
          </div>

          <Button to="/user/create-task" className="mt-6">
            Request your first visit
          </Button>
        </Card>
      ) : (
        <Card>
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-surface-950">Recent requests</h2>
              <p className="text-[13px] text-surface-500">Tap a request to see its progress.</p>
            </div>
            {allTasks.length > 5 && (
              <Link
                to="/user/tasks"
                className="flex-shrink-0 inline-flex min-h-11 items-center text-[13px] font-semibold text-primary-700 hover:text-primary-800"
              >
                View all
              </Link>
            )}
          </div>
          <TaskTable
            tasks={allTasks.slice(0, 6)}
            basePath="/user/tasks"
            showAcceptedBy
            emptyMessage="No requests yet"
            emptyDescription="Request a property visit to get started."
          />
        </Card>
      )}

      <div className="flex items-start gap-2.5 rounded-xl border border-surface-200 bg-white px-4 py-3 text-[13px] leading-relaxed text-surface-500">
        <CheckIcon size={15} className="mt-0.5 flex-shrink-0 text-primary-600" />
        <p>
          Proof is only accepted within <strong className="font-semibold text-surface-700">100 metres</strong> of your
          pin, with the location and time attached. You can open the evidence
          anytime from a visit.
        </p>
      </div>
    </div>
  );
}
