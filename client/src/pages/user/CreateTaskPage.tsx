import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  LocationPicker,
  useToast,
  CheckIcon,
  MapPinIcon,
  CompassIcon,
  ShieldCheckIcon,
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

function StepCard({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-surface-200 bg-white p-4 shadow-card sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-800 text-[12px] font-extrabold text-white">
          {number}
        </span>
        <div className="min-w-0">
          <h2 className="text-[1.25rem] font-extrabold leading-tight tracking-[-0.025em] text-surface-950 sm:text-[1.4rem]">
            {title}
          </h2>
          <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-surface-600">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

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
    <div className="mx-auto max-w-3xl">
      <Button to="/user" variant="ghost" size="sm" className="-ml-2 min-h-11">
        <span aria-hidden="true">←</span>
        My visits
      </Button>

      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] font-bold text-primary-700">
            Takes about 2 minutes
          </p>
          <h1 className="mt-1.5 text-[2.2rem] font-extrabold leading-[1.02] tracking-[-0.04em] text-surface-950 sm:text-[2.7rem]">
            Book a property visit
          </h1>
          <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-surface-600">
            Set the exact pin and tell us what to check. A local inspector takes
            it from there.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-surface-700 shadow-sm sm:self-auto">
          <ShieldCheckIcon size={13} className="text-primary-600" />
          From ₹999 · pay per visit
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <StepCard
          number="1"
          title="Where is the property?"
          description="The inspector travels to this exact pin — not the neighbourhood. A Google Maps link is the easiest way to get it right."
        >
          <div className="space-y-4">
            <div className="rounded-2xl bg-surface-50 p-3.5">
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
              <div className="mt-3 flex flex-wrap items-center gap-2.5">
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
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-2.5 py-1 text-[10.5px] font-bold text-primary-800">
                    <CheckIcon size={11} />
                    Location set
                  </span>
                )}
              </div>
              {urlError && (
                <p className="mt-2 text-[12px] font-medium leading-relaxed text-danger-700">
                  {urlError}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-surface-200" />
              <span className="text-[10.5px] font-semibold text-surface-400">
                or
              </span>
              <span className="h-px flex-1 bg-surface-200" />
            </div>

            <div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-[12px] font-bold text-surface-700">
                  Tap the exact spot on the map
                </p>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-primary-50 px-3 text-[11.5px] font-bold text-primary-800 transition-colors hover:bg-primary-100 disabled:opacity-50"
                >
                  <CompassIcon size={13} />
                  {isLocating ? "Finding you…" : "Use my location"}
                </button>
              </div>
              <div className="overflow-hidden rounded-2xl border border-surface-200">
                <LocationPicker
                  latitude={latitude}
                  longitude={longitude}
                  onLocationSelect={(lat, lng) => {
                    setLatitude(lat);
                    setLongitude(lng);
                  }}
                  height="280px"
                />
              </div>

              {locationSelected ? (
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-primary-50 px-3.5 py-2.5">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary-800">
                    <MapPinIcon size={12} />
                    Pin set
                  </span>
                  <span className="text-[10.5px] font-semibold tabular-nums text-primary-700">
                    {latitude.toFixed(4)}, {longitude.toFixed(4)}
                  </span>
                </div>
              ) : (
                <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-surface-500">
                  <MapPinIcon size={12} />
                  No pin set yet — use a link or tap the map.
                </p>
              )}
            </div>
          </div>
        </StepCard>

        <StepCard
          number="2"
          title="What should the inspector check?"
          description="Be specific. The inspector follows these notes on site, so write them like you’re briefing someone at the gate."
        >
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <label
                htmlFor="task-instructions"
                className="text-[12.5px] font-bold text-surface-700"
              >
                Notes for the inspector
              </label>
              <span
                className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  instructionLength >= 10
                    ? "bg-primary-50 text-primary-700"
                    : "bg-surface-100 text-surface-500"
                }`}
              >
                {instructionLength >= 10
                  ? "Looks good"
                  : `${10 - instructionLength} more characters`}
              </span>
            </div>
            <textarea
              id="task-instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="For example: Check the boundary wall, photograph the main gate, and confirm the road is approachable by car."
              required
              rows={6}
              className="w-full resize-none rounded-2xl border-2 border-surface-200 bg-surface-50 px-4 py-3 text-base leading-relaxed text-surface-900 transition-colors placeholder:text-surface-400 hover:border-surface-300 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 sm:text-[14px]"
            />

            <div>
              <p className="text-[11px] font-bold text-surface-500">
                Quick add
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((suggestion) => {
                  const selected = instructions.includes(suggestion);
                  return (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => toggleSuggestion(suggestion)}
                      aria-pressed={selected}
                      className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3 text-[11.5px] font-semibold transition-colors ${
                        selected
                          ? "border-primary-300 bg-primary-50 text-primary-800"
                          : "border-surface-200 bg-white text-surface-600 hover:border-primary-300 hover:bg-primary-50/40"
                      }`}
                    >
                      {selected ? (
                        <CheckIcon size={11} />
                      ) : (
                        <span aria-hidden="true" className="text-[13px] leading-none">+</span>
                      )}
                      {suggestion}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="rounded-xl bg-surface-50 px-3.5 py-2.5 text-[11px] leading-relaxed text-surface-500">
              Please don’t include private information like bank details. The
              inspector only checks what is visible or safe to access.
            </p>
          </div>
        </StepCard>

        <div className="flex items-start gap-2.5 rounded-2xl border border-primary-200 bg-primary-50 p-3.5">
          <ShieldCheckIcon size={16} className="mt-0.5 flex-shrink-0 text-primary-700" />
          <p className="text-[11.5px] leading-relaxed text-primary-900/80">
            <strong className="font-bold text-primary-900">
              Proof within 100 metres.
            </strong>{" "}
            The photo must be taken within 100 m of this pin. The server checks
            the distance, and saves the location and capture time with the photo.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 rounded-2xl border border-surface-200 bg-white p-3.5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] font-medium leading-relaxed text-surface-500">
            Free to request · payment is confirmed before the visit
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/user")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              isLoading={createTask.isPending}
              disabled={!locationSelected || instructionLength < 10}
            >
              Request visit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
