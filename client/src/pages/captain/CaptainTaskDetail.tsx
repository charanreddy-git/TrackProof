import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
  Card,
  Button,
  StatusBadge,
  MapView,
  targetIcon,
  PageLoader,
  useToast,
  CompassIcon,
  CameraIcon,
  CheckIcon,
  MapPinIcon,
  NavigationIcon,
  AlertTriangleIcon,
} from "../../components";
import { useTaskDetail, useStartTask, useAcceptTask, useGeolocation } from "../../hooks";

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function CaptainTaskDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: task, isLoading, isError } = useTaskDetail(id!);
  const startTask = useStartTask();
  const acceptTask = useAcceptTask();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { startTracking, isTracking } = useGeolocation();
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  const handleStart = async () => {
    if (!task) return;
    try {
      await startTask.mutateAsync(task.id);
      addToast("success", "Visit started. Location sharing is on.");
      cleanupRef.current = startTracking(task.id);
    } catch (err) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "Could not start the visit.";
      addToast("error", errorMsg);
    }
  };

  const handleAccept = async () => {
    if (!task) return;
    try {
      await acceptTask.mutateAsync(task.id);
      addToast("success", "Request accepted. Start the visit when you're ready.");
    } catch (err) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "Could not accept this request.";
      addToast("error", errorMsg);
    }
  };

  if (isLoading) return <PageLoader />;

  if (isError || !task) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="text-xl font-bold text-surface-950">Request not found</h1>
        <p className="mt-2 text-sm text-surface-500">
          This request may no longer be available, or it may belong to another inspector.
        </p>
        <Button to="/captain/dashboard" className="mt-6">
          Back to find work
        </Button>
      </div>
    );
  }

  const API_URL = import.meta.env.VITE_API_URL || "";
  const baseUrl = API_URL.replace("/api", "");
  const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${task.targetLat},${task.targetLng}`;

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button to="/captain/dashboard" variant="ghost" size="sm" className="-ml-2 min-h-11">
          <span aria-hidden="true">←</span>
          Find work
        </Button>
        <p className="text-xs text-surface-500">Posted {formatDateTime(task.createdAt)}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-surface-950">{task.title}</h1>
          <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-surface-600">
            {task.description}
          </p>
        </div>
        <StatusBadge status={task.status} size="md" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="order-last space-y-4 lg:order-first lg:col-span-5">
          <Card>
            {task.status === "OPEN" && (
              <div>
                <h2 className="text-sm font-bold text-surface-950">Accept this visit?</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-surface-600">
                  You will be assigned to this property. Check the map and make sure
                  the location is reachable before accepting.
                </p>
                <Button
                  onClick={handleAccept}
                  isLoading={acceptTask.isPending}
                  className="mt-4 w-full"
                >
                  Accept request
                </Button>
                <p className="mt-3 text-center text-[11px] text-surface-500">
                  Only accept if you can visit in the next few hours.
                </p>
              </div>
            )}

            {task.status === "ACCEPTED" && (
              <div>
                <h2 className="text-sm font-bold text-surface-950">You're assigned</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-surface-600">
                  Start the visit when you begin travelling. The requester will be
                  able to follow your location on the map.
                </p>
                <Button
                  onClick={handleStart}
                  isLoading={startTask.isPending}
                  className="mt-4 w-full"
                >
                  <NavigationIcon size={16} />
                  Start visit
                </Button>
                <p className="mt-3 flex items-start gap-2 rounded-lg bg-surface-50 p-3 text-[11px] leading-relaxed text-surface-500">
                  <CompassIcon size={14} className="mt-0.5 flex-shrink-0 text-primary-600" />
                  Keep this page open while travelling so the requester can see you live.
                </p>
              </div>
            )}

            {task.status === "IN_PROGRESS" && (
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-bold text-surface-950">On the way</h2>
                  {isTracking ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 text-[11px] font-semibold text-success-700">
                      <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-success-500" />
                      Sharing location
                    </span>
                  ) : (
                    <span className="rounded-full bg-surface-100 px-2.5 py-1 text-[11px] font-semibold text-surface-500">
                      Tracking off
                    </span>
                  )}
                </div>

                {!isTracking && (
                  <button
                    type="button"
                    onClick={() => {
                      cleanupRef.current = startTracking(task.id);
                      addToast("info", "Location sharing is on.");
                    }}
                    className="mt-3 flex w-full items-center gap-2 rounded-xl border border-warning-100 bg-warning-50 px-3.5 py-3 text-left text-[12px] font-medium text-warning-800"
                  >
                    <CompassIcon size={15} className="flex-shrink-0" />
                    Turn on live location so the requester can follow you
                  </button>
                )}

                <div className="mt-4 space-y-2">
                  <Button href={mapsLink} variant="secondary" className="w-full">
                    <NavigationIcon size={16} />
                    Get directions
                  </Button>
                  <Button onClick={() => navigate(`/captain/tasks/${task.id}/upload`)} className="w-full">
                    <CameraIcon size={16} />
                    Take a proof photo
                  </Button>
                </div>

                <p className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-surface-500">
                  <AlertTriangleIcon size={14} className="mt-0.5 flex-shrink-0 text-warning-600" />
                  Proof can only be submitted within 100 metres of the pin.
                </p>
              </div>
            )}

            {task.status === "SUBMITTED" && (
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                    <CheckIcon size={16} />
                  </span>
                  <h2 className="text-sm font-bold text-surface-950">Proof submitted</h2>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-surface-600">
                  The requester is reviewing your photo. This visit is complete
                  once they mark it complete.
                </p>
              </div>
            )}

            {task.status === "COMPLETED" && (
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-50 text-success-700">
                    <CheckIcon size={16} />
                  </span>
                  <h2 className="text-sm font-bold text-surface-950">Visit completed</h2>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-surface-600">
                  The requester accepted your proof. This visit is now closed.
                </p>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-sm font-bold text-surface-950">Request details</h2>
            <dl className="mt-4 space-y-3 text-[13px]">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-surface-500">Requested by</dt>
                <dd className="text-right font-semibold text-surface-800">{task.createdBy.name}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-surface-500">Property pin</dt>
                <dd className="text-right font-mono text-xs text-surface-700">
                  {task.targetLat.toFixed(6)}, {task.targetLng.toFixed(6)}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-surface-500">Proof rule</dt>
                <dd className="text-right font-medium text-surface-700">Within 100 m</dd>
              </div>
            </dl>
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary-700 hover:text-primary-800"
            >
              <MapPinIcon size={14} />
              Open directions in Google Maps
            </a>
          </Card>

          {task.evidenceImage && (
            <Card>
              <h2 className="text-sm font-bold text-surface-950">Submitted proof</h2>
              <div className="mt-3 overflow-hidden rounded-xl border border-surface-200 bg-surface-50">
                <img
                  src={`${baseUrl}${task.evidenceImage}`}
                  alt="Proof submitted for this visit"
                  className="max-h-72 w-full object-cover"
                />
              </div>
            </Card>
          )}
        </div>

        <div className="order-first lg:order-last lg:col-span-7">
          <div className="h-[240px] overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-card sm:h-[320px] lg:h-full lg:min-h-[480px]">
            <MapView
              center={[task.targetLat, task.targetLng]}
              zoom={16}
              markers={[
                {
                  position: [task.targetLat, task.targetLng],
                  label: "Property location",
                  icon: targetIcon,
                },
              ]}
              height="100%"
              className="h-full rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
