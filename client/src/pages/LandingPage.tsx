import { Link } from "react-router-dom";
import { MarketingHeader } from "../components/MarketingHeader";
import { MarketingFooter } from "../components/MarketingFooter";
import {
  MapPinIcon,
  CameraIcon,
  CheckCircleIcon,
} from "../components/Icons";

const STEPS = [
  {
    icon: MapPinIcon,
    step: "01",
    title: "Pin the Location",
    desc: "Drop a pin on any property, plot, or address in India. Add specific instructions for the inspector.",
  },
  {
    icon: CameraIcon,
    step: "02",
    title: "Inspector Visits On-Site",
    desc: "A verified local captain rides to the coordinates, captures GPS-sealed photos from within the 100m geofence.",
  },
  {
    icon: CheckCircleIcon,
    step: "03",
    title: "Get Verified Proof",
    desc: "Receive timestamped, location-watermarked photo evidence directly on your dashboard. Review and confirm.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-50 text-surface-900 font-sans flex flex-col justify-between selection:bg-primary-500 selection:text-white">
      <MarketingHeader
        navItems={[
          { label: "How It Works", to: "#how-it-works", isAnchor: true },
          { label: "Pricing", to: "/pricing" },
          { label: "For Captains", to: "/captain" },
        ]}
        ctaLabel="Get Started"
        ctaTo="/verify/signup"
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-5">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-surface-900 tracking-tight leading-[1.1]">
                Verify Any Property in India Without Being There
              </h1>
              <p className="text-sm md:text-base text-surface-550 max-w-lg mx-auto font-normal leading-relaxed">
                Send a local inspector to any coordinates. Get GPS-sealed photos, on-site evidence, and verified proof — delivered to your dashboard.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  to="/verify/signup"
                  className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-all shadow-md text-[13px]"
                >
                  Request an Inspection
                </Link>
                <Link
                  to="/pricing"
                  className="px-6 py-3 text-[13px] font-semibold text-surface-600 hover:text-surface-900 bg-white border border-surface-200 hover:border-surface-300 rounded-lg transition-all"
                >
                  View Pricing →
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-3 text-xs font-semibold text-surface-600">
                <span className="flex items-center gap-1.5">
                  <span className="text-primary-650">✓</span> GPS-verified evidence
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-primary-650">✓</span> Live progress tracking
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-primary-650">✓</span> 100% refund guarantee
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Two Path Cards */}
        <section className="py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 space-y-2">
              <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">Get Started</h2>
              <h3 className="text-xl font-bold text-surface-900 tracking-tight">Choose Your Path</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-3xl mx-auto w-full">
              {/* Requester Card */}
              <div className="p-8 bg-white border border-surface-200 rounded-2xl hover:border-primary-500 hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between space-y-6 group">
                <div className="space-y-3">
                  <h2 className="text-lg sm:text-xl font-bold text-surface-900 tracking-tight">Verify a Property</h2>
                  <p className="text-xs text-surface-550 leading-relaxed font-normal">
                    Get verified photos, walkthrough videos, and on-site checks delivered to your dashboard. Ideal for NRI buyers, investors, and landowners.
                  </p>
                </div>

                <Link
                  to="/verify"
                  className="block w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs text-center rounded-xl transition-all shadow-sm group-hover:scale-[1.01]"
                >
                  Request an Inspection
                </Link>
              </div>

              {/* Captain Card */}
              <div className="p-8 bg-white border border-surface-200 rounded-2xl hover:border-accent-500 hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between space-y-6 group">
                <div className="space-y-3">
                  <h2 className="text-lg sm:text-xl font-bold text-surface-900 tracking-tight">Become a Captain</h2>
                  <p className="text-xs text-surface-550 leading-relaxed font-normal">
                    Inspect properties in your local area, complete simple site visits, and get paid weekly. Join our fleet of flexible inspectors.
                  </p>
                </div>

                <Link
                  to="/captain"
                  className="block w-full py-3 bg-surface-900 hover:bg-surface-950 text-white font-bold text-xs text-center rounded-xl transition-all shadow-sm group-hover:scale-[1.01]"
                >
                  Start Earning
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Teaser */}
        <section className="bg-white border-y border-surface-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center space-y-4">
            <h3 className="text-lg font-bold text-surface-900 tracking-tight">Simple, Pay-Per-Inspection Pricing</h3>
            <p className="text-sm text-surface-550 max-w-lg mx-auto">
              Starting at <strong className="text-surface-900 font-bold">₹199</strong> per inspection. No subscriptions, no hidden fees. Full refund if no inspector is matched within 48 hours.
            </p>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-surface-900 hover:bg-surface-950 text-white text-xs font-bold rounded-lg transition-all shadow-sm"
            >
              See All Plans & Calculator
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
