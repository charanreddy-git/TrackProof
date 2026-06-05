import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { LocationPicker } from "../../components/LocationPicker";
import { useCreateTask } from "../../hooks/useTasks";
import { useToast } from "../../components/ui/Toast";

export function CreateTaskPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const createTask = useCreateTask();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (latitude === null || longitude === null) {
      addToast("error", "Please pin a location on the map");
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
          <h2 className="text-[13px] font-bold text-surface-700 uppercase tracking-wider mb-4">
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
                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm
                  focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none
                  placeholder-surface-400 resize-none transition-all duration-200 bg-white"
              />
            </div>
          </div>
        </Card>

        {/* Location Picker */}
        <Card padding="sm">
          <div className="flex items-center justify-between px-2 pt-2 mb-3">
            <h2 className="text-[13px] font-bold text-surface-700 uppercase tracking-wider">
              Pin Location
            </h2>
            {locationSelected ? (
              <span className="inline-flex items-center gap-1.5 text-[11.5px] text-emerald-700 font-semibold">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Location set
              </span>
            ) : (
              <span className="text-[11.5px] text-surface-400 font-medium">Tap map to pin</span>
            )}
          </div>
          <div className="rounded-xl overflow-hidden">
            <LocationPicker
              onLocationSelect={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
              height="300px"
            />
          </div>
          {locationSelected && (
            <p className="text-[11px] font-mono text-surface-400 text-center py-2">
              {latitude!.toFixed(5)}, {longitude!.toFixed(5)}
            </p>
          )}
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
