import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { MenuIcon, XIcon } from "./Icons";

interface NavItem {
  label: string;
  to: string;
  isAnchor?: boolean;
  isActive?: boolean;
}

interface MarketingHeaderProps {
  variant?: "primary" | "accent";
  logoLabel?: string;
  navItems?: NavItem[];
  ctaLabel?: string;
  ctaTo?: string;
}

export function MarketingHeader({
  variant = "primary",
  logoLabel = "TrackProof",
  navItems = [],
  ctaLabel = "Request a visit",
  ctaTo = "/verify/signup",
}: MarketingHeaderProps) {
  const location = useLocation();
  const routeKey = `${location.pathname}${location.hash}`;
  // The menu closes automatically when the route changes; no effect needed.
  const [mobileMenu, setMobileMenu] = useState({ open: false, routeKey: "" });
  const mobileOpen = mobileMenu.open && mobileMenu.routeKey === routeKey;
  const setMobileOpen = (open: boolean) => setMobileMenu({ open, routeKey });

  const ctaClasses =
    variant === "accent"
      ? "bg-accent-400 hover:bg-accent-300 text-surface-950"
      : "bg-primary-700 hover:bg-primary-800 text-white";

  const isItemActive = (item: NavItem) => {
    if (item.isActive) return true;
    if (item.isAnchor) return false;
    if (item.to === "/") return location.pathname === "/";
    return location.pathname.startsWith(item.to);
  };

  const linkClasses = (active: boolean) =>
    `inline-flex min-h-11 items-center rounded-lg px-1 text-sm font-medium transition-colors ${
      active ? "text-primary-800" : "text-surface-600 hover:text-surface-900"
    }`;

  const renderItem = (item: NavItem) =>
    item.isAnchor ? (
      <a
        key={item.to}
        href={item.to}
        onClick={() => setMobileOpen(false)}
        className={linkClasses(false)}
      >
        {item.label}
      </a>
    ) : (
      <Link
        key={item.to}
        to={item.to}
        onClick={() => setMobileOpen(false)}
        className={linkClasses(isItemActive(item))}
        aria-current={isItemActive(item) ? "page" : undefined}
      >
        {item.label}
      </Link>
    );

  return (
    <header className="sticky top-0 z-50 border-b border-surface-200/80 bg-surface-50/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo variant={variant} label={logoLabel} />

        {navItems.length > 0 && (
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            {navItems.map(renderItem)}
          </nav>
        )}

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/login"
            className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-surface-650 transition-colors hover:bg-surface-100 hover:text-surface-900"
          >
            Sign in
          </Link>
          <Link
            to={ctaTo}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors ${ctaClasses}`}
          >
            {ctaLabel}
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <Link
            to="/login"
            className="inline-flex min-h-11 items-center rounded-lg px-2.5 text-sm font-semibold text-surface-650"
          >
            Sign in
          </Link>
          {navItems.length > 0 && (
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-surface-650 transition-colors hover:bg-surface-100"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
            </button>
          )}
        </div>
      </div>

      {mobileOpen && navItems.length > 0 && (
        <div className="border-t border-surface-200 bg-surface-50 md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <div key={item.to} className="py-0.5">
                {renderItem(item)}
              </div>
            ))}
            <Link
              to={ctaTo}
              onClick={() => setMobileOpen(false)}
              className={`mt-3 block rounded-xl px-4 py-3 text-center text-sm font-semibold shadow-sm ${ctaClasses}`}
            >
              {ctaLabel}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
