import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";

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
  logoLabel = "InstantLocate",
  navItems = [],
  ctaLabel = "Get Started",
  ctaTo = "/verify/signup",
}: MarketingHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const ctaBg = variant === "accent"
    ? "bg-accent-500 hover:bg-accent-600"
    : "bg-primary-600 hover:bg-primary-700";

  const NavLink = ({ item }: { item: NavItem }) =>
    item.isAnchor ? (
      <a
        href={item.to}
        onClick={() => setMobileOpen(false)}
        className={`hover:text-surface-900 transition-colors ${
          item.isActive ? "text-primary-600 font-bold" : ""
        }`}
      >
        {item.label}
      </a>
    ) : (
      <Link
        to={item.to}
        onClick={() => setMobileOpen(false)}
        className={`hover:text-surface-900 transition-colors ${
          item.isActive ? "text-primary-600 font-bold" : ""
        }`}
      >
        {item.label}
      </Link>
    );

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo variant={variant} label={logoLabel} />

        {/* Desktop nav */}
        {navItems.length > 0 && (
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-surface-650">
            {navItems.map((item) => (
              <NavLink key={item.to} item={item} />
            ))}
          </nav>
        )}

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-[13px] font-semibold text-surface-650 hover:text-surface-900 px-3 py-1.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
          >
            Sign In
          </Link>
          <Link
            to={ctaTo}
            className={`text-[12.5px] font-bold ${ctaBg} text-white px-4 py-2 rounded-lg transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:outline-none`}
          >
            {ctaLabel}
          </Link>
        </div>

        {/* Mobile: CTA + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to={ctaTo}
            className={`text-[12px] font-bold ${ctaBg} text-white px-3 py-1.5 rounded-lg transition-all shadow-sm`}
          >
            {ctaLabel}
          </Link>
          {navItems.length > 0 && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-surface-100 transition-colors text-surface-600 cursor-pointer"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && navItems.length > 0 && (
        <div className="md:hidden border-t border-surface-200 bg-white/95 backdrop-blur-md animate-slide-up">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-0.5 text-[14px] font-medium text-surface-700">
            {navItems.map((item) => (
              <div key={item.to} className="py-2 border-b border-surface-100 last:border-0">
                <NavLink item={item} />
              </div>
            ))}
            <div className="pt-3 pb-1">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-2.5 text-sm font-semibold text-surface-700 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
