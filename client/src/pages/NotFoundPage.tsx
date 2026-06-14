import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";

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
          <Link
            to="/"
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-lg transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          >
            Back to Home
          </Link>
          <Link
            to="/verify"
            className="px-6 py-2.5 bg-white hover:bg-surface-50 text-surface-700 text-sm font-semibold border border-surface-200 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          >
            Request an Inspection
          </Link>
        </div>
      </div>
    </div>
  );
}
