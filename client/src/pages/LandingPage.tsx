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
  const [demoStep, setDemoStep] = useState(0);

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

  const demoSteps = [
    {
      title: "1. Pin Coordinates",
      desc: "User creates a request with coordinates (e.g. 12.9716° N, 77.5946° E) and instructions.",
      badge: "Pending Accept",
      badgeClass: "bg-zinc-800 text-zinc-300 border-zinc-700",
      status: "OPEN",
    },
    {
      title: "2. Captain Dispatched",
      desc: "Captain John accepts the task. Live tracking starts via WebSockets.",
      badge: "Captain Dispatched",
      badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/25",
      status: "ACCEPTED",
    },
    {
      title: "3. Proximity Handshake",
      desc: "Captain arrives on-site. System computes proximity at 12m (within 100m radius limit).",
      badge: "In Proximity Range",
      badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/25",
      status: "IN_PROGRESS",
    },
    {
      title: "4. Tamper-Proof Evidence",
      desc: "Direct camera snap locks GPS coordinates. Photo submitted and verified.",
      badge: "Completed & Verified",
      badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
      status: "COMPLETED",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-primary-500 selection:text-white overflow-x-hidden font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-bold text-[15px] tracking-tight text-white">InstantLocate</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-zinc-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#portals" className="hover:text-white transition-colors">Portals</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-[13px] font-semibold text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-[12.5px] font-bold bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[11px] font-bold text-primary-400">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-500"></span>
            </span>
            OPERATIONAL VERIFICATION PLATFORM
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.15] tracking-tight max-w-4xl mx-auto">
            Secure, On-Demand Physical <br />
            Location Verification
          </h1>

          <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Verify real estate assets, remote events, or logistics milestones. Pin coordinates, track local Captains live via WebSockets, and lock proof with location-fenced webcam signatures.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3 bg-white text-zinc-950 hover:bg-zinc-100 font-bold rounded-lg transition-all shadow-sm text-[13px] text-center"
            >
              Request a Location Audit
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 font-bold rounded-lg transition-all shadow-sm text-[13px] text-center"
            >
              Become a Verification Captain
            </Link>
          </div>

          {/* Key metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16 max-w-4xl mx-auto border-t border-zinc-900 text-center">
            <div>
              <div className="text-2xl font-bold text-white tabular-nums">100m</div>
              <div className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-wider">GPS Fence Radius</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white tabular-nums">Live</div>
              <div className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-wider">WebSocket Coordinates</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white tabular-nums">100%</div>
              <div className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-wider">Native Camera Capture</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white tabular-nums">Audit</div>
              <div className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-wider">Tamper-Proof Trails</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 border-t border-zinc-900 bg-zinc-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">Platform Flow</h2>
            <h3 className="text-2xl font-bold text-white sm:text-3xl tracking-tight">Simple Operational Loop</h3>
            <p className="text-zinc-400 text-sm">How InstantLocate bridges digital audits and field operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 transition-all space-y-4">
              <div className="w-9 h-9 rounded-lg bg-primary-500/10 border border-primary-500/30 text-primary-400 flex items-center justify-center font-bold text-[13px]">
                01
              </div>
              <h4 className="text-[14px] font-bold text-white">Pin Target Coordinates</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Specify coordinate bounds and verification instructions. Dispatch jobs immediately to nearby certified verification agents.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 transition-all space-y-4">
              <div className="w-9 h-9 rounded-lg bg-primary-500/10 border border-primary-500/30 text-primary-400 flex items-center justify-center font-bold text-[13px]">
                02
              </div>
              <h4 className="text-[14px] font-bold text-white">Live Tracking Streams</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Watch Captains route on interactive vector maps. Keep tabs on delivery status and operational coordinates in real-time.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 transition-all space-y-4">
              <div className="w-9 h-9 rounded-lg bg-primary-500/10 border border-primary-500/30 text-primary-400 flex items-center justify-center font-bold text-[13px]">
                03
              </div>
              <h4 className="text-[14px] font-bold text-white">GPS-Fenced Shutter Lock</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Native browser webcam snap validates true presence within 100 meters. Prevents upload spoofing with secure geolocation stamps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Simulation Section */}
      <section id="demo" className="py-16 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">Simulator</h2>
            <h3 className="text-2xl font-bold text-white sm:text-3xl tracking-tight">Interactive Verification Demo</h3>
            <p className="text-zinc-400 text-sm">Click through the steps below to see our security engine in action.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Steps Left Panel */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
              {demoSteps.map((step, idx) => {
                const isActive = demoStep === idx;
                const isCompleted = demoStep > idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDemoStep(idx)}
                    className={`text-left p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-zinc-900/60 border-zinc-700 shadow-sm"
                        : "bg-zinc-950 border-zinc-900 hover:border-zinc-850 hover:bg-zinc-900/25"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[12.5px] font-bold ${isActive ? "text-primary-400" : isCompleted ? "text-emerald-400" : "text-zinc-400"}`}>
                        {step.title}
                      </span>
                      {isCompleted && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <p className="text-[11.5px] text-zinc-450 mt-1 leading-normal">{step.desc}</p>
                  </button>
                );
              })}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setDemoStep((d) => (d > 0 ? d - 1 : 3))}
                  className="flex-1 py-2 text-center text-xs border border-zinc-800 hover:bg-zinc-900 rounded-lg text-zinc-300 font-semibold cursor-pointer"
                >
                  Prev
                </button>
                <button
                  onClick={() => setDemoStep((d) => (d < 3 ? d + 1 : 0))}
                  className="flex-1 py-2 text-center text-xs bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Next Step
                </button>
              </div>
            </div>

            {/* Simulated Workspace View Right Panel */}
            <div className="lg:col-span-7 flex flex-col min-h-[300px]">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex-1 flex flex-col shadow-card">
                {/* Mock header */}
                <div className="px-4 py-3 bg-zinc-950/80 border-b border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                    <span className="text-[10px] font-mono text-zinc-400">TAS-9821 / Bangalore South</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[9px] font-bold border rounded-full uppercase tracking-wider ${demoSteps[demoStep].badgeClass}`}>
                    {demoSteps[demoStep].badge}
                  </span>
                </div>

                {/* Mock view body */}
                <div className="flex-1 p-5 flex flex-col justify-between bg-zinc-900/60 relative">
                  {demoStep === 0 && (
                    <div className="space-y-4 my-auto text-center">
                      <div className="w-10 h-10 rounded-lg bg-zinc-950/50 border border-zinc-850 flex items-center justify-center text-zinc-400 mx-auto">
                        <MapPinIcon size={18} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[12.5px] font-bold text-white">Target Coordinate Placed</p>
                        <p className="text-[11px] text-zinc-400 max-w-sm mx-auto">
                          GPS fence boundary initialized. Waiting for Captain dispatch signature check.
                        </p>
                      </div>
                    </div>
                  )}

                  {demoStep === 1 && (
                    <div className="space-y-4 my-auto">
                      <div className="flex items-center gap-3 p-3 bg-zinc-950/40 border border-zinc-850 rounded-lg">
                        <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs font-bold">
                          J
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11.5px] font-bold text-white leading-tight">Captain John Smith</p>
                          <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">Rider telemetry routing en-route</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 justify-center text-[10.5px] text-blue-450 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-soft" />
                        Live streaming coordinates via Socket.IO
                      </div>
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="space-y-3 my-auto">
                      <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-amber-400 uppercase">Proximity Gate</span>
                          <span className="text-[14px] font-bold font-mono text-amber-400">12 meters</span>
                        </div>
                        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 w-[94%]" />
                        </div>
                      </div>
                      <p className="text-[10.5px] text-zinc-400 text-center">
                        Validation status: <strong className="text-white font-semibold">Ready for camera capture</strong>
                      </p>
                    </div>
                  )}

                  {demoStep === 3 && (
                    <div className="space-y-4 my-auto text-center">
                      <div className="relative w-32 aspect-video rounded-lg overflow-hidden border border-zinc-800 bg-black mx-auto">
                        <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                          <CameraIcon size={20} className="text-emerald-400" />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/60 px-1 py-0.5 rounded text-[8px] font-mono text-emerald-400">
                          GPS Locked
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[12px] font-bold text-emerald-400">Audit Trail Signed</p>
                        <p className="text-[10.5px] text-zinc-400">
                          Task complete. Haversine check verified successfully.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Mock telemetry footer */}
                  <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[9px] font-mono text-zinc-500">
                    <span>GPS ACCURACY: ±3.4M</span>
                    <span>LATENCY: 42MS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section id="features" className="py-16 border-t border-zinc-900 bg-zinc-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">Platform Core</h2>
            <h3 className="text-2xl font-bold text-white sm:text-3xl tracking-tight">Engineered for Operational Trust</h3>
            <p className="text-zinc-400 text-sm">Eliminating physical validation fraud through secure browser telemetry APIs.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-lg bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 transition-all space-y-3">
              <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/25 flex items-center justify-center text-primary-400">
                <ZapIcon size={16} />
              </div>
              <h4 className="text-[13.5px] font-bold text-white">Live Tracking</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Stream real-time coordinate logs between local field agents and dispatchers with sub-100ms socket updates.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 transition-all space-y-3">
              <div className="w-8 h-8 rounded-lg bg-accent-500/10 border border-accent-500/25 flex items-center justify-center text-accent-400">
                <MapPinIcon size={16} />
              </div>
              <h4 className="text-[13.5px] font-bold text-white">Haversine Gating</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Rigorous client and server coordinate gatekeeping rejects any photo upload triggered outside the 100m target buffer.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 transition-all space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                <CameraIcon size={16} />
              </div>
              <h4 className="text-[13.5px] font-bold text-white">Hardware Shutter Lock</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Integrates HTML5 camera feeds directly, locking live image frames and coordinates to prevent gallery injection spoofing.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 transition-all space-y-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-500/10 border border-zinc-800 flex items-center justify-center text-zinc-400">
                <ClipboardIcon size={16} />
              </div>
              <h4 className="text-[13.5px] font-bold text-white">Verification Timeline</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Clean audit trails document task creation, acceptance milestones, telemetry logs, and final requester verification status.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 transition-all space-y-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-500/10 border border-zinc-800 flex items-center justify-center text-zinc-400">
                <CompassIcon size={16} />
              </div>
              <h4 className="text-[13.5px] font-bold text-white">Interactive Maps</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Drop target location coordinates using sharp, customized vector leaflet pins on top of OpenStreetMap vector tiles.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 transition-all space-y-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-500/10 border border-zinc-800 flex items-center justify-center text-zinc-400">
                <UserIcon size={16} />
              </div>
              <h4 className="text-[13.5px] font-bold text-white">Role Portal Silos</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Complete separation of roles via JWT session signatures, ensuring strict workflow paths for requesters and captains.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portals Details */}
      <section id="portals" className="py-16 border-t border-zinc-900 bg-zinc-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">Workspace</h2>
            <h3 className="text-2xl font-bold text-white sm:text-3xl tracking-tight">Dedicated Portals</h3>
            <p className="text-zinc-400 text-sm">Targeted operational screens tailored for specific roles.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Portal */}
            <div className="p-6 rounded-lg bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex px-2 py-0.5 bg-primary-500/10 border border-primary-500/25 text-[9px] text-primary-400 font-bold rounded-full uppercase tracking-wider">
                  Requesters
                </div>
                <h4 className="text-lg font-bold text-white">The Dispatcher Portal</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Pin target coordinates, specify location audit scopes, route local captains live, and manage evidence sheets from a centralized dashboard.
                </p>
                <ul className="space-y-2.5 text-xs text-zinc-350">
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span> Drag-and-pin coordinate selection
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span> Live Socket.IO geolocation updates on active tasks
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span> High-res verification photo review cards
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="mt-6 block w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg text-xs text-center shadow-sm"
              >
                Sign Up as Requester
              </Link>
            </div>

            {/* Captain Portal */}
            <div className="p-6 rounded-lg bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex px-2 py-0.5 bg-accent-500/10 border border-accent-500/25 text-[9px] text-accent-400 font-bold rounded-full uppercase tracking-wider">
                  Verification Captains
                </div>
                <h4 className="text-lg font-bold text-white">The Captain Portal</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Browse tasks within your area, accept verification requests, activate live tracking, and upload tamper-proof camera proofs directly on location.
                </p>
                <ul className="space-y-2.5 text-xs text-zinc-350">
                  <li className="flex items-center gap-2">
                    <span className="text-accent-500">✓</span> Real-time available location job sheets
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-accent-500">✓</span> Live distance proximity telemetry gauge
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-accent-500">✓</span> In-app hardware webcam capture block
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="mt-6 block w-full py-2.5 bg-zinc-800 hover:bg-zinc-750 text-white font-bold rounded-lg text-xs text-center border border-zinc-700 shadow-sm"
              >
                Join as Local Captain
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="py-16 border-t border-zinc-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">FAQ</h2>
            <h3 className="text-2xl font-bold text-white sm:text-3xl tracking-tight">Common Questions</h3>
            <p className="text-zinc-400 text-sm">Got questions about location verification? We've got answers.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-zinc-900/20 border border-zinc-900 rounded-lg overflow-hidden transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-white hover:bg-zinc-900/30 transition-colors text-xs cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-[11.5px] text-zinc-400 leading-relaxed border-t border-zinc-950/20">
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
      <section className="relative py-20 border-t border-zinc-900 text-center bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative">
          <h3 className="text-2xl font-bold text-white sm:text-3xl tracking-tight leading-none">
            Ready to secure location verification?
          </h3>
          <p className="text-zinc-400 text-xs max-w-xl mx-auto leading-relaxed">
            Create an account in less than two minutes. Dispatch location verification tasks or accept open jobs as a Captain.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg text-xs transition-all shadow-sm"
            >
              Sign Up Free
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 font-bold rounded-lg text-xs transition-all shadow-sm"
            >
              Access Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-10 text-zinc-500 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-bold text-xs tracking-tight text-white">InstantLocate</span>
          </div>

          <div>
            &copy; {new Date().getFullYear()} InstantLocate. Secure GPS Location Verification.
          </div>
        </div>
      </footer>
    </div>
  );
}
