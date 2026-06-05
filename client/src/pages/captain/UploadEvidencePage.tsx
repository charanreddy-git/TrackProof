import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { PageLoader } from "../../components/ui/Spinner";
import { useTaskDetail, useSubmitTask } from "../../hooks/useTasks";
import { useToast } from "../../components/ui/Toast";
import {
  CompassIcon,
  CameraIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  RefreshCwIcon,
} from "../../components/Icons";

// Haversine formula to calculate distance on client side
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
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
  const { data: task, isLoading } = useTaskDetail(id!);
  const submitTask = useSubmitTask();
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Camera
  const videoRef = useRef<HTMLVideoElement | null>(null);
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
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live GPS watch
  useEffect(() => {
    if (!navigator.geolocation) {
      setTimeout(() => {
        setLocationError("Geolocation not supported by this browser.");
      }, 0);
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
            ? "Location permission denied. Please enable in settings."
            : "Unable to get location. Move to an open area."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const activeStreamRef = useRef<MediaStream | null>(null);

  // Camera manager
  const startCamera = useCallback(async (facing: "user" | "environment" = "environment") => {
    setCameraError(null);
    try {
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach((t) => t.stop());
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
      let msg = "Failed to access camera.";
      if (errorName === "NotAllowedError") msg = "Camera permission denied. Please allow camera access in settings.";
      else if (errorName === "NotFoundError" || errorName === "DevicesNotFoundError") msg = "No camera found on this device.";
      setCameraError(msg);
      setIsCameraActive(false);
      if (!preview) setUseFallback(true);
    }
  }, [preview]);

  const stopCamera = useCallback(() => {
    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((t) => t.stop());
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

  if (isLoading || !task) return <PageLoader />;

  const distance =
    task && currentLocation
      ? calculateDistance(task.targetLat, task.targetLng, currentLocation.latitude, currentLocation.longitude)
      : null;

  const isInRange = distance !== null && distance <= 100;
  // Proximity as a capped percentage (for progress bar)
  const proximityPct = distance !== null ? Math.max(0, Math.min(100, (1 - distance / 200) * 100)) : 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
      if (currentLocation) setLockedLocation({ latitude: currentLocation.latitude, longitude: currentLocation.longitude });
    }
  };

  const toggleCameraFacing = () => {
    const next = cameraFacingMode === "user" ? "environment" : "user";
    setCameraFacingMode(next);
    startCamera(next);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    if (!currentLocation) { addToast("warning", "Waiting for GPS signal."); return; }
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      if (cameraFacingMode === "user") { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setPreview(canvas.toDataURL("image/jpeg", 0.95));
      canvas.toBlob((blob) => {
        if (blob) setFile(new File([blob], `evidence-${task.id}-${Date.now()}.jpg`, { type: "image/jpeg" }));
      }, "image/jpeg", 0.95);
      setLockedLocation({ latitude: currentLocation.latitude, longitude: currentLocation.longitude });
      stopCamera();
      addToast("info", "Photo captured!");
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
    const finalLocation = lockedLocation || (currentLocation ? { latitude: currentLocation.latitude, longitude: currentLocation.longitude } : null);
    if (!file) { addToast("error", "No photo captured."); return; }
    if (!finalLocation) { addToast("error", "GPS location required to submit."); return; }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("latitude", finalLocation.latitude.toString());
      formData.append("longitude", finalLocation.longitude.toString());
      await submitTask.mutateAsync({ id: task.id, formData });
      addToast("success", "Evidence submitted!");
      navigate(`/captain/tasks/${task.id}`);
    } catch (err) {
      const errorMsg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Submission failed.";
      addToast("error", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Back */}
      <Link
        to={`/captain/tasks/${task.id}`}
        className="inline-flex items-center gap-1.5 text-[13px] text-surface-500 hover:text-surface-800 font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Task
      </Link>

      <div>
        <h1 className="text-xl font-bold text-surface-900">Submit Evidence</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          Capture a photo at the target location to verify your presence
        </p>
      </div>

      {/* Location & Proximity Panel */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-bold text-surface-700 uppercase tracking-wider">Your Location</h3>
          {currentLocation && (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
              GPS Active
            </span>
          )}
        </div>

        {/* Location status */}
        {locationError ? (
          <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl mb-3">
            <AlertTriangleIcon size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-[12.5px] text-red-700 font-medium">{locationError}</p>
          </div>
        ) : !currentLocation ? (
          <div className="flex items-center gap-2 p-3 bg-surface-50 rounded-xl mb-3">
            <CompassIcon size={16} className="text-surface-400 animate-spin-slow flex-shrink-0" />
            <p className="text-[12.5px] text-surface-500">Acquiring GPS signal…</p>
          </div>
        ) : null}

        {/* Distance meter */}
        {distance !== null ? (
          <div className={`p-4 rounded-xl border transition-colors ${isInRange ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {isInRange ? (
                  <CheckCircleIcon size={18} className="text-emerald-600" />
                ) : (
                  <AlertTriangleIcon size={18} className="text-red-500" />
                )}
                <span className={`text-[13px] font-bold ${isInRange ? "text-emerald-700" : "text-red-700"}`}>
                  {isInRange ? "In range" : "Out of range"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-[22px] font-bold tabular-nums leading-none ${isInRange ? "text-emerald-700" : "text-red-600"}`}>
                  {Math.round(distance)}
                </span>
                <span className={`text-[12px] font-medium ${isInRange ? "text-emerald-600" : "text-red-500"}`}>m</span>
              </div>
            </div>

            {/* Progress bar — distance to target */}
            <div className="h-1.5 bg-white rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isInRange ? "bg-emerald-500" : "bg-red-400"}`}
                style={{ width: `${proximityPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-surface-400">Far</span>
              <span className="text-[10px] text-surface-400">100m radius</span>
              <span className="text-[10px] text-surface-400">At target</span>
            </div>
          </div>
        ) : currentLocation ? (
          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl">
            <CompassIcon size={16} className="text-amber-500 flex-shrink-0" />
            <p className="text-[12.5px] text-amber-700 font-medium">Calculating distance…</p>
          </div>
        ) : null}
      </Card>

      {/* Camera / Upload Panel */}
      <Card padding="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {!useFallback ? (
            <div className="space-y-4">
              {/* Tab switcher */}
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-surface-700 uppercase tracking-wider">
                  {preview ? "Photo Captured" : "Camera"}
                </h3>
                <button
                  type="button"
                  onClick={() => setUseFallback(true)}
                  className="text-[12px] text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Upload file instead
                </button>
              </div>

              {preview ? (
                /* Captured photo preview */
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                  <img src={preview} alt="Captured" className="h-full object-contain" />

                  {/* Captured badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10.5px] font-semibold text-white">Photo locked</span>
                  </div>

                  {/* GPS overlay */}
                  {lockedLocation && (
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/10">
                      <p className="text-[10px] font-mono text-white/80">
                        {lockedLocation.latitude.toFixed(5)}, {lockedLocation.longitude.toFixed(5)}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Live viewfinder */
                <div className="relative rounded-xl overflow-hidden bg-surface-950 aspect-video flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className={`w-full h-full object-cover ${cameraFacingMode === "user" ? "scale-x-[-1]" : ""}`}
                  />

                  {/* Minimal HUD overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* LIVE indicator */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping absolute" />
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 relative" />
                      <span className="text-[10.5px] font-bold text-white tracking-wider">LIVE</span>
                    </div>

                    {/* Camera switch button */}
                    {isCameraActive && (
                      <button
                        type="button"
                        onClick={toggleCameraFacing}
                        className="absolute top-3 right-3 pointer-events-auto bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white border border-white/10 p-2 rounded-full transition-all active:scale-90 cursor-pointer"
                        title="Switch camera"
                      >
                        <RefreshCwIcon size={15} />
                      </button>
                    )}

                    {/* Crosshair guide */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <div className="w-8 h-px bg-white" />
                      <div className="h-8 w-px bg-white absolute" />
                    </div>
                  </div>

                  {/* Camera error overlay */}
                  {cameraError && (
                    <div className="absolute inset-0 bg-surface-900/95 flex flex-col items-center justify-center p-6 text-center">
                      <CameraIcon size={28} className="text-red-400 mb-3" />
                      <p className="text-[13px] font-semibold text-red-400 mb-1">Camera blocked</p>
                      <p className="text-[12px] text-white/60 max-w-xs mb-4">{cameraError}</p>
                      <Button type="button" size="sm" variant="secondary" onClick={() => startCamera(cameraFacingMode)}>
                        Try again
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Shutter / Retake controls */}
              <div className="flex justify-center py-1">
                {preview ? (
                  <Button type="button" variant="secondary" onClick={retakePhoto} size="sm">
                    <RefreshCwIcon size={15} />
                    Retake
                  </Button>
                ) : (
                  /* Shutter button */
                  <button
                    type="button"
                    onClick={capturePhoto}
                    disabled={!currentLocation}
                    title={currentLocation ? "Capture" : "Waiting for GPS…"}
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center
                      border-4 border-white shadow-lg transition-all cursor-pointer
                      active:scale-90 relative
                      ${currentLocation ? "bg-red-600 hover:bg-red-700" : "bg-surface-300 border-surface-200 cursor-not-allowed"}
                    `}
                  >
                    {currentLocation && (
                      <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25" />
                    )}
                    <span className="w-10 h-10 rounded-full bg-white block relative z-10" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* File upload fallback */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-surface-700 uppercase tracking-wider">
                  Upload Photo
                </h3>
                <button
                  type="button"
                  onClick={() => setUseFallback(false)}
                  className="text-[12px] text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Use live camera
                </button>
              </div>

              <label
                htmlFor="evidence-file"
                className={`
                  relative flex flex-col items-center justify-center w-full
                  border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                  ${preview ? "border-primary-200 bg-primary-50/30" : "border-surface-200 hover:border-primary-300 hover:bg-primary-50/20"}
                `}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  className="sr-only"
                  id="evidence-file"
                />
                {preview ? (
                  <div className="space-y-3 w-full">
                    <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-sm object-contain" />
                    <p className="text-[12px] text-surface-500 truncate">{file?.name}</p>
                    <Button type="button" size="sm" variant="secondary" onClick={(e) => { e.preventDefault(); retakePhoto(); }}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-surface-100 flex items-center justify-center mb-3">
                      <CameraIcon size={22} className="text-surface-400" />
                    </div>
                    <p className="text-[13px] font-medium text-surface-700">Tap to upload photo</p>
                    <p className="text-[12px] text-surface-400 mt-1">JPG or PNG · max 5 MB</p>
                  </>
                )}
              </label>
            </div>
          )}

          {/* Submit bar */}
          <div className="flex gap-3 pt-2 border-t border-surface-100">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => { stopCamera(); navigate(`/captain/tasks/${task.id}`); }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={!file || !isInRange}
              className="flex-1"
            >
              Submit Evidence
            </Button>
          </div>

          {!isInRange && file && (
            <p className="text-center text-[12px] text-red-600 font-medium">
              Move within 100m of the target to submit
            </p>
          )}
        </form>
      </Card>
    </div>
  );
}
