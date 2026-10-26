import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Input,
  LocationPicker,
  useToast,
  CheckIcon,
  MapPinIcon,
  CompassIcon,
} from "../../components";
import { useCreateTask } from "../../hooks";
import { api } from "../../services";

const parseLocalCoordinates = (url: string) => {
  const patterns = [
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,
    /[?&](q|ll|cbll)=(-?\d+\.\d+),(-?\d+\.\d+)/,
    /\/place\/(-?\d+\.\d+),(-?\d+\.\d+)/,
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const latIndex = pattern.source.includes("(q|ll|cbll)") ? 2 : 1;
      return {
        latitude: parseFloat(match[latIndex]),
        longitude: parseFloat(match[latIndex + 1]),
      };
    }
  }

  return null;
};

const SUGGESTIONS = [
  "Check the boundary wall",
  "Show construction progress",
  "Confirm possession",
  "Check road access",
  "Check water and electricity",
  "Photograph the surroundings",
];

export function CreateTaskPage() {
  const [instructions, setInstructions] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [mapsUrl, setMapsUrl] = useState("");
  const [isResolvingUrl, setIsResolvingUrl] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const createTask = useCreateTask();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const locationSelected = latitude !== null && longitude !== null;
  const instructionLength = instructions.trim().length;

  const handleResolveUrl = async () => {
    setUrlError(null);
    const trimmed = mapsUrl.trim();
    if (!trimmed) return;

    const localCoords = parseLocalCoordinates(trimmed);
    if (localCoords) {
      setLatitude(localCoords.latitude);
      setLongitude(localCoords.longitude);
      addToast("success", "Location set from the link");
      return;
    }

    setIsResolvingUrl(true);
    try {
      const response = await api.post<{
        success: boolean;
        data: { latitude: number; longitude: number };
      }>("/tasks/resolve-url", { url: trimmed });
      const { latitude: resolvedLat, longitude: resolvedLng } = response.data.data;
      setLatitude(resolvedLat);
      setLongitude(resolvedLng);
      addToast("success", "Location set from the link");
    } catch (err) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "Could not read that link. Open Google Maps, share the property, and copy the link again.";
      setUrlError(errorMsg);
    } finally {
      setIsResolvingUrl(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      addToast("error", "Your browser cannot access location.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setIsLocating(false);
        addToast("success", "Using your current location");
      },
      () => {
        setIsLocating(false);
        addToast("error", "Could not get your location. Please allow location access.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const toggleSuggestion = (suggestion: string) => {
    setInstructions((previous) => {
      if (previous.includes(suggestion)) {
        return previous
          .split("\n")
          .filter((line) => !line.includes(suggestion))
          .join("\n")
          .trim();
      }

      return previous.trim() ? `${previous.trim()}\n• ${suggestion}` : `• ${suggestion}`;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (instructionLength < 10) {
      addToast("error", "Please write at least 10 characters so the inspector knows what to check.");
      return;
    }

    if (latitude === null || longitude === null) {
      addToast("error", "Please set the property location first.");
      return;
    }

    const trimmedInstructions = instructions.trim();
    const firstLine = trimmedInstructions.split("\n")[0].replace(/^•\s*/, "");
    const title =
      firstLine.length > 60 ? `${firstLine.slice(0, 60).trim()}…` : firstLine;

    try {
      const task = await createTask.mutateAsync({
        title,
        description: trimmedInstructions,
        latitude,
        longitude,
      });
      addToast("success", "Visit requested — we'll update you when an inspector accepts.");
      navigate(`/user/tasks/${task.id}`);
    } catch (err) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "Could not create the request. Please try again.";
      addToast("error", errorMsg);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <Button to="/user" variant="ghost" size="sm" className="-ml-2 min-h-11">
          <span aria-hidden="true">←</span>
          My requests
        </Button>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-surface-950">
          Request a property visit
        </h1>
        <p className="mt-1 text-sm text-surface-500">
          Set the exact location and tell the inspector what you need checked.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Location */}
        <Card>
          <div className="flex items-start gap-3">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-800">
              1
            </span>
            <div>
              <h2 className="text-base font-bold text-surface-950">Where is the property?</h2>
              <p className="mt-0.5 text-[13px] leading-relaxed text-surface-500">
                The inspector travels to this exact pin. A Google Maps link is the
                most accurate way to set it.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-surface-200 bg-surface-50 p-4">
              <Input
                label="Google Maps link"
                value={mapsUrl}
                onChange={(e) => {
                  setMapsUrl(e.target.value);
                  setUrlError(null);
                }}
                placeholder="Paste the property link here"
                id="maps-url-input"
                helperText="In Google Maps: search the property → Share → Copy link."
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  onClick={handleResolveUrl}
                  isLoading={isResolvingUrl}
                  disabled={!mapsUrl.trim()}
                  size="sm"
                  className="min-h-11"
                >
                  Find this location
                </Button>
                {locationSelected && (
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary-700">
                    <CheckIcon size={14} />
                    Location set
                  </span>
                )}
              </div>
              {urlError && (
                <p className="mt-2 text-[13px] font-medium text-danger-600">{urlError}</p>
              )}
            </div>

            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-surface-800">
                  Or tap the exact spot on the map
                </p>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="inline-flex min-h-11 items-center gap-1.5 px-1 text-[13px] font-semibold text-primary-700 transition-colors hover:text-primary-800 disabled:opacity-50"
                >
                  <CompassIcon size={14} />
                  {isLocating ? "Finding you…" : "Use my location"}
                </button>
              </div>
              <div className="overflow-hidden rounded-xl border border-surface-200">
                <LocationPicker
                  latitude={latitude}
                  longitude={longitude}
                  onLocationSelect={(lat, lng) => {
                    setLatitude(lat);
                    setLongitude(lng);
                  }}
                  height="260px"
                />
              </div>

              {locationSelected ? (
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-primary-50 px-3.5 py-2.5 text-[13px]">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-primary-800">
                    <MapPinIcon size={14} />
                    Location set
                  </span>
                  <span className="font-mono text-xs text-primary-700">
                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </span>
                </div>
              ) : (
                <p className="mt-2.5 flex items-center gap-1.5 text-[13px] text-surface-500">
                  <MapPinIcon size={14} className="text-surface-500" />
                  No location set yet. Use a link or tap the map.
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card>
          <div className="flex items-start gap-3">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-800">
              2
            </span>
            <div>
              <h2 className="text-base font-bold text-surface-950">What should we check?</h2>
              <p className="mt-0.5 text-[13px] leading-relaxed text-surface-500">
                Be specific. The inspector will follow these instructions on site.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <label htmlFor="task-instructions" className="text-sm font-semibold text-surface-800">
                Instructions for the inspector
              </label>
              <span
                className={`whitespace-nowrap text-[12px] font-medium tabular-nums ${
                  instructionLength >= 10 ? "text-primary-700" : "text-surface-500"
                }`}
              >
                {instructionLength >= 10 ? "Ready" : `${10 - instructionLength} more characters`}
              </span>
            </div>
            <textarea
              id="task-instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="For example: Check the boundary wall, take a photo of the main gate, and confirm the road is approachable by car."
              required
              rows={5}
              className="w-full resize-none rounded-xl border border-surface-200 bg-white px-3.5 py-3 text-base text-surface-900 placeholder:text-surface-500 transition-colors focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 sm:text-[15px]"
            />

            <div>
              <p className="text-[12px] font-medium text-surface-500">Quick add</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion) => {
                  const selected = instructions.includes(suggestion);
                  return (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => toggleSuggestion(suggestion)}
                      aria-pressed={selected}
                      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium transition-colors ${
                        selected
                          ? "border-primary-300 bg-primary-50 text-primary-800"
                          : "border-surface-200 bg-white text-surface-600 hover:border-surface-300 hover:bg-surface-50"
                      }`}
                    >
                      {selected ? <CheckIcon size={12} /> : <span aria-hidden="true">+</span>}
                      {suggestion}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-[12px] leading-relaxed text-surface-500">
              Do not include private information such as bank details. The
              inspector will only check what is visible or safe to access.
            </p>
          </div>
        </Card>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            className="sm:w-auto"
            onClick={() => navigate("/user")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={createTask.isPending}
            disabled={!locationSelected || instructionLength < 10}
            className="sm:w-auto"
          >
            Request visit
          </Button>
        </div>
      </form>
    </div>
  );
}
