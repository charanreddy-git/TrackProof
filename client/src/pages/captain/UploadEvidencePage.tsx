import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  PageLoader,
  useToast,
  CompassIcon,
  CameraIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
} from "../../components";
import { useTaskDetail, useSubmitTask } from "../../hooks";

// Haversine distance (metres) between two coordinates.
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function UploadEvidencePage() {
  const { id } = useParams<{ id: string }>();
  const { data: task, isLoading, isError } = useTaskDetail(id!);
  const submitTask = useSubmitTask();
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Camera
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<"user" | "environment">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Photo
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Location
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number | null;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [lockedLocation, setLockedLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number | null;
    capturedAt: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live GPS watch.
  useEffect(() => {
    if (!navigator.geolocation) {
      setTimeout(() => setLocationError("This browser cannot access your location."), 0);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLocationError(null);
      },
      (err) => {
        setLocationError(
          err.code === 1
            ? "Location access is blocked. Allow location for this site in your browser settings."
            : "Could not get your location. Move to an open area and try again."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Camera manager.
  const startCamera = useCallback(
    async (facing: "user" | "environment" = "environment") => {
      setCameraError(null);
      try {
        if (activeStreamRef.current) {
          activeStreamRef.current.getTracks().forEach((track) => track.stop());
          activeStreamRef.current = null;
        }
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        activeStreamRef.current = mediaStream;
        setIsCameraActive(true);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      } catch (err) {
        const errorName = err instanceof Error ? err.name : "";
        let message = "Could not open the camera.";
        if (errorName === "NotAllowedError") {
          message = "Camera access is blocked. Allow camera access for this site, or upload a photo instead.";
        } else if (errorName === "NotFoundError" || errorName === "DevicesNotFoundError") {
          message = "No camera found on this device. You can upload a photo instead.";
        }
        setCameraError(message);
        setIsCameraActive(false);
        if (!preview) setUseFallback(true);
      }
    },
    [preview]
  );

  const stopCamera = useCallback(() => {
    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((track) => track.stop());
      activeStreamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (!useFallback && !preview && task) {
      timer = setTimeout(() => {
        startCamera(cameraFacingMode);
      }, 0);
    }
    return () => {
      if (timer) clearTimeout(timer);
      stopCamera();
    };
  }, [useFallback, preview, cameraFacingMode, task, startCamera, stopCamera]);

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

  if (task.status !== "IN_PROGRESS") {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="text-xl font-bold text-surface-950">Proof is not open yet</h1>
        <p className="mt-2 text-sm text-surface-500">
          {task.status === "ACCEPTED"
            ? "Start the visit first, then submit your proof photo when you reach the property."
            : "This visit is already closed, or proof has already been submitted."}
        </p>
        <Button to={`/captain/tasks/${task.id}`} className="mt-6">
          Back to visit
        </Button>
      </div>
    );
  }

  const liveDistance = currentLocation
    ? calculateDistance(
        task.targetLat,
        task.targetLng,
        currentLocation.latitude,
        currentLocation.longitude
      )
    : null;

  const proofLocation = lockedLocation || currentLocation;
  const proofDistance = proofLocation
    ? calculateDistance(task.targetLat, task.targetLng, proofLocation.latitude, proofLocation.longitude)
    : null;

  const isInRange = proofDistance !== null && proofDistance <= 100;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(selected);
    if (currentLocation) {
      setLockedLocation({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        accuracy: currentLocation.accuracy,
        capturedAt: new Date().toISOString(),
      });
    }
  };

  const toggleCameraFacing = () => {
    const next = cameraFacingMode === "user" ? "environment" : "user";
    setCameraFacingMode(next);
    startCamera(next);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    if (!currentLocation) {
      addToast("warning", "Waiting for GPS. Move to an open area.");
      return;
    }

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const context = canvas.getContext("2d");

    if (context) {
      if (cameraFacingMode === "user") {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
      }
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setPreview(canvas.toDataURL("image/jpeg", 0.95));
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setFile(
              new File([blob], `proof-${task.id}-${Date.now()}.jpg`, { type: "image/jpeg" })
            );
          }
        },
        "image/jpeg",
        0.95
      );
      setLockedLocation({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        accuracy: currentLocation.accuracy,
        capturedAt: new Date().toISOString(),
      });
      stopCamera();
      addToast("success", "Photo captured");
    }
  };

  const retakePhoto = () => {
    setPreview(null);
    setFile(null);
    setLockedLocation(null);
    if (!useFallback) startCamera(cameraFacingMode);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const finalLocation =
      lockedLocation ||
      (currentLocation
        ? {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            accuracy: currentLocation.accuracy,
            capturedAt: new Date().toISOString(),
          }
        : null);

    if (!file) {
      addToast("error", "Take or upload a photo first.");
      return;
    }
    if (!finalLocation) {
      addToast("error", "GPS location is required to submit proof.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("latitude", finalLocation.latitude.toString());
      formData.append("longitude", finalLocation.longitude.toString());
      formData.append("capturedAt", finalLocation.capturedAt);
      if (finalLocation.accuracy !== null) {
        formData.append("accuracy", finalLocation.accuracy.toString());
      }
      await submitTask.mutateAsync({ id: task.id, formData });
      addToast("success", "Proof submitted. The requester will review it.");
      navigate(`/captain/tasks/${task.id}`);
    } catch (err) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "Could not submit the proof. Please try again.";
      addToast("error", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div>
        <Button to={`/captain/tasks/${task.id}`} variant="ghost" size="sm" className="-ml-2 min-h-11">
          <span aria-hidden="true">←</span>
          Back to visit
        </Button>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-surface-950">Submit proof</h1>
        <p className="mt-1 text-sm text-surface-500">
          Take a photo at the property. GPS must be within 100 metres of the pin.
        </p>
      </div>

      {/* GPS status */}
      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-surface-950">Your location</h2>
          {currentLocation && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary-700">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-primary-500" />
              GPS on
            </span>
          )}
        </div>

        {locationError ? (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-danger-200 bg-danger-50 p-3">
            <AlertTriangleIcon size={16} className="mt-0.5 flex-shrink-0 text-danger-600" />
            <p className="text-[13px] font-medium leading-relaxed text-danger-700">{locationError}</p>
          </div>
        ) : !currentLocation ? (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-surface-200 bg-surface-50 p-3">
            <CompassIcon size={16} className="animate-spin-slow flex-shrink-0 text-surface-500" />
            <p className="text-[13px] text-surface-500">Getting your GPS location…</p>
          </div>
        ) : null}

        {proofDistance !== null ? (
          <div
            className={`mt-3 rounded-xl border p-4 ${
              isInRange ? "border-primary-100 bg-primary-50" : "border-danger-200 bg-danger-50"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-2">
                {isInRange ? (
                  <CheckCircleIcon size={18} className="mt-0.5 flex-shrink-0 text-primary-700" />
                ) : (
                  <AlertTriangleIcon size={18} className="mt-0.5 flex-shrink-0 text-danger-600" />
                )}
                <div>
                  <p className={`text-sm font-semibold ${isInRange ? "text-primary-900" : "text-danger-700"}`}>
                    {isInRange ? "You're at the property" : "You're too far away"}
                  </p>
                  <p className={`mt-0.5 text-[12px] leading-relaxed ${isInRange ? "text-primary-800" : "text-danger-600"}`}>
                    {isInRange
                      ? "You can take and submit your proof photo."
                      : "Move closer to the pin. Proof is only accepted within 100 m."}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className={`whitespace-nowrap text-xl font-bold tabular-nums ${isInRange ? "text-primary-800" : "text-danger-700"}`}>
                  {Math.round(proofDistance)} m
                </p>
                <p className={`whitespace-nowrap text-[10px] font-medium ${isInRange ? "text-primary-600" : "text-danger-500"}`}>
                  from pin
                </p>
              </div>
            </div>

            {!lockedLocation && liveDistance !== null && liveDistance <= 100 && currentLocation?.accuracy && (
              <p className="mt-2 text-[11px] text-primary-700">
                GPS accuracy: ±{Math.round(currentLocation.accuracy)} m
              </p>
            )}
          </div>
        ) : currentLocation && proofLocation === null ? (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-warning-100 bg-warning-50 p-3">
            <CompassIcon size={16} className="flex-shrink-0 text-warning-600" />
            <p className="text-[13px] font-medium text-warning-800">Calculating distance…</p>
          </div>
        ) : null}

        <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-surface-500">
          <ShieldCheckIcon size={13} className="mt-0.5 flex-shrink-0" />
          We record the GPS location, accuracy, and time with your photo. This cannot be edited later.
        </p>
      </Card>

      {/* Camera / upload */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!useFallback ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-surface-950">
                  {preview ? "Your photo" : "Take a photo"}
                </h2>
                <button
                  type="button"
                  onClick={() => setUseFallback(true)}
                  className="inline-flex min-h-11 items-center px-1 text-[12px] font-semibold text-primary-700 hover:text-primary-800"
                >
                  Upload instead
                </button>
              </div>

              {preview ? (
                <div className="relative overflow-hidden rounded-xl border border-surface-200 bg-surface-950">
                  <div className="flex aspect-video items-center justify-center">
                    <img src={preview} alt="Captured proof" className="h-full object-contain" />
                  </div>
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-surface-950/70 px-2.5 py-1.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                    <CheckCircleIcon size={12} className="text-primary-300" />
                    Photo ready
                  </div>
                  {lockedLocation && (
                    <div className="absolute bottom-3 left-3 rounded-lg bg-surface-950/70 px-2.5 py-1.5 font-mono text-[10px] text-white/90 backdrop-blur-sm">
                      {lockedLocation.latitude.toFixed(5)}, {lockedLocation.longitude.toFixed(5)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-xl border border-surface-900 bg-surface-950">
                  <div className="flex aspect-video items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`h-full w-full object-cover ${cameraFacingMode === "user" ? "scale-x-[-1]" : ""}`}
                    />
                  </div>

                  {isCameraActive && (
                    <>
                      <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-surface-950/60 px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-white backdrop-blur-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        LIVE
                      </div>
                      <button
                        type="button"
                        onClick={toggleCameraFacing}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface-950/60 text-white backdrop-blur-sm transition-colors hover:bg-surface-950/80"
                        aria-label="Switch camera"
                      >
                        <RefreshCwIcon size={15} />
                      </button>
                    </>
                  )}

                  {cameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-950/95 p-6 text-center">
                      <CameraIcon size={26} className="mb-3 text-danger-400" />
                      <p className="text-sm font-semibold text-white">Camera unavailable</p>
                      <p className="mt-1 max-w-xs text-xs leading-relaxed text-surface-300">{cameraError}</p>
                      <div className="mt-4 flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => startCamera(cameraFacingMode)}
                        >
                          Try again
                        </Button>
                        <Button type="button" size="sm" onClick={() => setUseFallback(true)}>
                          Upload photo
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col items-center gap-2 py-1">
                {preview ? (
                  <Button type="button" variant="secondary" size="sm" className="min-h-11" onClick={retakePhoto}>
                    <RefreshCwIcon size={14} />
                    Retake photo
                  </Button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={capturePhoto}
                      disabled={!currentLocation || !!cameraError}
                      className={`flex h-16 w-16 items-center justify-center rounded-full border-4 border-white shadow-lg transition-all active:scale-95 ${
                        currentLocation && !cameraError ? "bg-danger-600 hover:bg-danger-700" : "bg-surface-300"
                      }`}
                      aria-label="Take photo"
                    >
                      <span className="block h-10 w-10 rounded-full bg-white" />
                    </button>
                    <p className="text-[11px] font-medium text-surface-500">
                      {currentLocation ? "Tap to take a photo" : "Waiting for GPS…"}
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-surface-950">Upload a photo</h2>
                <button
                  type="button"
                  onClick={() => setUseFallback(false)}
                  className="inline-flex min-h-11 items-center px-1 text-[12px] font-semibold text-primary-700 hover:text-primary-800"
                >
                  Use camera
                </button>
              </div>

              <label
                htmlFor="evidence-file"
                className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center transition-colors ${
                  preview
                    ? "border-primary-200 bg-primary-50/20"
                    : "border-surface-300 bg-surface-50/40 hover:border-primary-400 hover:bg-primary-50/20"
                }`}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  className="sr-only"
                  id="evidence-file"
                />
                {preview ? (
                  <div className="w-full space-y-3">
                    <img src={preview} alt="Selected proof" className="mx-auto max-h-48 rounded-lg object-contain" />
                    <p className="truncate text-xs text-surface-500">{file?.name}</p>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={(event) => {
                        event.preventDefault();
                        retakePhoto();
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-surface-100">
                      <CameraIcon size={20} className="text-surface-500" />
                    </div>
                    <p className="text-sm font-semibold text-surface-800">Tap to choose a photo</p>
                    <p className="mt-1 text-xs text-surface-500">JPG or PNG · max 5 MB</p>
                  </>
                )}
              </label>
            </div>
          )}

          <div className="flex flex-col gap-2 border-t border-surface-150 pt-4 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => {
                stopCamera();
                navigate(`/captain/tasks/${task.id}`);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} disabled={!file || !isInRange} className="flex-1">
              Submit proof
            </Button>
          </div>

          {file && !isInRange && (
            <p className="text-center text-[12px] font-medium text-danger-600">
              Move within 100 m of the property to submit.
            </p>
          )}
        </form>
      </Card>
    </div>
  );
}
