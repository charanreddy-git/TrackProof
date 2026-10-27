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
  ShieldCheckIcon,
  UserIcon,
} from "../components/Icons";
import { Logo, LogoMark } from "../components";
import { formatPhone } from "../utils/phone";

const userNav = [
  { to: "/user", label: "Home", icon: HomeIcon, end: true },
  { to: "/user/create-task", label: "Book a visit", icon: PlusIcon, end: true },
  { to: "/user/tasks", label: "My visits", icon: ClipboardIcon, end: false },
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
  const accountOpen = accountMenu.open && accountMenu.path === location.pathname;
  const setAccountOpen = (open: boolean) =>
    setAccountMenu({ open, path: location.pathname });

  useGlobalTaskUpdates();

  const isInspector = user?.role === "CAPTAIN";
  const navItems = isInspector ? captainNav : userNav;
  const isCameraFlow = location.pathname.endsWith("/upload");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const pageTitle = (() => {
    if (location.pathname === "/user/create-task") return "Book a visit";
    if (location.pathname.startsWith("/user/tasks/")) return "Visit details";
    if (location.pathname.startsWith("/user/track/")) return "Live tracking";
    if (location.pathname.startsWith("/captain/tasks/")) {
      return location.pathname.endsWith("/upload") ? "Submit proof" : "Visit details";
    }
    if (location.pathname === "/captain/accepted") return "My visits";
    if (location.pathname === "/user/tasks") return "My visits";
    return isInspector ? "Find work" : "Home";
  })();

  const firstName = user?.name?.split(" ")[0] || user?.name || "there";
  const roleLabel = isInspector ? "Inspector" : "Requester";
  const initials = user?.name?.charAt(0).toUpperCase() || <UserIcon size={17} />;

  return (
    <div className="min-h-screen bg-surface-50">
      {/* ─── Sidebar ─── */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[252px] flex-col border-r border-surface-200 bg-white sm:flex">
        <div className="flex h-[76px] items-center border-b border-surface-100 px-5">
          <Logo size="sm" />
        </div>

        <div className="px-4 pb-2 pt-5">
          <p className="rounded-full bg-surface-100 px-3 py-1.5 text-center text-[10.5px] font-bold text-surface-500">
            {isInspector ? "Inspector account" : "Requester account"}
          </p>
        </div>

        <nav className="space-y-1 px-3 pt-2" aria-label="Dashboard navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `group flex min-h-12 items-center gap-3 rounded-xl px-3 text-[13.5px] font-bold transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-800"
                      : "text-surface-600 hover:bg-surface-50 hover:text-surface-950"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        isActive ? "bg-white text-primary-700 shadow-sm" : "bg-surface-100 text-surface-500"
                      }`}
                    >
                      <Icon size={16} />
                    </span>
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="mx-3 mb-3 rounded-2xl bg-primary-50 p-3.5">
            <p className="flex items-center gap-1.5 text-[11.5px] font-bold text-primary-800">
              <ShieldCheckIcon size={14} className="text-primary-600" />
              GPS-checked proof
            </p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-primary-700/80">
              Every photo is accepted only within{" "}
              <strong className="font-bold">100 metres</strong> of the pin.
            </p>
            <div className="mt-2.5 flex gap-1">
              {Array.from({ length: 10 }).map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 flex-1 rounded-full ${index < 7 ? "bg-primary-500" : "bg-primary-200"}`}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-surface-100 px-3 py-3">
            <div className="flex items-center gap-2.5 px-1 py-1">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-800 text-[12px] font-extrabold text-white">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-bold text-surface-900">{user?.name}</p>
                <p className="truncate text-[10.5px] font-medium text-surface-500">{roleLabel}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-1 flex min-h-10 w-full items-center gap-2.5 rounded-lg px-2 text-[12px] font-semibold text-surface-500 transition-colors hover:bg-danger-50 hover:text-danger-700"
            >
              <LogOutIcon size={15} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main area ─── */}
      <div className="flex min-h-screen flex-col sm:pl-[252px]">
        <header className="sticky top-0 z-30 border-b border-surface-200 bg-surface-50/95 backdrop-blur-md">
          <div className="flex h-15 items-center justify-between gap-3 px-4 sm:h-[76px] sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-2.5 sm:hidden">
              <LogoMark size="sm" />
              <span className="truncate text-[1.05rem] font-extrabold tracking-[-0.035em] text-surface-950">
                {pageTitle}
              </span>
            </div>

            <div className="hidden min-w-0 sm:block">
              <p className="text-[11px] font-semibold text-surface-500">
                {isInspector ? `Hi ${firstName}, ready to head out?` : `Hi ${firstName}, good to see you.`}
              </p>
              <p className="mt-0.5 truncate text-[1.25rem] font-extrabold leading-tight tracking-[-0.03em] text-surface-950">
                {pageTitle}
              </p>
            </div>

            <div className="relative ml-auto">
              <button
                type="button"
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary-100 text-[12px] font-extrabold text-primary-800 shadow-sm transition-transform hover:scale-105"
                aria-label="Account menu"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
              >
                {initials}
              </button>

              {accountOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setAccountOpen(false)}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-elevated animate-scale-in"
                    role="menu"
                  >
                    <div className="border-b border-surface-100 px-4 py-3.5">
                      <p className="text-[10.5px] font-bold text-surface-500">{roleLabel}</p>
                      <p className="mt-1 truncate text-[13px] font-bold text-surface-950">{user?.name}</p>
                      <p className="mt-0.5 truncate text-[11px] text-surface-500">
                        {user?.phone ? formatPhone(user.phone) : null}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      role="menuitem"
                      className="flex w-full items-center gap-2.5 px-4 py-3.5 text-[12.5px] font-semibold text-surface-600 transition-colors hover:bg-surface-50 hover:text-surface-950"
                    >
                      <LogOutIcon size={15} />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main
          className={`flex-1 px-4 py-5 animate-fade-in sm:px-6 sm:py-7 lg:px-8 ${
            isCameraFlow ? "pb-8" : "mb-bottom-nav"
          }`}
        >
          <Outlet />
        </main>
      </div>

      {/* ─── Mobile bottom nav ─── */}
      {!isCameraFlow && (
        <nav
          className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-200 bg-white/95 pb-safe backdrop-blur-xl sm:hidden"
          style={{ boxShadow: "0 -8px 30px rgba(22, 30, 24, 0.07)" }}
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
                  className="flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1"
                >
                  <span
                    className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${
                      isActive ? "bg-primary-50 text-primary-700" : "text-surface-400"
                    }`}
                  >
                    <Icon size={19} />
                  </span>
                  <span
                    className={`text-[10px] font-bold ${
                      isActive ? "text-primary-800" : "text-surface-500"
                    }`}
                  >
                    {item.label}
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
