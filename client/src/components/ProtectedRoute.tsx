import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts";
import { PageLoader } from "./ui";
import type { Role } from "../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    const returnTo = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to the correct dashboard
    const redirectPath = user.role === "CAPTAIN" ? "/captain/dashboard" : "/user";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
