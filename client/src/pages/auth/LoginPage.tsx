import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts";
import { Button, Input, useToast } from "../../components";
import { formatPhone, normalizePhoneInput } from "../../utils/phone";

type Step = "phone" | "code";

function safeReturnTo(value: string | null): string | null {
  return value?.startsWith("/") && !value.startsWith("//") ? value : null;
}

function errorMessage(error: unknown, fallback: string): string {
  const message = (
    error as { response?: { data?: { message?: string } } }
  ).response?.data?.message;
  if (message) return message;
  return error instanceof Error ? error.message : fallback;
}

export function LoginPage() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("+91 ");
  const [code, setCode] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { requestOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const returnTo = safeReturnTo(
    new URLSearchParams(location.search).get("returnTo")
  );

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setInterval(() => {
      setResendIn((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendIn]);

  const sendCode = async (e?: FormEvent) => {
    e?.preventDefault();
    setError("");

    let normalized: string;
    try {
      normalized = normalizePhoneInput(phone);
    } catch (err) {
      setError(errorMessage(err, "Enter a valid mobile number."));
      return;
    }

    setIsLoading(true);
    try {
      const result = await requestOtp(normalized);
      setPhone(normalized);
      setCode("");
      setStep("code");
      setDevOtp(result.devOtp ?? null);
      setResendIn(result.resendAfter);
      addToast("success", "Verification code sent");
    } catch (err) {
      setError(
        errorMessage(err, "Could not send the code. Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (code.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOtp(phone, code);
      addToast("success", "Signed in successfully");
      const defaultDest =
        result.user.role === "CAPTAIN" ? "/captain/dashboard" : "/user";
      navigate(returnTo || defaultDest, { replace: true });
    } catch (err) {
      setError(
        errorMessage(err, "Could not verify the code. Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const changeNumber = () => {
    setStep("phone");
    setCode("");
    setDevOtp(null);
    setResendIn(0);
    setError("");
  };

  const signupSuffix = returnTo
    ? `?returnTo=${encodeURIComponent(returnTo)}`
    : "";

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-surface-950">
        {step === "phone" ? "Welcome back" : "Enter your code"}
      </h1>
      <p className="mt-1 text-sm text-surface-500">
        {step === "phone"
          ? "Sign in with your mobile number. No password needed."
          : `We sent a 6-digit code to ${formatPhone(phone)}.`}
      </p>

      {step === "phone" ? (
        <form onSubmit={sendCode} className="mt-6 space-y-4">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-danger-200 bg-danger-50 px-3.5 py-3 text-sm text-danger-700"
            >
              {error}
            </div>
          )}

          <Input
            label="Mobile number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            required
            autoComplete="tel"
            inputMode="tel"
            helperText="Outside India? Include your country code."
            id="login-phone"
            autoFocus
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
          >
            Send code
          </Button>

          <p className="text-center text-xs leading-relaxed text-surface-500">
            By continuing, you agree to receive a one-time verification SMS.
            Standard message rates may apply.
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-danger-200 bg-danger-50 px-3.5 py-3 text-sm text-danger-700"
            >
              <p>{error}</p>
              {error.toLowerCase().includes("no account") && (
                <Link
                  to={`/register${signupSuffix}`}
                  className="mt-2 inline-flex min-h-11 items-center font-semibold text-primary-700 hover:text-primary-800"
                >
                  Create an account →
                </Link>
              )}
            </div>
          )}

          {devOtp && (
            <div className="rounded-xl border border-dashed border-accent-400 bg-accent-50 px-3.5 py-3 text-sm text-surface-800">
              <p className="font-semibold">Local development code</p>
              <p className="mt-0.5 font-mono text-lg tracking-[0.3em]">
                {devOtp}
              </p>
              <p className="mt-1 text-xs text-surface-600">
                Shown only because SMS_PROVIDER=console. It is never returned in
                production.
              </p>
            </div>
          )}

          <Input
            label="6-digit code"
            type="text"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="000000"
            required
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            pattern="[0-9]{6}"
            id="login-code"
            className="text-center text-xl font-semibold tracking-[0.45em]"
            autoFocus
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
            disabled={code.length !== 6}
          >
            Verify and continue
          </Button>

          <div className="flex flex-col gap-1">
            <Button
              type="button"
              variant="ghost"
              className="w-full min-h-11"
              onClick={() => void sendCode()}
              disabled={resendIn > 0 || isLoading}
            >
              {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full min-h-11"
              onClick={changeNumber}
              disabled={isLoading}
            >
              Use a different number
            </Button>
          </div>
        </form>
      )}

      <div className="mt-6 border-t border-surface-150 pt-5">
        <p className="text-center text-sm font-medium text-surface-700">
          New to TrackProof?
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link
            to={`/verify/signup${signupSuffix}`}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-surface-200 px-3 py-2.5 text-center text-xs font-semibold text-surface-700 transition-colors hover:bg-surface-50"
          >
            Request a visit
          </Link>
          <Link
            to={`/captain/signup${signupSuffix}`}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-surface-200 px-3 py-2.5 text-center text-xs font-semibold text-surface-700 transition-colors hover:bg-surface-50"
          >
            Work as inspector
          </Link>
        </div>
      </div>
    </div>
  );
}
