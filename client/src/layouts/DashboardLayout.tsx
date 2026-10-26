import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts";
import { useGlobalTaskUpdates } from "../hooks";
import {
  PlusIcon,
  ClipboardIcon,
  LogOutIcon,
  HomeIcon,
  SearchIcon,
  UserIcon,
} from "../components/Icons";
import { Logo, LogoMark } from "../components";
import { formatPhone } from "../utils/phone";

const userNav = [
  { to: "/user", label: "Overview", icon: HomeIcon, end: true },
  { to: "/user/create-task", label: "Request a visit", icon: PlusIcon, end: true },
  { to: "/user/tasks", label: "My requests", icon: ClipboardIcon, end: false },
];

const captainNav = [
  { to: "/captain/dashboard", label: "Find work", icon: SearchIcon, end: true },
  { to: "/captain/accepted", label: "My visits", icon: ClipboardIcon, end: false },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [accountMenu, setAccountMenu] = useState({ open: false, path: "" });
  // The menu closes automatically when the route changes; no effect needed.
  const accountOpen = accountMenu.open && accountMenu.path === location.pathname;
  const setAccountOpen = (open: boolean) =>
    setAccountMenu({ open, path: location.pathname });

  // Subscribe to real-time dashboard invalidations.
  useGlobalTaskUpdates();

  const isInspector = user?.role === "CAPTAIN";
  const navItems = isInspector ? captainNav : userNav;
  // The camera flow gets the full screen: a fixed tab bar would cover the shutter.
  const isCameraFlow = location.pathname.endsWith("/upload");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const currentNav = navItems.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  );

  const pageTitle = (() => {
    if (location.pathname === "/user/create-task") return "Request a visit";
    if (location.pathname.startsWith("/user/tasks/")) return "Visit details";
    if (location.pathname.startsWith("/user/track/")) return "Live tracking";
    if (location.pathname.startsWith("/captain/tasks/")) {
      return location.pathname.endsWith("/upload") ? "Submit proof" : "Visit details";
    }
    return currentNav?.label ?? "TrackProof";
  })();
  const firstName = user?.name?.split(" ")[0] || user?.name || "there";

  return (
    <div className="min-h-screen bg-surface-50">
      {/* ─── Sidebar (tablet and desktop) ─── */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-surface-200 bg-white sm:flex sm:flex-col">
        <div className="flex h-16 items-center border-b border-surface-150 px-5">
          <Logo size="sm" />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Dashboard navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-800"
                      : "text-surface-600 hover:bg-surface-50 hover:text-surface-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={isActive ? "text-primary-700" : "text-surface-500"}
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-surface-150 p-3">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-800">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-surface-900">{user?.name}</p>
              <p className="truncate text-xs text-surface-500">
                {isInspector ? "Inspector" : "Property owner"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-surface-500 transition-colors hover:bg-danger-50 hover:text-danger-700"
          >
            <LogOutIcon size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ─── Main content ─── */}
      <div className="flex min-h-screen flex-col sm:pl-64">
        <header className="sticky top-0 z-30 border-b border-surface-200 bg-white/95 backdrop-blur-lg">
          <div className="flex h-14 items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-2.5 sm:hidden">
              <LogoMark size="sm" />
              <span className="text-sm font-extrabold tracking-tight text-surface-900">
                Track<span className="text-primary-700">Proof</span>
              </span>
            </div>

            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-semibold text-surface-900">{pageTitle}</p>
            </div>

            <p className="hidden text-sm text-surface-500 lg:block">
              {isInspector ? `Welcome, ${firstName}` : `Hello, ${firstName}`}
            </p>

            <div className="relative ml-auto">
              <button
                type="button"
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-800 transition-colors hover:bg-primary-200"
                aria-label="Account menu"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
              >
                {user?.name?.charAt(0).toUpperCase() || <UserIcon size={18} />}
              </button>

              {accountOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setAccountOpen(false)}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-surface-200 bg-white shadow-elevated animate-scale-in"
                    role="menu"
                  >
                    <div className="border-b border-surface-150 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-surface-900">{user?.name}</p>
                      <p className="truncate text-xs text-surface-500">
                        {user?.phone ? formatPhone(user.phone) : null}
                      </p>
                      <p className="mt-1.5 inline-flex rounded-md bg-surface-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-surface-500">
                        {isInspector ? "Inspector" : "Property owner"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      role="menuitem"
                      className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-50 hover:text-surface-900"
                    >
                      <LogOutIcon size={16} />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className={`flex-1 p-4 animate-fade-in sm:p-6 sm:pb-8 lg:p-8 ${isCameraFlow ? "" : "mb-bottom-nav"}`}>
          <Outlet />
        </main>
      </div>

      {/* ─── Mobile bottom navigation ─── */}
      {!isCameraFlow && (
        <nav
          className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-200 bg-white pb-safe sm:hidden"
          style={{ boxShadow: "0 -1px 0 rgba(18,17,15,0.06)" }}
          aria-label="Mobile dashboard navigation"
        >
          <div className="flex h-16 items-stretch">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.end
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className="relative flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1"
                >
                  <span
                    className={`flex h-8 w-12 items-center justify-center rounded-lg transition-colors ${
                      isActive ? "bg-primary-50 text-primary-700" : "text-surface-500"
                    }`}
                  >
                    <Icon size={20} />
                  </span>
                  <span
                    className={`text-[11px] font-medium ${
                      isActive ? "text-primary-700" : "text-surface-500"
                    }`}
                  >
                    {item.label === "Request a visit" ? "Request" : item.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
