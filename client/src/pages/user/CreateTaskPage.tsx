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
      addToast("error", "Please select a location on the map");
      return;
    }

    try {
      await createTask.mutateAsync({
        title,
        description,
        latitude,
        longitude,
      });
      addToast("success", "Task created successfully!");
      navigate("/user");
    } catch (err: any) {
      addToast(
        "error",
        err.response?.data?.message || "Failed to create task"
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">
          Create Verification Task
        </h1>
        <p className="text-sm text-surface-500 mt-1">
          Set up a new location verification request for a captain
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold text-surface-900 mb-4">
            Task Details
          </h2>
          <div className="space-y-4">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Check Property Condition"
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
                placeholder="Describe what the captain should verify at this location..."
                required
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm
                  focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none
                  placeholder-surface-400 resize-none"
              />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-surface-900 mb-4">
            Target Location
          </h2>
          <LocationPicker
            onLocationSelect={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }}
            height="350px"
          />
        </Card>

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/user")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={createTask.isPending}
            disabled={latitude === null || longitude === null}
          >
            Create Task
          </Button>
        </div>
      </form>
    </div>
  );
}
