import { Link } from "react-router-dom";
import { Logo } from "./Logo";

interface MarketingFooterProps {
  variant?: "primary" | "accent";
  logoLabel?: string;
  tagline?: string;
}

export function MarketingFooter({
  variant = "primary",
  logoLabel = "TrackProof",
  tagline = "Property verification without the travel. Built for buyers in India and NRIs.",
}: MarketingFooterProps) {
  const footerLinks = {
    Product: [
      { label: "How it works", to: "/#how-it-works" },
      { label: "Pricing", to: "/pricing" },
      { label: "For inspectors", to: "/captain" },
    ],
    Account: [
      { label: "Sign in", to: "/login" },
      { label: "Request a visit", to: "/verify/signup" },
      { label: "Become an inspector", to: "/captain/signup" },
    ],
  };

  return (
    <footer className="border-t border-surface-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div className="space-y-4 sm:col-span-1">
            <Logo size="sm" variant={variant} label={logoLabel} />
            <p className="max-w-xs text-sm leading-relaxed text-surface-500">
              {tagline}
            </p>
            <p className="text-xs font-medium text-surface-500">Made in India 🇮🇳</p>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-surface-500">
                {section}
              </h4>
              <ul className="space-y-1">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="inline-flex min-h-11 items-center text-sm text-surface-600 transition-colors hover:text-surface-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-surface-150 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-surface-500">
            &copy; {new Date().getFullYear()} TrackProof. All rights reserved.
          </p>
          <p className="text-xs text-surface-500">
            GPS-verified property proof across India.
          </p>
        </div>
      </div>
    </footer>
  );
}
