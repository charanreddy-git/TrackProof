import { Navigate } from "react-router-dom";
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

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to the correct dashboard
    const redirectPath = user.role === "CAPTAIN" ? "/captain/dashboard" : "/user";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
