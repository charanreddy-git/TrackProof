import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./components/ui/Toast";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
import { AvailableTasksPage } from "./pages/captain/AvailableTasksPage";
import { AcceptedTasksPage } from "./pages/captain/AcceptedTasksPage";
import { CaptainTaskDetail } from "./pages/captain/CaptainTaskDetail";
import { UploadEvidencePage } from "./pages/captain/UploadEvidencePage";
import { LandingPage } from "./pages/LandingPage";

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
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
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
                <Route path="/captain" element={<CaptainDashboard />} />
                <Route
                  path="/captain/available"
                  element={<AvailableTasksPage />}
                />
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

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
