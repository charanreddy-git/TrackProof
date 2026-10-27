import { Link } from "react-router-dom";
import {
  TaskTable,
  PageLoader,
  Button,
  VisitProgress,
} from "../../components";
import { useAuth } from "../../contexts";
import { useTaskList } from "../../hooks";
import {
  ArrowRightIcon,
  MapPinIcon,
  NavigationIcon,
  PlusIcon,
  ShieldCheckIcon,
} from "../../components/Icons";
import {
  isActiveStatus,
  sortForRequester,
  visitRef,
} from "../../utils/task";
import type { Task } from "../../types";

function todayLabel(): string {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

function inspectorName(task: Task): string | null {
  return task.acceptedBy?.name ?? null;
}

function featuredCopy(task: Task): {
  eyebrow: string;
  description: string;
  cta: string;
  to: string;
  secondaryTo?: string;
} {
  if (task.status === "SUBMITTED") {
    return {
      eyebrow: "Proof ready",
      description:
        "The photo and GPS details are ready. Review them and complete the visit when you’re happy.",
      cta: "Review proof",
      to: `/user/tasks/${task.id}#evidence`,
    };
  }

  if (task.status === "IN_PROGRESS") {
    return {
      eyebrow: "On the way",
      description: `${inspectorName(task) ?? "Your inspector"} is heading to the pin. Follow the visit live.`,
      cta: "Track live",
      to: `/user/track/${task.id}`,
      secondaryTo: `/user/tasks/${task.id}`,
    };
  }

  if (task.status === "ACCEPTED") {
    return {
      eyebrow: "Inspector assigned",
      description: `${inspectorName(task) ?? "A local inspector"} will start the visit shortly.`,
      cta: "View visit",
      to: `/user/tasks/${task.id}`,
    };
  }

  return {
    eyebrow: "Finding an inspector",
    description:
      "Your request is open to inspectors near the pin. We’ll update you as soon as someone accepts.",
    cta: "View request",
    to: `/user/tasks/${task.id}`,
  };
}

function CurrentVisitCard({ task }: { task: Task }) {
  const copy = featuredCopy(task);
  const meta = inspectorName(task);

  return (
    <section className="rounded-3xl border border-primary-200 bg-white p-4 shadow-card sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-2.5 py-1 text-[10.5px] font-bold text-accent-900">
          <span
            className={`h-1.5 w-1.5 rounded-full bg-accent-500 ${
              task.status === "IN_PROGRESS" || task.status === "OPEN"
                ? "animate-pulse-soft"
                : ""
            }`}
            aria-hidden="true"
          />
          {copy.eyebrow}
        </span>
        <span className="text-[10px] font-semibold tabular-nums text-surface-400">
          {visitRef(task.id)}
        </span>
      </div>

      <h2 className="mt-3 line-clamp-2 text-[1.3rem] font-extrabold leading-tight tracking-[-0.03em] text-surface-950">
        {task.title}
      </h2>
      <p className="mt-1.5 text-[11.5px] leading-relaxed text-surface-600">
        {copy.description}
      </p>
      {meta && (
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-surface-100 px-2.5 py-1 text-[10px] font-semibold text-surface-600">
          <ShieldCheckIcon size={11} className="text-primary-600" />
          Inspector {meta}
        </p>
      )}

      <VisitProgress status={task.status} className="mt-4" />

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button
          to={copy.to}
          variant="accent"
          className="min-h-11 flex-1 justify-between px-4 sm:justify-center"
        >
          {copy.cta}
          <ArrowRightIcon size={15} />
        </Button>
        {copy.secondaryTo && (
          <Button
            to={copy.secondaryTo}
            variant="secondary"
            className="min-h-11 sm:w-auto"
          >
            Details
          </Button>
        )}
      </div>
    </section>
  );
}

function BookVisitCard() {
  return (
    <section className="rounded-3xl border border-primary-200 bg-white p-5 shadow-card">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
        <MapPinIcon size={21} />
      </span>
      <h2 className="mt-3 text-[1.3rem] font-extrabold leading-tight tracking-[-0.03em] text-surface-950">
        Need eyes on a property?
      </h2>
      <p className="mt-1.5 max-w-md text-[12px] leading-relaxed text-surface-600">
        Pin the flat, plot, or site. A local inspector checks it and sends
        GPS-verified proof with the photo.
      </p>
      <Button
        to="/user/create-task"
        variant="accent"
        className="mt-4 min-h-11 w-full sm:w-auto"
      >
        <PlusIcon size={15} />
        Book a visit
      </Button>
    </section>
  );
}

export function UserDashboard() {
  const { data: tasks, isLoading } = useTaskList();
  const { user } = useAuth();

  if (isLoading) return <PageLoader />;

  const allTasks = tasks || [];
  const activeTasks = sortForRequester(allTasks.filter((task) => isActiveStatus(task.status)));
  const completedTasks = allTasks.filter((task) => task.status === "COMPLETED");
  const featuredTask = activeTasks[0] ?? null;
  const otherTasks = allTasks.filter((task) => task.id !== featuredTask?.id);
  const needsReview = activeTasks.filter((task) => task.status === "SUBMITTED").length;
  const firstName = user?.name?.split(" ")[0] || "there";

  const subtitle = (() => {
    if (allTasks.length === 0) {
      return "Book a property visit and a local inspector will check it.";
    }
    if (activeTasks.length > 0) {
      const active = `${activeTasks.length} active visit${activeTasks.length === 1 ? "" : "s"}`;
      return needsReview > 0
        ? `${active} · ${needsReview} proof${needsReview === 1 ? "" : "s"} to review`
        : `${active} · updates appear here automatically`;
    }
    return `${completedTasks.length} past visit${completedTasks.length === 1 ? "" : "s"} · book again whenever you need`;
  })();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-primary-700">{todayLabel()}</p>
          <h1 className="mt-1 text-[2rem] font-extrabold leading-[1.05] tracking-[-0.04em] text-surface-950 sm:text-[2.4rem]">
            Hi {firstName}
          </h1>
          <p className="mt-1.5 max-w-md text-[12.5px] leading-relaxed text-surface-600">
            {subtitle}
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

      <div className="mt-5">
        {featuredTask ? <CurrentVisitCard task={featuredTask} /> : <BookVisitCard />}
      </div>

      {otherTasks.length > 0 && (
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-[1.25rem] font-extrabold tracking-[-0.03em] text-surface-950">
              Other visits
            </h2>
            <Link
              to="/user/tasks"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-[11.5px] font-bold text-primary-700 transition-colors hover:bg-white"
            >
              See all
              <ArrowRightIcon size={13} />
            </Link>
          </div>
          <TaskTable
            tasks={otherTasks.slice(0, 4)}
            basePath="/user/tasks"
            showAcceptedBy
            emptyMessage="No visits yet"
            emptyDescription="Book a property visit to get started."
          />
        </section>
      )}

      {allTasks.length > 0 && otherTasks.length === 0 && (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-surface-100 px-4 py-3">
          <p className="flex items-center gap-2 text-[11.5px] font-semibold text-surface-600">
            <NavigationIcon size={14} className="flex-shrink-0 text-primary-600" />
            Past visits and proof stay in your history.
          </p>
          <Link
            to="/user/tasks"
            className="flex-shrink-0 text-[11.5px] font-bold text-primary-700 underline underline-offset-4"
          >
            My visits
          </Link>
        </div>
      )}
    </div>
  );
}
