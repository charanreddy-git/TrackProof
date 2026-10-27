import { Link } from "react-router-dom";
import { TaskTable, PageLoader, Button } from "../../components";
import { useAuth } from "../../contexts";
import { useTaskList } from "../../hooks";
import {
  CheckIcon,
  MapPinIcon,
  CameraIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ClipboardIcon,
  CompassIcon,
  ShieldCheckIcon,
} from "../../components/Icons";

function todayLabel(): string {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

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
  const openTasks = allTasks.filter((task) => task.status === "OPEN");

  const firstName = user?.name?.split(" ")[0] || "there";

  const subtitle = (() => {
    if (allTasks.length === 0) return "Book your first property visit — it starts with a pin.";
    if (submittedTasks.length > 0) {
      return `${submittedTasks.length} proof${submittedTasks.length > 1 ? "s" : ""} ready for you to review.`;
    }
    if (activeTasks.length > 0) {
      return `${activeTasks.length} visit${activeTasks.length > 1 ? "s are" : " is"} moving right now.`;
    }
    if (openTasks.length > 0) {
      return `${openTasks.length} request${openTasks.length > 1 ? "s are" : " is"} waiting for a local inspector.`;
    }
    return "All your property visits are complete and up to date.";
  })();

  const nextTask = submittedTasks[0] ?? activeTasks[0] ?? openTasks[0] ?? null;
  const nextTaskCopy = (() => {
    if (submittedTasks[0]) {
      return {
        eyebrow: "Proof ready",
        title: "Your proof is ready to review.",
        desc: "Open the visit, check the photo against your property, and mark it complete when you’re happy.",
        cta: "Review proof",
      };
    }
    if (activeTasks[0]) {
      return {
        eyebrow: "Visit in progress",
        title:
          activeTasks[0].status === "IN_PROGRESS"
            ? "An inspector is on the way."
            : "An inspector is assigned.",
        desc: "Follow the trip live, or leave it running and come back when there’s an update.",
        cta: "View visit",
      };
    }
    if (openTasks[0]) {
      return {
        eyebrow: "Finding an inspector",
        title: "Your request is open nearby.",
        desc: "We’ll update you as soon as a local inspector accepts. There’s nothing else you need to do.",
        cta: "View request",
      };
    }
    return {
      eyebrow: "All caught up",
      title: "No open visits right now.",
      desc: "Whenever you need eyes on the ground, book another property visit.",
      cta: "Book a visit",
    };
  })();

  const summary = [
    {
      label: "All visits",
      value: allTasks.length,
      icon: ClipboardIcon,
      tint: "bg-primary-50 text-primary-700",
    },
    {
      label: "In progress",
      value: activeTasks.length,
      icon: CompassIcon,
      tint: "bg-info-50 text-info-700",
    },
    {
      label: "Ready to review",
      value: submittedTasks.length,
      icon: CameraIcon,
      tint: "bg-accent-50 text-accent-700",
      highlight: submittedTasks.length > 0,
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
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
            {todayLabel()}
          </p>
          <h1 className="mt-2.5 text-[2.1rem] font-extrabold leading-[1.03] tracking-[-0.04em] text-surface-950 sm:text-[2.6rem]">
            Hi {firstName}, your visits are here.
          </h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-surface-600">{subtitle}</p>
        </div>
        <Button to="/user/create-task" variant="accent" className="w-full flex-shrink-0 sm:w-auto">
          <span aria-hidden="true" className="text-[16px]">+</span>
          Book a visit
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
                    New
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
        <section className="min-w-0">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11.5px] font-bold text-primary-700">Keep track</p>
              <h2 className="mt-0.5 text-[1.5rem] font-extrabold tracking-[-0.03em] text-surface-950">
                Recent visits
              </h2>
            </div>
            {allTasks.length > 0 && (
              <Link
                to="/user/tasks"
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white px-3 text-[11.5px] font-bold text-primary-700 shadow-sm transition-colors hover:bg-primary-50"
              >
                View all
                <ArrowRightIcon size={13} />
              </Link>
            )}
          </div>

          {allTasks.length === 0 ? (
            <div className="overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-card">
              <div className="bg-primary-50/70 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary-700 shadow-sm">
                      <MapPinIcon size={21} />
                    </span>
                    <h3 className="mt-4 text-[1.45rem] font-extrabold leading-tight tracking-[-0.03em] text-surface-950">
                      Your first visit starts with a pin.
                    </h3>
                    <p className="mt-2 max-w-md text-[12.5px] leading-relaxed text-surface-600">
                      Send a local inspector to the exact plot, flat, or site. The
                      photo, location, and time come back together.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-2 p-4 sm:grid-cols-3 sm:p-5">
                {[
                  { title: "Pin the property", desc: "Use Google Maps or tap the spot.", number: "1" },
                  { title: "An inspector goes", desc: "Track the visit on the map.", number: "2" },
                  { title: "Review the proof", desc: "See the GPS-verified photo.", number: "3" },
                ].map((step) => (
                  <div key={step.number} className="rounded-xl bg-surface-50 p-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-800 text-[10px] font-extrabold text-white">
                      {step.number}
                    </span>
                    <p className="mt-2 text-[12px] font-bold text-surface-900">{step.title}</p>
                    <p className="mt-0.5 text-[10.5px] leading-relaxed text-surface-500">{step.desc}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-surface-100 p-4 sm:p-5">
                <Button to="/user/create-task" variant="accent" size="sm">
                  Book your first visit
                  <ArrowRightIcon size={14} />
                </Button>
              </div>
            </div>
          ) : (
            <TaskTable
              tasks={allTasks.slice(0, 5)}
              basePath="/user/tasks"
              showAcceptedBy
              emptyMessage="No visits yet"
              emptyDescription="Book a property visit to get started."
            />
          )}
        </section>

        <aside className="min-w-0 space-y-3.5">
          <div className="rounded-3xl bg-primary-900 p-5 text-white shadow-card">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-bold text-accent-300">{nextTaskCopy.eyebrow}</p>
              <span className="h-2 w-2 rounded-full bg-accent-400" aria-hidden="true" />
            </div>
            <h2 className="mt-2.5 text-[1.4rem] font-extrabold leading-tight tracking-[-0.03em]">
              {nextTaskCopy.title}
            </h2>
            <p className="mt-2 text-[11.5px] leading-relaxed text-primary-200">
              {nextTaskCopy.desc}
            </p>
            <Link
              to={nextTask ? `/user/tasks/${nextTask.id}` : "/user/create-task"}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-between rounded-xl bg-white px-3.5 text-[12px] font-bold text-primary-900 transition-colors hover:bg-accent-100"
            >
              {nextTaskCopy.cta}
              <ArrowRightIcon size={14} />
            </Link>
          </div>

          <div className="rounded-2xl border border-surface-200 bg-white p-4 shadow-sm">
            <p className="flex items-center gap-1.5 text-[11.5px] font-bold text-surface-800">
              <ShieldCheckIcon size={14} className="text-primary-600" />
              What “verified” means
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
                "Location checked on upload",
                "Coordinates saved with the photo",
                "Capture time recorded",
              ].map((item) => (
                <p key={item} className="flex items-start gap-2 text-[11px] leading-relaxed text-surface-600">
                  <CheckIcon size={12} className="mt-0.5 flex-shrink-0 text-primary-600" />
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-surface-100 p-4">
            <p className="text-[11.5px] font-bold text-surface-800">Need a hand?</p>
            <p className="mt-1 text-[11px] leading-relaxed text-surface-500">
              Questions about a visit or your proof? Write to{" "}
              <a href="mailto:hello@trackproof.in" className="font-bold text-primary-700 underline underline-offset-2">
                hello@trackproof.in
              </a>
              .
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
