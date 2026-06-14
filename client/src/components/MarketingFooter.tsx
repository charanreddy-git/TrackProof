import { Link } from "react-router-dom";
import { Logo } from "./Logo";

interface MarketingFooterProps {
  variant?: "primary" | "accent";
  logoLabel?: string;
  tagline?: string;
}

export function MarketingFooter({
  variant = "primary",
  logoLabel = "InstantLocate",
  tagline = "Secure Remote Inspections & Verification.",
}: MarketingFooterProps) {
  const footerLinks = {
    Product: [
      { label: "How It Works", to: "/verify#how-it-works" },
      { label: "Pricing", to: "/pricing" },
      { label: "For Captains", to: "/captain" },
    ],
    Account: [
      { label: "Sign In", to: "/login" },
      { label: "Create Account", to: "/register" },
      { label: "Request Inspection", to: "/verify/signup" },
    ],
    Legal: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Refund Policy", to: "/refunds" },
    ],
  };

  return (
    <footer className="border-t border-surface-200 bg-white pt-12 pb-8 text-surface-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top: Logo + Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Logo size="sm" variant={variant} label={logoLabel} />
            <p className="text-xs text-surface-500 leading-relaxed max-w-[180px]">
              {tagline}
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-surface-400">
                {section}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-xs text-surface-500 hover:text-surface-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-surface-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-surface-400">
            &copy; {new Date().getFullYear()} InstantLocate. All rights reserved.
          </p>
          <p className="text-[11px] text-surface-400">
            Made in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
