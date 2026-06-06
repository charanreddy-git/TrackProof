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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationMethod, setLocationMethod] = useState<"link" | "map">("link");
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

    if (latitude === null || longitude === null) {
      addToast("error", "Please pin or resolve a location first");
      return;
    }

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
            Task Details
          </h2>
          <div className="space-y-4">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Verify shop is open"
              required
              id="task-title"
            />

            <div className="space-y-1.5">
              <label
                htmlFor="task-description"
                className="block text-sm font-medium text-surface-700"
              >
                Description
              </label>
              <textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What should the captain verify at this location?"
                required
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-surface-200 text-sm
                  focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none
                  placeholder-surface-400 resize-none transition-all duration-200 bg-white"
              />
            </div>
          </div>
        </Card>

        {/* Location Selector */}
        <Card padding="md">
          <h2 className="text-[11px] font-bold text-surface-400 uppercase tracking-wider mb-4">
            Task Location
          </h2>

          <div className="space-y-4">
            {/* Toggle selection */}
            <div className="grid grid-cols-2 p-1 bg-surface-100 rounded-lg border border-surface-200">
              <button
                type="button"
                onClick={() => {
                  setLocationMethod("link");
                  setUrlError(null);
                }}
                className={`py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  locationMethod === "link"
                    ? "bg-white text-surface-900 shadow-sm border border-surface-200/50 font-bold"
                    : "text-surface-500 hover:text-surface-800"
                }`}
              >
                Paste Google Maps Link
              </button>
              <button
                type="button"
                onClick={() => {
                  setLocationMethod("map");
                  setUrlError(null);
                }}
                className={`py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  locationMethod === "map"
                    ? "bg-white text-surface-900 shadow-sm border border-surface-200/50 font-bold"
                    : "text-surface-500 hover:text-surface-800"
                }`}
              >
                Select on Map
              </button>
            </div>

            {/* Paste Link input / instruction header */}
            {locationMethod === "link" ? (
              <div className="space-y-3 p-3 bg-surface-50 border border-surface-200 rounded-lg">
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      label="Paste Google Maps URL"
                      value={mapsUrl}
                      onChange={(e) => {
                        setMapsUrl(e.target.value);
                        setUrlError(null);
                      }}
                      placeholder="https://maps.app.goo.gl/... or https://www.google.com/maps/..."
                      id="maps-url-input"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleResolveUrl}
                    isLoading={isResolvingUrl}
                    disabled={!mapsUrl.trim()}
                    className="mb-0.5"
                  >
                    Resolve
                  </Button>
                </div>
                {urlError && (
                  <p className="text-[11.5px] text-red-600 font-semibold">{urlError}</p>
                )}
              </div>
            ) : (
              <div className="p-3 bg-surface-50 border border-surface-200 rounded-lg">
                <p className="text-xs text-surface-600 leading-relaxed">
                  Click on the map to pin the target location, or drag the red marker to adjust coordinate details.
                </p>
              </div>
            )}

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
                  height="300px"
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
            disabled={!locationSelected || !title || !description}
            className="flex-1"
          >
            Create Task
          </Button>
        </div>
      </form>
    </div>
  );
}
