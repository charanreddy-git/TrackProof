import { Logo, Button } from "../components";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">
            404 — Page Not Found
          </p>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">
            We can't find that page
          </h1>
          <p className="text-sm text-surface-500 leading-relaxed max-w-xs mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button to="/">Back to Home</Button>
          <Button to="/verify" variant="secondary">Request an Inspection</Button>
        </div>
      </div>
    </div>
  );
}
