import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CompassIcon,
  MapPinIcon,
  CameraIcon,
  ZapIcon,
  ClipboardIcon,
  ChevronDownIcon,
  UserIcon,
} from "../../components/Icons";

export function RequesterLandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Simulation State
  const [simStep, setSimStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [shutterFlash, setShutterFlash] = useState<boolean>(false);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const useCases = [
    {
      title: "Property Buyers",
      desc: "Verify site status and check boundaries before paying a token amount.",
    },
    {
      title: "NRIs",
      desc: "Inspect inherited land or potential investments without flying to India.",
    },
    {
      title: "Construction Monitoring",
      desc: "Track construction progress stages remotely with visual proof.",
    },
    {
      title: "Land Verification",
      desc: "Confirm road access, boundary walls, and surroundings.",
    },
    {
      title: "Business Verification",
      desc: "Verify office frontages, local shops, and commercial listings.",
    },
  ];

  const faqs = [
    {
      q: "How do you guarantee the photos are taken at the correct location?",
      a: "We compare the inspector's real-time GPS position with the property's coordinates. The inspector must be physically present at the property to capture and submit photos. Uploading pre-saved files or camera-roll images is blocked.",
    },
    {
      q: "Do I need to download or install an app?",
      a: "No. Our system works directly inside any standard mobile web browser. The inspector visits the site, opens the task link, and captures photos using our secure browser camera.",
    },
    {
      q: "How can I track the inspection in real time?",
      a: "As soon as an inspector is assigned and starts traveling, you can watch their progress live on a map in your dashboard.",
    },
    {
      q: "What happens if no inspector accepts my request?",
      a: "If a task remains unassigned after 24 hours, we increase the payout to attract inspectors. In the rare event that no inspector accepts the task within 48 hours, you will receive a full, automatic refund.",
    },
  ];

  const SIM_STEPS = [
    {
      label: "Request Created",
      desc: "Target property marked and inspection guidelines saved.",
      badge: "✓ Location marked",
      icon: MapPinIcon
    },
    {
      label: "Inspector Assigned",
      desc: "Nearby verified inspector accepts the task.",
      badge: "✓ Inspector verified",
      icon: UserIcon
    },
    {
      label: "Traveling to Location",
      desc: "Watch the inspector navigate toward the property in real-time.",
      badge: "✓ Live travel active",
      icon: ZapIcon
    },
    {
      label: "Location Reached",
      desc: "Inspector arrives at the target site.",
      badge: "✓ On-site confirmed",
      icon: CompassIcon
    },
    {
      label: "Photos Captured",
      desc: "Live, on-site photos snapped using our secure camera.",
      badge: "✓ Real-time camera verified",
      icon: CameraIcon
    },
    {
      label: "Verification Complete",
      desc: "Watermarked proof report delivered to your dashboard.",
      badge: "✓ Report delivered",
      icon: ClipboardIcon
    }
  ];

  // Auto-play / simulation controller
  useEffect(() => {
    if (!isPlaying) return;
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (simStep === 0) {
      timer = setTimeout(() => setSimStep(1), 2200);
    } else if (simStep === 1) {
      timer = setTimeout(() => {
        setSimStep(2);
        setProgress(0);
      }, 2200);
    } else if (simStep === 2) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 1) {
            clearInterval(interval);
            setSimStep(3);
            return 1;
          }
          return prev + 0.025; // Animate transit progress
        });
      }, 100);
      return () => clearInterval(interval);
    } else if (simStep === 3) {
      timer = setTimeout(() => {
        setSimStep(4);
        setShutterFlash(true);
        setTimeout(() => setShutterFlash(false), 300);
      }, 3000);
    } else if (simStep === 4) {
      timer = setTimeout(() => setSimStep(5), 3200);
    } else if (simStep === 5) {
      timer = setTimeout(() => {
        setSimStep(0);
        setProgress(0);
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, simStep]);

  let statusText = "";
  let activeBadge = "";
  let badgeLabel = "";
  let cx = 80;
  let cy = 80;

  if (simStep === 0) {
    statusText = "Awaiting inspector assignment.";
    badgeLabel = "Request Created";
    activeBadge = "bg-surface-150 text-surface-600 border-surface-300";
  } else if (simStep === 1) {
    statusText = "Inspector assigned and reviewing task.";
    badgeLabel = "Inspector Assigned";
    activeBadge = "bg-blue-50 text-blue-700 border-blue-200 animate-pulse-soft";
  } else if (simStep === 2) {
    statusText = "Inspector is traveling to the location.";
    badgeLabel = "En Route";
    activeBadge = "bg-amber-50 text-amber-700 border-amber-200 animate-pulse-soft";

    if (progress <= 0.373) {
      const r = progress / 0.373;
      cx = Math.round(80 + r * 160);
      cy = 80;
    } else if (progress <= 0.701) {
      const r = (progress - 0.373) / (0.701 - 0.373);
      cx = 240;
      cy = Math.round(80 + r * 140);
    } else {
      const r = (progress - 0.701) / (1 - 0.701);
      cx = Math.round(240 + r * 128);
      cy = 220;
    }
  } else {
    statusText = simStep === 3 ? "Inspector has arrived at the property." : simStep === 4 ? "Capturing verified site photos." : "Verification report compiled and sealed.";
    badgeLabel = simStep === 3 ? "Arrived" : simStep === 4 ? "Snapping Photos" : "Completed";
    cx = 368;
    cy = 220;

    if (simStep === 3) {
      activeBadge = "bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse-soft";
    } else if (simStep === 4) {
      activeBadge = "bg-emerald-500 text-white border-emerald-600";
    } else {
      activeBadge = "bg-emerald-600 text-white border-emerald-700";
    }
  }

  return (
    <div className="min-h-screen bg-surface-50 text-surface-900 font-sans selection:bg-primary-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-200/80">
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

          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-surface-650">
            <a href="#use-cases" className="hover:text-surface-900 transition-colors">Perfect For</a>
            <a href="#how-it-works" className="hover:text-surface-900 transition-colors">How It Works</a>
            <a href="#report" className="hover:text-surface-900 transition-colors">Example Report</a>
            <a href="#demo" className="hover:text-surface-900 transition-colors">Live Demo</a>
            <Link to="/pricing" className="hover:text-surface-900 transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-[13px] font-semibold text-surface-600 hover:text-surface-900 px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/verify/signup"
              className="text-[12.5px] font-bold bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm"
            >
              Request Inspection
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-surface-900 tracking-tight leading-[1.1]">
            Get On-Site Property Verification. <br />
            Without Traveling.
          </h1>

          <p className="text-sm md:text-base text-surface-600 max-w-2xl mx-auto leading-relaxed">
            NRI property checks, vacant land audits, and construction progress milestones verified on-site by trusted local inspectors.
          </p>

          <div className="flex items-center justify-center pt-3">
            <Link
              to="/verify/signup"
              className="px-8 py-3.5 bg-surface-900 hover:bg-surface-950 text-white font-bold rounded-lg transition-all shadow-md text-[13px] text-center"
            >
              Request an Inspection
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 pt-8 text-xs font-semibold text-surface-600">
            <span className="flex items-center gap-1.5">✓ On-site verification guarantee</span>
            <span className="flex items-center gap-1.5">✓ Real-time travel tracking</span>
            <span className="flex items-center gap-1.5">✓ Timestamped PDF reports</span>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-16 border-t border-surface-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">Perfect For</h2>
            <h3 className="text-2xl font-bold text-surface-900 tracking-tight mt-1">Simple Remote Inspections</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {useCases.map((uc, index) => (
              <div key={index} className="p-5 bg-surface-50 border border-surface-200 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-surface-900">{uc.title}</h4>
                <p className="text-[11px] text-surface-550 leading-relaxed font-normal">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 border-t border-surface-200 bg-surface-100/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">How It Works</h2>
            <h3 className="text-2xl font-bold text-surface-900 tracking-tight mt-1">Get Verification in 3 Steps</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary-600 block">01 / Mark Location</span>
              <p className="text-xs text-surface-650 leading-relaxed">
                Drop a pin on our map and submit specific photos or guidelines you need checked.
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary-600 block">02 / Live Tracking</span>
              <p className="text-xs text-surface-650 leading-relaxed">
                A verified inspector accepts the task. Watch their progress on a live map as they travel to the site.
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary-600 block">03 / Get Proof</span>
              <p className="text-xs text-surface-650 leading-relaxed">
                Receive on-site verified photos and summary details delivered directly to your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Verification Report */}
      <section id="report" className="py-16 border-t border-surface-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">Example Deliverable</h2>
            <h3 className="text-2xl font-bold text-surface-900 tracking-tight">What You Will Receive</h3>
            <p className="text-xs text-surface-500">Every inspection generates a clean verification certificate containing verified photos and notes.</p>
          </div>

          <div className="border border-surface-250 bg-white shadow-elevated rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-surface-200 pb-4">
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-surface-450 bg-surface-100 px-2 py-0.5 rounded">
                  Verification Report
                </span>
                <h4 className="text-sm font-bold text-surface-900">Bangalore South Plot Check</h4>
              </div>
              <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full">
                ✓ VERIFIED
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[9px] font-bold text-surface-400 block uppercase">Inspection Date</span>
                <span className="font-semibold text-surface-900">May 12, 2026</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-surface-400 block uppercase">Photos Captured</span>
                <span className="font-semibold text-surface-900">12 Verified Photos</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-surface-400 block uppercase">Accuracy</span>
                <span className="font-semibold text-surface-900 text-emerald-600 font-bold">100% On-Site</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-surface-400 block uppercase">Inspector Name</span>
                <span className="font-semibold text-surface-900">John S. (ID Verified)</span>
              </div>
            </div>

            <hr className="border-surface-200" />

            <div className="space-y-3">
              <h5 className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">Inspector Notes</h5>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <p className="text-surface-700">**Road Access**: Asphalt road access present.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <p className="text-surface-700">**Boundary Wall**: Brick boundary walls are intact on all sides.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <p className="text-surface-700">**No Encroachments**: Clear visual checks confirm no encroachments or temporary structures exist on the plot.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demonstration */}
      <section id="demo" className="py-20 border-t border-surface-200 bg-surface-100/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-primary-600 uppercase bg-primary-50 px-2.5 py-1 rounded-full">
                Interactive Demonstration
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-surface-900 mt-3 sm:text-4xl">
                Real-Time Verification Story
              </h2>
              <p className="text-surface-650 text-sm max-w-xl mt-1">
                What happens after you submit a request.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-surface-200 p-1 rounded-xl border border-surface-300 w-fit">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 bg-white text-surface-900 rounded-lg hover:bg-surface-50 shadow-sm border border-surface-200 transition-all cursor-pointer flex items-center justify-center"
              >
                {isPlaying ? (
                  <svg className="w-4 h-4 fill-current text-surface-700" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 fill-current text-primary-600" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSimStep(0);
                  setProgress(0);
                }}
                className="p-2 text-surface-700 hover:text-surface-900 hover:bg-surface-300 rounded-lg transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Simulation Timeline */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-6 bg-surface-50 border border-surface-200/80 p-5 rounded-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-surface-200 pb-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-surface-500">
                    Inspector Journey
                  </h3>
                </div>

                <div className="relative pl-6 border-l border-surface-200/80 space-y-4 pt-1">
                  {SIM_STEPS.map((step, idx) => {
                    const isCompleted = simStep > idx;
                    const isActive = simStep === idx;
                    const StepIcon = step.icon;

                    return (
                      <div key={idx} className="relative group transition-all duration-300">
                        <div
                          className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 z-10 ${isCompleted
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : isActive
                                ? "bg-primary-600 border-primary-600 text-white ring-4 ring-primary-100 shadow-sm"
                                : "bg-white border-surface-300 text-surface-400"
                            }`}
                        >
                          {isCompleted ? (
                            <svg className="w-3 h-3 fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <StepIcon size={11} className={isActive ? "text-white animate-pulse-soft" : "text-surface-400"} />
                          )}
                        </div>

                        <div className={`space-y-0.5 ${isActive ? "opacity-100 scale-[1.01]" : "opacity-60"} transition-all duration-350`}>
                          <h4 className={`text-[12px] font-bold tracking-tight ${isActive ? "text-primary-750" : "text-surface-900"}`}>
                            {step.label}
                          </h4>
                          <p className="text-[10px] text-surface-600 leading-normal font-normal">
                            {step.desc}
                          </p>
                          {(isActive || isCompleted) && (
                            <div className="inline-flex items-center px-1.5 py-0.5 mt-1 bg-emerald-50 border border-emerald-200 text-[8.5px] font-bold text-emerald-750 rounded">
                              {step.badge}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Map Visual Panel */}
            <div className="lg:col-span-8 flex flex-col relative min-h-[400px] bg-slate-50 border border-surface-200 rounded-xl overflow-hidden shadow-elevated">
              <div className="px-4 py-3 bg-white border-b border-surface-200 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-bold text-surface-900">VERIFICATION IN PROGRESS</span>
                    <span className="text-[9px] font-mono text-surface-450 mt-0.5 leading-none">
                      {statusText}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 text-[9px] font-black border rounded-full uppercase tracking-wider transition-all ${activeBadge}`}>
                    {badgeLabel}
                  </span>
                </div>
              </div>

              <div className="flex-1 relative overflow-hidden bg-white select-none">
                <svg className="w-full h-full min-h-[320px] absolute inset-0" viewBox="0 0 500 350" fill="none">
                  <defs>
                    <pattern id="mapGrid" width="35" height="35" patternUnits="userSpaceOnUse">
                      <path d="M 35 0 L 0 0 0 35" fill="none" stroke="oklch(0.93 0.01 250 / 0.7)" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#mapGrid)" />

                  {/* Roads */}
                  <line x1="20" y1="80" x2="480" y2="80" stroke="oklch(0.93 0.01 250)" strokeWidth="8" strokeLinecap="round" />
                  <line x1="20" y1="80" x2="480" y2="80" stroke="oklch(0.96 0.008 250)" strokeWidth="4" strokeLinecap="round" />
                  <line x1="240" y1="40" x2="240" y2="310" stroke="oklch(0.93 0.01 250)" strokeWidth="8" strokeLinecap="round" />
                  <line x1="240" y1="40" x2="240" y2="310" stroke="oklch(0.96 0.008 250)" strokeWidth="4" strokeLinecap="round" />
                  <line x1="20" y1="220" x2="480" y2="220" stroke="oklch(0.93 0.01 250)" strokeWidth="8" strokeLinecap="round" />
                  <line x1="20" y1="220" x2="480" y2="220" stroke="oklch(0.96 0.008 250)" strokeWidth="4" strokeLinecap="round" />

                  {/* Travel trail */}
                  {simStep >= 1 && (
                    <path
                      d={`M 80 80 L ${cx < 240 ? cx : 240} ${cy < 80 ? cy : 80} L 240 ${cy < 220 ? cy : 220} L ${cx} ${cy}`}
                      fill="none"
                      stroke="oklch(0.55 0.2 250)"
                      strokeWidth="2.5"
                      strokeDasharray="4 3"
                      strokeLinecap="round"
                    />
                  )}

                  {/* On-Site Boundary area */}
                  <circle
                    cx="380"
                    cy="220"
                    r="55"
                    className={`transition-all duration-300 ${simStep >= 3
                        ? "stroke-emerald-500 fill-emerald-500/5 stroke-[2] animate-pulse-soft"
                        : "stroke-primary-500 fill-primary-500/5 stroke-[1.5] stroke-dasharray-[4_4]"
                      }`}
                  />

                  {/* Target Pin */}
                  <g transform="translate(380, 220)">
                    <ellipse cx="0" cy="4" rx="6" ry="2.5" className="fill-slate-900/10 stroke-none" />
                    <path
                      d="M0 -14 C-5 -14 -9 -10 -9 -5 C-9 1 -2 9 0 11 C2 9 9 1 9 -5 C9 -10 5 -14 0 -14 Z"
                      className={`transition-colors duration-300 ${simStep >= 3 ? "fill-emerald-600" : "fill-primary-600"
                        }`}
                    />
                    <circle cx="0" cy="-5" r="3" fill="white" />
                  </g>

                  {/* Inspector marker */}
                  {simStep >= 1 && (
                    <g transform={`translate(${cx}, ${cy})`} className="transition-transform duration-100 ease-out">
                      <circle cx="0" cy="0" r="14" className="fill-white stroke-primary-600 stroke-[2] shadow-sm animate-pulse-soft" />
                      <circle cx="0" cy="0" r="11" fill="oklch(0.55 0.2 250)" />
                      <text x="0" y="3.5" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">J</text>
                    </g>
                  )}
                </svg>

                {/* Viewfinder Overlay */}
                {simStep >= 4 && (
                  <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center animate-fade-in p-6 z-20">
                    <div className="relative w-full max-w-[340px] aspect-[4/3] rounded-xl border border-emerald-500/80 overflow-hidden bg-slate-900 shadow-elevated">
                      <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                        <svg className="w-16 h-16 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>

                      <div className="absolute top-3 left-3 border-t-2 border-l-2 border-emerald-400 w-5 h-5" />
                      <div className="absolute top-3 right-3 border-t-2 border-r-2 border-emerald-400 w-5 h-5" />
                      <div className="absolute bottom-3 left-3 border-b-2 border-l-2 border-emerald-400 w-5 h-5" />
                      <div className="absolute bottom-3 right-3 border-b-2 border-r-2 border-emerald-400 w-5 h-5" />

                      <div className="absolute top-3.5 left-4 flex items-center gap-1.5 text-[9px] font-bold font-mono text-emerald-400 tracking-wider">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse-soft" />
                        LIVE CAMERA
                      </div>
                      <div className="absolute top-3.5 right-4 text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/20">
                        LOCATION MATCHED
                      </div>

                      <div className="absolute bottom-3.5 left-4 right-4 bg-slate-950/85 backdrop-blur-md p-2 rounded border border-slate-800 text-[8.5px] font-mono text-emerald-400/90 space-y-0.5">
                        <div className="flex justify-between">
                          <span>LOCATION: ON-SITE PROPERTY BOUNDARY</span>
                          <span className="text-emerald-500">TRUSTED</span>
                        </div>
                        <div className="flex justify-between">
                          <span>DATE: {new Date().toLocaleDateString()}</span>
                          <span>SOURCE: SECURED CAMERA</span>
                        </div>
                      </div>

                      {shutterFlash && <div className="absolute inset-0 bg-white z-50 animate-fade-out" />}

                      {simStep === 5 && (
                        <div className="absolute inset-0 bg-emerald-950/30 flex items-center justify-center z-10 animate-scale-in">
                          <div className="bg-emerald-500 text-white font-black px-4 py-2 rounded-xl text-xs border-2 border-white shadow-elevated flex items-center gap-1.5 transform -rotate-6">
                            ✓ PROOF SEALED
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 border-t border-surface-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <div className="text-center">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">Trust Indicators</h2>
            <h3 className="text-2xl font-bold text-surface-900 tracking-tight mt-1">Why People Trust InstantLocate</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-surface-700 max-w-2xl mx-auto">
            <div className="flex items-start gap-2.5 p-3 rounded-lg border border-surface-150">
              <span className="text-primary-600 font-bold">✓</span>
              <div>
                <span className="font-bold text-surface-900 block">Photos captured strictly on-site</span>
                <span className="text-surface-500">Camera lock prevents uploading library/fake files.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-lg border border-surface-150">
              <span className="text-primary-600 font-bold">✓</span>
              <div>
                <span className="font-bold text-surface-900 block">Live progress tracking</span>
                <span className="text-surface-500">Watch the inspector transit to the site on your map.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-lg border border-surface-150">
              <span className="text-primary-600 font-bold">✓</span>
              <div>
                <span className="font-bold text-surface-900 block">Timestamped evidence</span>
                <span className="text-surface-500">Proof packages contain sealed date, time, and location marks.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-lg border border-surface-150">
              <span className="text-primary-600 font-bold">✓</span>
              <div>
                <span className="font-bold text-surface-900 block">Verification history</span>
                <span className="text-surface-500">All previous reports saved securely on your dashboard.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing CTA Banner Section */}
      <section className="py-16 border-t border-surface-200 bg-surface-100/30">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h3 className="text-xl font-bold text-surface-900">Simple, Transparent Pricing</h3>
          <p className="text-xs text-surface-600 max-w-md mx-auto">
            Verifications start at just ₹199 per property check. No subscription or recurring fees.
          </p>
          <div className="pt-2">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-lg shadow transition-colors"
            >
              See Pricing & Plans →
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-t border-surface-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-[10px] font-bold tracking-widest text-surface-400 uppercase">Trusted By</span>
          <div className="flex flex-wrap justify-center gap-3 text-[10.5px] font-bold text-surface-600">
            <span className="px-4 py-1.5 bg-surface-100 rounded-full">Property Buyers</span>
            <span className="px-4 py-1.5 bg-surface-100 rounded-full">NRIs</span>
            <span className="px-4 py-1.5 bg-surface-100 rounded-full">Investors</span>
            <span className="px-4 py-1.5 bg-surface-100 rounded-full">Construction Managers</span>
            <span className="px-4 py-1.5 bg-surface-100 rounded-full">Land Owners</span>
            <span className="px-4 py-1.5 bg-surface-100 rounded-full">Business Owners</span>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faq" className="py-16 border-t border-surface-200 bg-surface-100/20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">FAQ</h2>
            <h3 className="text-xl font-bold text-surface-900 tracking-tight mt-1">Pricing & Delivery FAQ</h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-surface-200/80 rounded-lg overflow-hidden transition-all duration-300 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-surface-900 hover:bg-surface-50 transition-colors text-xs cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-surface-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-[11.5px] text-surface-650 leading-relaxed border-t border-surface-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200 bg-surface-50 py-8 text-surface-500 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-bold text-xs tracking-tight text-surface-900">InstantLocate</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} InstantLocate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
