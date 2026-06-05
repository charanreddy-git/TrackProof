import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useToast } from "../../components/ui/Toast";
import { UserIcon, CompassIcon } from "../../components/Icons";
import type { Role } from "../../types";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("USER");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register(name, email, password, role);
      addToast("success", "Account created successfully!");
      navigate(role === "CAPTAIN" ? "/captain" : "/user");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
      addToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-surface-900 mb-1">Create account</h2>
      <p className="text-sm text-surface-500 mb-6">
        Join InstantLocate as a user or captain
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
          id="register-name"
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
          id="register-email"
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="new-password"
          helperText="Must be at least 6 characters"
          id="register-password"
        />

        {/* Role selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-surface-700">
            I want to join as
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("USER")}
              className={`p-4 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                role === "USER"
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-surface-200 hover:border-surface-300 text-surface-600"
              }`}
            >
              <UserIcon size={24} className="mb-1.5" />
              <div className="text-sm font-medium">User</div>
              <div className="text-[10px] mt-0.5 opacity-70">Create tasks</div>
            </button>
            <button
              type="button"
              onClick={() => setRole("CAPTAIN")}
              className={`p-4 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                role === "CAPTAIN"
                  ? "border-accent-500 bg-emerald-50 text-accent-600"
                  : "border-surface-200 hover:border-surface-300 text-surface-600"
              }`}
            >
              <CompassIcon size={24} className="mb-1.5" />
              <div className="text-sm font-medium">Captain</div>
              <div className="text-[10px] mt-0.5 opacity-70">Complete tasks</div>
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isLoading}
        >
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-surface-500 mt-6">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

