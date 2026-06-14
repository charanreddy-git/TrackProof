import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { LocationPicker } from "../../components/LocationPicker";
import { useCreateTask } from "../../hooks/useTasks";
import { useToast } from "../../components/ui/Toast";
import api from "../../services/api";

const parseLocalCoordinates = (url: string) => {
  // Regex 1: Matches /@12.9716,77.5946
  const regex1 = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match1 = url.match(regex1);
  if (match1) return { latitude: parseFloat(match1[1]), longitude: parseFloat(match1[2]) };

  // Regex 2: Matches ?q=12.9716,77.5946 or ll=12.9716,77.5946
  const regex2 = /[?&](q|ll|cbll)=(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match2 = url.match(regex2);
  if (match2) return { latitude: parseFloat(match2[2]), longitude: parseFloat(match2[3]) };

  // Regex 3: Matches /place/12.9716,77.5946
  const regex3 = /\/place\/(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match3 = url.match(regex3);
  if (match3) return { latitude: parseFloat(match3[1]), longitude: parseFloat(match3[2]) };

  // Regex 4: Matches !3d12.9715987!4d77.5945627
  const regex4 = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/;
  const match4 = url.match(regex4);
  if (match4) return { latitude: parseFloat(match4[1]), longitude: parseFloat(match4[2]) };

  return null;
};

export function CreateTaskPage() {
  const [instructions, setInstructions] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [mapsUrl, setMapsUrl] = useState("");
  const [isResolvingUrl, setIsResolvingUrl] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const createTask = useCreateTask();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleResolveUrl = async () => {
    setUrlError(null);
    const trimmed = mapsUrl.trim();
    if (!trimmed) return;

    setIsResolvingUrl(true);
    try {
      // Try local parsing first (faster, saves server call for long links)
      const localCoords = parseLocalCoordinates(trimmed);
      if (localCoords) {
        setLatitude(localCoords.latitude);
        setLongitude(localCoords.longitude);
        addToast("success", "Location coordinates resolved successfully!");
        setIsResolvingUrl(false);
        return;
      }

      // Fallback to backend redirect follower for shortened links
      const response = await api.post("/tasks/resolve-url", { url: trimmed });
      const { latitude: resolvedLat, longitude: resolvedLng } = response.data.data;
      setLatitude(resolvedLat);
      setLongitude(resolvedLng);
      addToast("success", "Location coordinates resolved successfully!");
    } catch (err) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "Failed to resolve Google Maps link. Please verify it's a valid URL.";
      setUrlError(errorMsg);
      addToast("error", errorMsg);
    } finally {
      setIsResolvingUrl(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (instructions.trim().length < 10) {
      addToast("error", "Please write at least 10 characters of instructions.");
      return;
    }

    if (latitude === null || longitude === null) {
      addToast("error", "Please pin or resolve a location first");
      return;
    }

    const trimmedInst = instructions.trim();
    const title = trimmedInst.length > 40 ? trimmedInst.slice(0, 40) + "..." : trimmedInst;
    const description = trimmedInst;

    try {
      await createTask.mutateAsync({ title, description, latitude, longitude });
      addToast("success", "Task created — captains will be notified!");
      navigate("/user");
    } catch (err) {
      const errorMsg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to create task";
      addToast("error", errorMsg);
    }
  };

  const locationSelected = latitude !== null && longitude !== null;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-surface-900 tracking-tight">New Verification Task</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          Set a location — a captain will travel there and submit photo evidence
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Task Details */}
        <Card padding="md">
          <h2 className="text-[11px] font-bold text-surface-400 uppercase tracking-wider mb-4">
            Verification Instructions
          </h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="task-instructions"
                  className="block text-sm font-medium text-surface-700"
                >
                  What should the inspector verify at this location?
                </label>
                <span className={`text-[11px] font-semibold tabular-nums ${
                  instructions.length >= 10 ? "text-emerald-600" : "text-surface-400"
                }`}>
                  {instructions.length} / 10 min
                </span>
              </div>
              <textarea
                id="task-instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g., Visit the site, check if the foundation has been laid, and take a photo of the main entrance."
                required
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-surface-200 text-base sm:text-sm
                  focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none
                  placeholder-surface-400 resize-none transition-all duration-200 bg-white"
              />
              <p className="text-[10px] text-surface-400">
                Describe what evidence you need captured — be specific.
              </p>
            </div>
          </div>
        </Card>

        {/* Location Selector */}
        <Card padding="md">
          <h2 className="text-[11px] font-bold text-surface-400 uppercase tracking-wider mb-4">
            Task Location
          </h2>

          <div className="space-y-4">
            {/* Direct Google Maps Link Input */}
            <div className="space-y-3 p-3 bg-surface-50 border border-surface-200 rounded-lg">
              <div className="space-y-2">
                <Input
                  label="Search Location by Google Maps Link (Optional)"
                  value={mapsUrl}
                  onChange={(e) => {
                    setMapsUrl(e.target.value);
                    setUrlError(null);
                  }}
                  placeholder="Paste maps link here to auto-resolve coordinates..."
                  id="maps-url-input"
                />
                <Button
                  type="button"
                  onClick={handleResolveUrl}
                  isLoading={isResolvingUrl}
                  disabled={!mapsUrl.trim()}
                  className="w-full sm:w-auto"
                >
                  Resolve Location
                </Button>
              </div>
              {urlError ? (
                <p className="text-[11.5px] text-red-600 font-semibold">{urlError}</p>
              ) : (
                <p className="text-[10px] text-surface-400">
                  Or simply click directly on the map below to drop a pin.
                </p>
              )}
            </div>

            {/* Map display */}
            <div className="space-y-3">
              <div className="rounded-lg overflow-hidden border border-surface-200">
                <LocationPicker
                  latitude={latitude}
                  longitude={longitude}
                  onLocationSelect={(lat, lng) => {
                    setLatitude(lat);
                    setLongitude(lng);
                  }}
                  height="240px"
                />
              </div>

              {locationSelected ? (
                <div className="flex items-center justify-between px-2 text-xs">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Location verified
                  </span>
                  <span className="font-mono text-surface-500">
                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-center text-surface-400 py-1 font-medium">
                  No location pinned yet
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => navigate("/user")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={createTask.isPending}
            disabled={!locationSelected || instructions.trim().length < 10}
            className="flex-1"
          >
            Create Task
          </Button>
        </div>
      </form>
    </div>
  );
}
