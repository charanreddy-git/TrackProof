import { MarketingHeader, MarketingFooter, Button, Card } from "../components";

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

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button to="/verify/signup" size="lg">
                  Request an Inspection
                </Button>
                <Button to="/pricing" variant="secondary" size="lg">
                  View Pricing →
                </Button>
              </div>

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
              <Card padding="lg" hover className="flex flex-col justify-between space-y-6 group border-2 border-surface-200 hover:border-primary-500">
                <div className="space-y-3">
                  <h2 className="text-lg sm:text-xl font-bold text-surface-900 tracking-tight">Verify a Property</h2>
                  <p className="text-xs text-surface-550 leading-relaxed font-normal">
                    Get verified photos, walkthrough videos, and on-site checks delivered to your dashboard. Ideal for NRI buyers, investors, and landowners.
                  </p>
                </div>
                <Button to="/verify" className="w-full text-xs" size="md">
                  Request an Inspection
                </Button>
              </Card>

              <Card padding="lg" hover className="flex flex-col justify-between space-y-6 group border-2 border-surface-200 hover:border-accent-500">
                <div className="space-y-3">
                  <h2 className="text-lg sm:text-xl font-bold text-surface-900 tracking-tight">Become a Captain</h2>
                  <p className="text-xs text-surface-550 leading-relaxed font-normal">
                    Inspect properties in your local area, complete simple site visits, and get paid weekly. Join our fleet of flexible inspectors.
                  </p>
                </div>
                <Button to="/captain" variant="secondary" className="w-full text-xs" size="md">
                  Start Earning
                </Button>
              </Card>
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
            <Button to="/pricing" variant="secondary" size="md">
              See All Plans & Calculator
            </Button>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
