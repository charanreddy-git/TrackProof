import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  DashboardIcon,
  PlusIcon,
  ClipboardIcon,
  SearchIcon,
  LogOutIcon,
} from "../components/Icons";

const userNav = [
  { to: "/user", label: "Dashboard", icon: DashboardIcon, end: true },
  { to: "/user/create-task", label: "New Task", icon: PlusIcon, end: true },
  { to: "/user/tasks", label: "My Tasks", icon: ClipboardIcon, end: false },
];

const captainNav = [
  { to: "/captain", label: "Dashboard", icon: DashboardIcon, end: true },
  { to: "/captain/available", label: "Available", icon: SearchIcon, end: true },
  { to: "/captain/accepted", label: "My Tasks", icon: ClipboardIcon, end: true },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = user?.role === "CAPTAIN" ? captainNav : userNav;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Determine current page title for mobile header
  const currentNav = navItems.find((item) =>
    item.end
      ? location.pathname === item.to
      : location.pathname.startsWith(item.to)
  );
  const pageTitle = currentNav?.label ?? "InstantLocate";

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-surface-950/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar (desktop) ─── */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-surface-100 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-5 py-4 border-b border-surface-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-surface-900 text-[15px] leading-tight tracking-tight">InstantLocate</h2>
                <span className="text-[11px] text-surface-400 capitalize font-medium">{user?.role?.toLowerCase()} portal</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-3 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-150 group ${
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-surface-600 hover:text-surface-900 hover:bg-surface-50"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Left accent bar */}
                      <span
                        className={`absolute left-0 h-5 w-0.5 rounded-r-full bg-primary-600 transition-opacity duration-150 ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <Icon size={16} className={isActive ? "text-primary-600" : "text-surface-400 group-hover:text-surface-600"} />
                      {item.label}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-3 border-t border-surface-100">
            <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-surface-900 truncate leading-tight">
                  {user?.name}
                </p>
                <p className="text-[11px] text-surface-400 truncate leading-tight">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-surface-500 hover:text-danger-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOutIcon size={15} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-surface-100">
          <div className="flex items-center gap-3 px-4 lg:px-6 h-14">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-surface-100 transition-colors cursor-pointer text-surface-600"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Mobile page title */}
            <span className="lg:hidden text-[15px] font-semibold text-surface-900">{pageTitle}</span>

            {/* Desktop spacer */}
            <div className="hidden lg:block flex-1" />

            {/* Role badge */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-100 rounded-full text-xs font-medium text-surface-600">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    user?.role === "CAPTAIN" ? "bg-accent-500" : "bg-primary-500"
                  }`}
                />
                {user?.role === "CAPTAIN" ? "Captain" : "User"}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 animate-fade-in mb-bottom-nav">
          <Outlet />
        </main>
      </div>

      {/* ─── Mobile Bottom Navigation ─── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-surface-100 pb-safe"
        style={{ boxShadow: "0 -1px 0 rgba(0,0,0,0.06), 0 -4px 12px rgba(0,0,0,0.04)" }}
      >
        <div className="flex items-stretch h-16">
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
                className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
              >
                <div
                  className={`p-1.5 rounded-lg transition-all duration-150 ${
                    isActive ? "text-primary-600" : "text-surface-400"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <span
                  className={`text-[10.5px] font-medium transition-colors duration-150 ${
                    isActive ? "text-primary-600" : "text-surface-400"
                  }`}
                >
                  {item.label}
                </span>
                {/* Active dot indicator */}
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary-600" />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
