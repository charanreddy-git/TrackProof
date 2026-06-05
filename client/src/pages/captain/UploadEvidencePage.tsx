import { useState, useRef, useEffect, type FormEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { PageLoader } from "../../components/ui/Spinner";
import { useTaskDetail, useSubmitTask } from "../../hooks/useTasks";
import { useToast } from "../../components/ui/Toast";
import {
  CompassIcon,
  CameraIcon,
  ClockIcon,
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
  const R = 6371e3; // Earth's mean radius in meters
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

  // Media states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<"user" | "environment">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // File and preview states
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Geolocation tracking states
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

  // 1. Live Geolocation Watcher
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
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
        console.error("GPS Watch Error:", err);
        setLocationError(
          err.code === 1
            ? "Location permission denied. Please enable location access."
            : err.message || "Failed to acquire location."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // 2. Camera Initializer / Stream manager
  const startCamera = async (facing: "user" | "environment" = "environment") => {
    setCameraError(null);
    try {
      // Clear previous stream if any
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Camera capture access error:", err);
      let errorFriendly = "Failed to access camera.";
      if (err.name === "NotAllowedError") {
        errorFriendly = "Camera permission denied. Please allow camera access in your settings.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        errorFriendly = "No camera hardware detected on this device.";
      }
      setCameraError(errorFriendly);
      setIsCameraActive(false);
      // Auto-fallback if camera fails and we have no preview
      if (!preview) {
        setUseFallback(true);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  // Auto-start camera when on camera tab and no photo taken yet
  useEffect(() => {
    if (!useFallback && !preview && task) {
      startCamera(cameraFacingMode);
    }
    return () => {
      stopCamera();
    };
  }, [useFallback, preview, cameraFacingMode, task]);

  if (isLoading || !task) return <PageLoader />;

  // Calculate distance in meters
  const distance =
    task && currentLocation
      ? calculateDistance(
          task.targetLat,
          task.targetLng,
          currentLocation.latitude,
          currentLocation.longitude
        )
      : null;

  const isInRange = distance !== null && distance <= 100;

  // Handle manual file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);

      // Lock current location if available, otherwise we will get it during submit
      if (currentLocation) {
        setLockedLocation({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        });
      }
    }
  };

  // Switch between User (Front) and Environment (Back) camera
  const toggleCameraFacing = () => {
    const nextFacing = cameraFacingMode === "user" ? "environment" : "user";
    setCameraFacingMode(nextFacing);
    startCamera(nextFacing);
  };

  // Capture image frame from the video feed
  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    // Warn if out of range, but allow capturing (submit button will enforce or alert)
    if (!currentLocation) {
      addToast("warning", "Waiting for GPS signal before capture.");
      return;
    }

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Mirror canvas drawing if using front camera
      if (cameraFacingMode === "user") {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      setPreview(dataUrl);

      // Convert canvas to Blob then File
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const capturedFile = new File([blob], `evidence-${task.id}-${Date.now()}.jpg`, {
              type: "image/jpeg",
            });
            setFile(capturedFile);
          }
        },
        "image/jpeg",
        0.95
      );

      // Lock current GPS coordinates
      setLockedLocation({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });

      // Turn off camera stream
      stopCamera();
      addToast("info", "Photo captured and location locked!");
    }
  };

  // Reset captured state and restart camera
  const retakePhoto = () => {
    setPreview(null);
    setFile(null);
    setLockedLocation(null);
    if (!useFallback) {
      startCamera(cameraFacingMode);
    }
  };

  // Handle final submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const finalLocation = lockedLocation || (currentLocation ? {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    } : null);

    if (!file) {
      addToast("error", "No photo evidence available.");
      return;
    }

    if (!finalLocation) {
      addToast("error", "GPS location is required to submit verification.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("latitude", finalLocation.latitude.toString());
      formData.append("longitude", finalLocation.longitude.toString());

      await submitTask.mutateAsync({ id: task.id, formData });
      addToast("success", "Evidence submitted successfully!");
      navigate(`/captain/tasks/${task.id}`);
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to submit evidence.";
      addToast("error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to={`/captain/tasks/${task.id}`}
        className="inline-flex items-center gap-1 text-sm text-surface-500 hover:text-surface-700"
      >
        ← Back to Task
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-surface-900">
          Submit Task Verification
        </h1>
        <p className="text-sm text-surface-500 mt-1">
          Verify your physical presence at the location by taking a real-time photo.
        </p>
      </div>

      {/* Real-time GPS Proximity Alert Panel */}
      <Card className="overflow-hidden border border-surface-200">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-surface-800 uppercase tracking-wider">
            GPS Telemetry & Proximity
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-surface-50 rounded-xl border border-surface-200">
              <span className="block text-xs text-surface-400 font-medium">Target Coordinates</span>
              <span className="font-mono text-sm text-surface-700">
                {task.targetLat.toFixed(6)}, {task.targetLng.toFixed(6)}
              </span>
            </div>

            <div className="p-3 bg-surface-50 rounded-xl border border-surface-200">
              <span className="block text-xs text-surface-400 font-medium">Current Location</span>
              {locationError ? (
                <span className="text-xs text-danger-500 font-medium line-clamp-2 flex items-center gap-1">
                  <AlertTriangleIcon size={12} /> {locationError}
                </span>
              ) : currentLocation ? (
                <span className="font-mono text-sm text-surface-700 block">
                  {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                  {currentLocation.accuracy && (
                    <span className="text-[10px] text-surface-400 block">±{Math.round(currentLocation.accuracy)}m accuracy</span>
                  )}
                </span>
              ) : (
                <span className="text-xs text-surface-400 animate-pulse flex items-center gap-1.5">
                  <CompassIcon size={12} className="animate-spin-slow" /> Acquiring GPS signal...
                </span>
              )}
            </div>
          </div>

          {/* Proximity Badge */}
          {distance !== null ? (
            <div
              className={`
                p-4 rounded-xl flex items-center justify-between transition-all duration-300
                ${
                  isInRange
                    ? "bg-success-500/10 border border-success-500/30 text-success-700"
                    : "bg-danger-500/10 border border-danger-500/30 text-danger-700"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {isInRange ? (
                    <CheckCircleIcon size={20} className="text-success-500" />
                  ) : (
                    <AlertTriangleIcon size={20} className="text-danger-500" />
                  )}
                </span>
                <div>
                  <span className="font-bold block text-sm">
                    {isInRange ? "In Proximity Range" : "Out of Proximity Range"}
                  </span>
                  <span className="text-xs opacity-90 block">
                    You are approximately <strong>{Math.round(distance)} meters</strong> away. (Required: &lt;= 100m)
                  </span>
                </div>
              </div>
              <div className="relative flex h-3 w-3">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isInRange ? "bg-success-500" : "bg-danger-500"
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    isInRange ? "bg-success-500" : "bg-danger-500"
                  }`}
                ></span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 flex items-center gap-3">
              <ClockIcon size={20} className="animate-spin text-amber-600" />
              <div>
                <span className="font-bold text-sm block">Calculating GPS Distance</span>
                <span className="text-xs opacity-90 block">
                  Please enable location services and stand clear of obstructions.
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Main Camera Viewfinder or Fallback Upload */}
      <Card className="relative overflow-hidden border border-surface-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {!useFallback ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-surface-800">
                  Evidence Capture
                </label>
                <button
                  type="button"
                  onClick={() => setUseFallback(true)}
                  className="text-xs text-primary-500 hover:text-primary-600 font-medium underline"
                >
                  Switch to Upload File
                </button>
              </div>

              {preview ? (
                /* Frozen Capture Preview Mode */
                <div className="relative rounded-2xl overflow-hidden border border-surface-200 bg-black aspect-video max-h-80 flex items-center justify-center shadow-inner">
                  <img
                    src={preview}
                    alt="Captured Evidence Preview"
                    className="h-full object-contain"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-mono text-white flex items-center gap-1.5 border border-white/15">
                    <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse"></span>
                    PHOTO CAPTURED & LOCKED
                  </div>
                  {lockedLocation && (
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg text-[10px] font-mono text-white/90 border border-white/10">
                      <div>LAT: {lockedLocation.latitude.toFixed(6)}</div>
                      <div>LNG: {lockedLocation.longitude.toFixed(6)}</div>
                    </div>
                  )}
                </div>
              ) : (
                /* Active Viewfinder Mode */
                <div className="relative rounded-2xl overflow-hidden border border-surface-800 bg-black aspect-video max-h-80 flex items-center justify-center shadow-lg group">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className={`w-full h-full object-cover ${cameraFacingMode === "user" ? "scale-x-[-1]" : ""}`}
                  />
                  
                  {/* Camera overlay HUD details */}
                  <div className="absolute inset-0 pointer-events-none border border-white/10 flex flex-col justify-between p-3.5">
                    {/* HUD Top bar */}
                    <div className="flex justify-between items-center w-full">
                      <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-white/90 flex items-center gap-1.5 border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-danger-500 animate-ping"></span>
                        <span className="font-semibold uppercase tracking-wider">LIVE FEED</span>
                      </div>
                      <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[9px] font-mono text-white/70 border border-white/10">
                        FPS: 30 | facing: {cameraFacingMode}
                      </div>
                    </div>

                    {/* Target grid crosshair guide in center */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-25">
                      <div className="w-10 h-0.5 bg-white"></div>
                      <div className="h-10 w-0.5 bg-white absolute"></div>
                      <div className="w-24 h-24 border border-dashed border-white rounded-full"></div>
                    </div>

                    {/* HUD Bottom bar */}
                    <div className="flex justify-between items-end w-full">
                      <div className="bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-md text-[9px] font-mono text-white/80 border border-white/10 flex flex-col">
                        <span>SYS: INSTANTLOCATE v1.0</span>
                        <span>AZIMUTH: N/A</span>
                      </div>
                    </div>
                  </div>

                  {/* Switch Camera Button Overlay */}
                  {isCameraActive && (
                    <button
                      type="button"
                      onClick={toggleCameraFacing}
                      className="absolute top-3.5 right-3.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/10 p-2.5 rounded-full transition-all active:scale-95 shadow-md flex items-center justify-center cursor-pointer pointer-events-auto"
                      title="Switch Camera"
                    >
                      <RefreshCwIcon size={16} />
                    </button>
                  )}

                  {/* Overlay for Camera Errors */}
                  {cameraError && (
                    <div className="absolute inset-0 bg-surface-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
                      <CameraIcon size={32} className="text-danger-500 mb-3" />
                      <p className="text-sm font-semibold mb-2 text-danger-500">Camera Access Blocked</p>
                      <p className="text-xs text-white/70 max-w-sm mb-4">
                        {cameraError}
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => startCamera(cameraFacingMode)}
                        variant="secondary"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons for Viewfinder */}
              <div className="flex justify-center py-2">
                {preview ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={retakePhoto}
                    className="flex items-center gap-1.5"
                  >
                    🔄 Retake Photo
                  </Button>
                ) : (
                  <button
                    type="button"
                    onClick={capturePhoto}
                    disabled={!currentLocation}
                    className={`
                      relative rounded-full w-14 h-14 border-4 border-white shadow-lg flex items-center justify-center transition-all cursor-pointer active:scale-90
                      ${currentLocation ? "bg-red-600 hover:bg-red-700" : "bg-surface-300 border-surface-200 cursor-not-allowed"}
                    `}
                    title={currentLocation ? "Capture photo" : "Acquiring GPS signal..."}
                  >
                    <span className="block w-6 h-6 rounded-full bg-white opacity-20 animate-ping absolute"></span>
                    <span className="block w-9 h-9 rounded-full bg-white"></span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Fallback Classic File Uploader */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-surface-800">
                  Upload Evidence File
                </label>
                <button
                  type="button"
                  onClick={() => setUseFallback(false)}
                  className="text-xs text-primary-500 hover:text-primary-600 font-medium underline"
                >
                  Switch to Live Camera
                </button>
              </div>

              <div
                className={`
                  relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
                  ${preview ? "border-primary-300 bg-primary-50/50" : "border-surface-200 hover:border-surface-300"}
                `}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="evidence-file"
                />
                {preview ? (
                  <div className="space-y-3">
                    <img
                      src={preview}
                      alt="Uploaded Preview"
                      className="max-h-64 mx-auto rounded-lg shadow-sm"
                    />
                    <p className="text-xs text-surface-500">{file?.name}</p>
                    <Button type="button" size="sm" variant="secondary" onClick={retakePhoto}>
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl mb-3">📁</div>
                    <p className="text-sm text-surface-600 font-medium">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-surface-400 mt-1">
                      JPG, JPEG, PNG up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submission button bar */}
          <div className="flex gap-3 justify-end border-t border-surface-100 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                stopCamera();
                navigate(`/captain/tasks/${task.id}`);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={!file || !isInRange}
            >
              Submit Evidence
            </Button>
          </div>
        </form>
      </Card>

      <div className="text-center text-xs text-surface-400">
        💡 <em>Testing note: Proximity validation requires being within 100 meters of the coordinates ({task.targetLat.toFixed(4)}, {task.targetLng.toFixed(4)}).</em>
      </div>
    </div>
  );
}

