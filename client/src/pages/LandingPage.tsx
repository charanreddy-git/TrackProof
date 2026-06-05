import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CompassIcon,
  MapPinIcon,
  CameraIcon,
  ZapIcon,
  ClipboardIcon,
  ChevronDownIcon,
  UserIcon,
} from "../components/Icons";

export function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "What is InstantLocate?",
      a: "InstantLocate is a secure physical location verification platform connecting users who need locations verified with local Captains who travel to the coordinate, capture live photos, and upload proof of presence in real time.",
    },
    {
      q: "How does proximity validation work?",
      a: "InstantLocate uses the mathematical Haversine formula to compute the physical distance between the Captain's live GPS coordinates and the target coordinates. Captains must be within 100 meters of the target to submit their verification photo.",
    },
    {
      q: "Do I need to download an application?",
      a: "No, InstantLocate is built as a responsive web app. It runs directly in your mobile browser and accesses your device's native camera and GPS API (with your permission).",
    },
    {
      q: "How are verification tasks tracked in real time?",
      a: "When a Captain accepts and starts a task, they stream their live coordinates over WebSockets (Socket.IO). Task creators can track the Captain's location in real time on an interactive map.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-primary-500 selection:text-white overflow-x-hidden font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-white bg-clip-text">InstantLocate</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#benefits" className="hover:text-white transition-colors">Portals</a>
            <a href="#faqs" className="hover:text-white transition-colors">FAQs</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-xl transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium bg-primary-600 hover:bg-primary-500 text-white px-4.5 py-2 rounded-xl shadow-lg shadow-primary-600/20 transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
        {/* Glow Backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-accent-500/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-primary-400">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Real-Time GPS Location Verification
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight max-w-4xl mx-auto">
            Verify Physical Locations <br className="hidden sm:inline" />
            With <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400 bg-clip-text text-transparent">Trusted Evidence</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Need photo proof of a remote property, asset, or event? InstantLocate connects requesters with local Captains who capture real-time, GPS-validated photos within 100 meters of the coordinate.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold rounded-2xl shadow-xl shadow-primary-600/25 transition-all hover:scale-[1.02] active:scale-98 text-center"
            >
              Verify a Location
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-slate-750 text-slate-200 font-semibold rounded-2xl transition-all hover:scale-[1.02] active:scale-98 text-center"
            >
              Become a Captain
            </Link>
          </div>

          {/* Key specs row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-4xl mx-auto border-t border-slate-900 text-center">
            <div>
              <div className="text-3xl font-bold text-white">&lt; 100m</div>
              <div className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-wider">GPS Proximity Gate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">Live</div>
              <div className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-wider">WebSocket Tracking</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">Zero</div>
              <div className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-wider">File Placeholders</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">Neon</div>
              <div className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-wider">PostgreSQL Powered</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 border-t border-slate-900 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-semibold text-primary-500 uppercase tracking-widest">Workflow</h2>
            <h3 className="text-3xl font-bold text-white sm:text-4xl">How InstantLocate Works</h3>
            <p className="text-slate-400">A seamless bridge between digital requests and physical operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-8 rounded-2xl bg-slate-900/50 border border-slate-850 hover:border-slate-800 transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/30 text-primary-400 flex items-center justify-center text-xl font-bold mb-6">
                1
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Create Location Request</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Pin a location coordinates on our interactive map interface. Provide instructions on what needs to be verified and photographed.
              </p>
            </div>

            <div className="relative p-8 rounded-2xl bg-slate-900/50 border border-slate-850 hover:border-slate-800 transition-all">
              <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/30 text-accent-400 flex items-center justify-center text-xl font-bold mb-6">
                2
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Captain Accepts & Navigates</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                An available local Captain accepts your task. As they travel, you track their progress in real time via live WebSocket GPS coordinates on the map.
              </p>
            </div>

            <div className="relative p-8 rounded-2xl bg-slate-900/50 border border-slate-850 hover:border-slate-800 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xl font-bold mb-6">
                3
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Webcam Proximity Capture</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Once within 100 meters of coordinates, the Captain triggers the live camera viewfinder, snaps a photo, and uploads securely to close the task.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section id="features" className="py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-semibold text-primary-500 uppercase tracking-widest">Platform Core</h2>
            <h3 className="text-3xl font-bold text-white sm:text-4xl">Engineered for absolute accuracy</h3>
            <p className="text-slate-400">Eliminating remote coordinate validation fraud through secure browser integrations.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Live Tracking */}
            <div className="p-6.5 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 transition-all space-y-4">
              <div className="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/25 flex items-center justify-center text-primary-450">
                <ZapIcon size={20} />
              </div>
              <h4 className="font-semibold text-white">Live Tracking</h4>
              <p className="text-sm text-slate-400">
                Real-time tracking of Captains as they approach target zones, powered by high-speed Socket.IO socket rooms.
              </p>
            </div>

            {/* GPS Proximity Check */}
            <div className="p-6.5 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 transition-all space-y-4">
              <div className="w-10 h-10 rounded-lg bg-accent-500/10 border border-accent-500/25 flex items-center justify-center text-accent-400">
                <MapPinIcon size={20} />
              </div>
              <h4 className="font-semibold text-white">GPS Proximity Verification</h4>
              <p className="text-sm text-slate-400">
                Calculates live distance using Haversine algorithm. Rejects submissions if Captain stands over 100 meters away from target.
              </p>
            </div>

            {/* Webcam Shutter Capture */}
            <div className="p-6.5 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 transition-all space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-450">
                <CameraIcon size={20} />
              </div>
              <h4 className="font-semibold text-white">In-App Camera Viewfinder</h4>
              <p className="text-sm text-slate-400">
                Requires direct browser webcam access to take a photo. Prevents file spoofing, and logs GPS coords at the capture millisecond.
              </p>
            </div>

            {/* Neon DB & Prisma ORM */}
            <div className="p-6.5 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 transition-all space-y-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-450">
                <ClipboardIcon size={20} />
              </div>
              <h4 className="font-semibold text-white">Serverless Database</h4>
              <p className="text-sm text-slate-400">
                Backed by Neon Serverless PostgreSQL with atomic transaction controls preventing double-acceptance of jobs.
              </p>
            </div>

            {/* Interactive Leaflet Maps */}
            <div className="p-6.5 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 transition-all space-y-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-450">
                <CompassIcon size={20} />
              </div>
              <h4 className="font-semibold text-white">Interactive Leaflet Map</h4>
              <p className="text-sm text-slate-400">
                Pin target locations easily using full integration of OpenStreetMap tiles. Fully customized markers and radius indicators.
              </p>
            </div>

            {/* Role-Based JWT Auth */}
            <div className="p-6.5 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 transition-all space-y-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-450">
                <UserIcon size={20} />
              </div>
              <h4 className="font-semibold text-white">Secure Access Controls</h4>
              <p className="text-sm text-slate-400">
                Complete Role-Based Access Control (RBAC) separating Requester Users and local Captains. Safe bcrypt hash password security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portals Details */}
      <section id="benefits" className="py-20 border-t border-slate-900 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-semibold text-primary-500 uppercase tracking-widest">Portals</h2>
            <h3 className="text-3xl font-bold text-white sm:text-4xl">Tailored portals for dual roles</h3>
            <p className="text-slate-400">Explore the dedicated interfaces built for different validation tasks.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Portal */}
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-850 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="inline-flex px-3 py-1 bg-primary-500/10 border border-primary-500/25 text-xs text-primary-400 font-semibold rounded-full uppercase">
                  For Requesters
                </div>
                <h4 className="text-2xl font-bold text-white">The User Workspace</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Perfect for property managers, logistics coordinators, utility companies, or surveyors. Easily dispatch verification jobs by pinning target locations on maps, specifying instructions, and managing submissions.
                </p>
                <ul className="space-y-3.5 text-sm text-slate-350">
                  <li className="flex items-center gap-2.5">
                    <span className="text-primary-500">✓</span> Drag-and-drop location pinning on high accuracy maps
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-primary-500">✓</span> Live location radar tracking of Captains
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-primary-500">✓</span> Final verification review and completion controls
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="mt-8 block w-full py-3 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl text-center shadow-lg transition-colors"
              >
                Register as Requester User
              </Link>
            </div>

            {/* Captain Portal */}
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-850 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="inline-flex px-3 py-1 bg-accent-500/10 border border-accent-500/25 text-xs text-accent-400 font-semibold rounded-full uppercase">
                  For Local Captains
                </div>
                <h4 className="text-2xl font-bold text-white">The Captain Workspace</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Tailored for gig workers, field surveyors, and local guides. Discover jobs near you, accept them, trigger active navigation, enable safe GPS tracking, and capture physical photo proof on-site.
                </p>
                <ul className="space-y-3.5 text-sm text-slate-350">
                  <li className="flex items-center gap-2.5">
                    <span className="text-accent-500">✓</span> Real-time available tasks dashboard
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-accent-500">✓</span> HTML5 camera viewfinder built directly into the web browser
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-accent-500">✓</span> Live telemetry checking distance metrics in real-time
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="mt-8 block w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-center shadow-lg transition-colors"
              >
                Join as Local Captain
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section id="faqs" className="py-20 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-xs font-semibold text-primary-500 uppercase tracking-widest">Questions</h2>
            <h3 className="text-3xl font-bold text-white sm:text-4xl">Frequently Asked Questions</h3>
            <p className="text-slate-400">Got questions about location verification? We've got answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-slate-900/40 border border-slate-900 rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-medium text-white hover:bg-slate-900/80 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDownIcon
                      className={`w-5 h-5 text-slate-450 transition-transform duration-250 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-slate-450 leading-relaxed border-t border-slate-950/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="relative py-24 border-t border-slate-900 overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative">
          <h3 className="text-3xl font-bold text-white sm:text-4xl leading-tight">
            Ready to secure location verification?
          </h3>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            Create an account in less than two minutes. Dispatch location verification tasks or accept open jobs as a Captain.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-98"
            >
              Sign Up Free
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-200 font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-98"
            >
              Access Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight text-white">InstantLocate</span>
          </div>

          <div>
            &copy; {new Date().getFullYear()} InstantLocate. All rights reserved. Secure Physical GPS Location Verification Platform.
          </div>
        </div>
      </footer>
    </div>
  );
}
