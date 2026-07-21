import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts";
import { Button, Input, useToast } from "../../components";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  // Support a ?returnTo= param so users land back where they came from
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get("returnTo");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      addToast("success", "Welcome back!");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const defaultDest = user.role === "CAPTAIN" ? "/captain/dashboard" : "/user";
      navigate(returnTo || defaultDest, { replace: true });
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Login failed. Please try again.";
      setError(message);
      addToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-surface-900 mb-1">Welcome back</h2>
      <p className="text-sm text-surface-500 mb-6">
        Sign in to your account to continue
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
          id="login-email"
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
          id="login-password"
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-surface-500 mt-6">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
