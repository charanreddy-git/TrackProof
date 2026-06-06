import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-50 text-surface-900 font-sans flex flex-col justify-between selection:bg-primary-500 selection:text-white">
      {/* Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-surface-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-bold text-[15px] tracking-tight text-surface-900">InstantLocate</span>
          </div>

          <div>
            <Link
              to="/login"
              className="text-[13px] font-semibold bg-white border border-surface-200 hover:bg-surface-150 text-surface-700 px-4 py-2 rounded-lg transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-surface-900 tracking-tight leading-[1.1]">
            Verify Any Property Without Traveling
          </h1>
          <p className="text-sm md:text-base text-surface-550 max-w-lg mx-auto font-normal leading-relaxed">
            Connect with trusted local inspectors to check land coordinates, construction progress, or physical listings on-site.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs font-semibold text-surface-600">
            <span className="flex items-center gap-1.5">
              <span className="text-primary-650">✓</span> GPS-verified evidence
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-primary-650">✓</span> Live progress tracking
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-primary-650">✓</span> Local inspectors across India
            </span>
          </div>
        </div>

        {/* Path Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-3xl mx-auto w-full">
          {/* Card 1: Requester */}
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

          {/* Card 2: Captain */}
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
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-200 bg-surface-50 py-8 text-surface-500 text-[11px] text-center">
        <p>&copy; {new Date().getFullYear()} InstantLocate. All rights reserved.</p>
      </footer>
    </div>
  );
}
