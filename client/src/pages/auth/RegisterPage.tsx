import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useToast } from "../../components/ui/Toast";
import type { Role } from "../../types";

interface RegisterPageProps {
  forcedRole?: Role;
}

export function RegisterPage({ forcedRole }: RegisterPageProps = {}) {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");
  const initialRole: Role = forcedRole ?? ((roleParam?.toUpperCase() === "CAPTAIN") ? "CAPTAIN" : "USER");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState<Role>(initialRole);
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
      navigate(role === "CAPTAIN" ? "/captain/dashboard" : "/user");
    } catch (err) {
       const message =
         (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Registration failed. Please try again.";
      setError(message);
      addToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-surface-900 mb-1">
        {role === "CAPTAIN" ? "Become an Inspector" : "Get Locations Verified"}
      </h2>
      <p className="text-sm text-surface-500 mb-6">
        {role === "CAPTAIN"
          ? "Create your captain account and start earning"
          : "Create your account to request on-demand inspections"}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
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
          minLength={6}
          autoComplete="new-password"
          helperText="At least 6 characters"
          id="register-password"
        />



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
