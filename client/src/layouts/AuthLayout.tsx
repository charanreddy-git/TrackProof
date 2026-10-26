import { Link, Outlet } from "react-router-dom";
import { Logo, ShieldCheckIcon, MapPinIcon, CameraIcon } from "../components";

export function AuthLayout() {
  return (
    <div className="paper-bg flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-slide-up">
        <div className="mb-6 text-center">
          <div className="inline-flex">
            <Logo size="lg" />
          </div>
          <p className="mt-3 text-sm text-surface-500">
            Property verification without the travel.
          </p>
        </div>

        <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-card sm:p-7">
          <Outlet />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-surface-500">
          <span className="inline-flex items-center gap-1.5">
            <MapPinIcon size={13} /> GPS-verified proof
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheckIcon size={13} /> 100 m proof check
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CameraIcon size={13} /> No app needed
          </span>
        </div>

        <p className="mt-5 text-center">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center px-2 text-xs font-medium text-surface-500 transition-colors hover:text-surface-900"
          >
            ← Back to TrackProof
          </Link>
        </p>
      </div>
    </div>
  );
}
