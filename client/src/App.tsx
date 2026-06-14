import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./components/ui/Toast";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Layouts
import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";

// User Pages
import { UserDashboard } from "./pages/user/UserDashboard";
import { CreateTaskPage } from "./pages/user/CreateTaskPage";
import { UserTaskDetail } from "./pages/user/UserTaskDetail";
import { TrackCaptainPage } from "./pages/user/TrackCaptainPage";

// Captain Pages
import { CaptainDashboard } from "./pages/captain/CaptainDashboard";
import { AcceptedTasksPage } from "./pages/captain/AcceptedTasksPage";
import { CaptainTaskDetail } from "./pages/captain/CaptainTaskDetail";
import { UploadEvidencePage } from "./pages/captain/UploadEvidencePage";
import { LandingPage } from "./pages/LandingPage";
import { RequesterLandingPage } from "./pages/verify/RequesterLandingPage";
import { CaptainLandingPage } from "./pages/captain/CaptainLandingPage";
import { PricingPage } from "./pages/PricingPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 10000,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <ToastProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/verify" element={<RequesterLandingPage />} />
              <Route path="/captain" element={<CaptainLandingPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify/signup" element={<RegisterPage forcedRole="USER" />} />
                <Route path="/captain/signup" element={<RegisterPage forcedRole="CAPTAIN" />} />
              </Route>

              {/* User routes */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["USER"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/user" element={<UserDashboard />} />
                <Route path="/user/create-task" element={<CreateTaskPage />} />
                <Route path="/user/tasks" element={<UserDashboard />} />
                <Route path="/user/tasks/:id" element={<UserTaskDetail />} />
                <Route path="/user/track/:id" element={<TrackCaptainPage />} />
              </Route>

              {/* Captain routes */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["CAPTAIN"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/captain/dashboard" element={<CaptainDashboard />} />
                <Route
                  path="/captain/accepted"
                  element={<AcceptedTasksPage />}
                />
                <Route
                  path="/captain/tasks/:id"
                  element={<CaptainTaskDetail />}
                />
                <Route
                  path="/captain/tasks/:id/upload"
                  element={<UploadEvidencePage />}
                />
              </Route>

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
  );
}

export default App;
