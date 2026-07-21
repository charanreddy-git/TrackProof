import { Outlet } from "react-router-dom";
import { Logo } from "../components";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center mb-2">
            <Logo size="lg" />
          </div>
          <p className="text-surface-500 text-sm">
            Secure GPS location verification platform
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-card border border-surface-200 p-5 sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
