import { useState, useEffect, useRef } from "react";
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
  
  // Redesigned Simulator State
  const [simStep, setSimStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [shutterFlash, setShutterFlash] = useState<boolean>(false);
  const terminalContainerRef = useRef<HTMLDivElement | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "What is InstantLocate?",
      a: "InstantLocate is a secure remote inspection service that connects people who need locations verified (like NRIs, property buyers, or landowners) with trusted local inspectors (\"Captains\"). These inspectors visit the site, capture live, location-guaranteed photos, and deliver verified proof instantly.",
    },
    {
      q: "How do you guarantee the photos are taken at the correct location?",
      a: "We compare the inspector's real-time GPS position with the property's coordinates. Inspectors must be within 100 meters of the target area to snap and submit the photo, preventing any upload spoofing or location fraud.",
    },
    {
      q: "Do I need to download or install an app?",
      a: "No. InstantLocate works directly inside any standard mobile web browser. Inspectors simply open the link, grant temporary permission to use their device's camera and location services, and complete the inspection.",
    },
    {
      q: "How can I track the inspection in real time?",
      a: "As soon as a local inspector accepts your request and starts traveling, you can watch their progress live on a map in your dashboard, showing you exactly when they arrive at the property.",
    },
  ];

  const SIM_STEPS = [
    { label: "1. Created", desc: "Request placed, property coordinates locked." },
    { label: "2. Assigned", desc: "Local captain assigned to visit the site." },
    { label: "3. En Route", desc: "Watch the captain travel to the site live." },
    { label: "4. Arrived", desc: "Arrival verified at property boundary." },
    { label: "5. Capture", desc: "Camera captures secure on-site photo." },
    { label: "6. Verified", desc: "Verified proof sealed and delivered." }
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

  // Scroll terminal logs container internally (prevents page jump/scroll)
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [simStep, progress]);

  // Compute Telemetry values dynamically based on simStep and progress
  let distanceVal: string;
  let coordVal: string;
  let socketStatus: string;
  let cameraStatus: string;
  let hashVal: string;
  let activeBadge: string;
  let badgeLabel: string;
  
  // Captain position interpolation for SVG path
  let cx = 80;
  let cy = 80;
  
  if (simStep === 0) {
    distanceVal = "---";
    coordVal = "---";
    socketStatus = "Idle";
    cameraStatus = "Locked";
    hashVal = "Pending";
    badgeLabel = "Request Created";
    activeBadge = "bg-surface-150 text-surface-600 border-surface-300";
  } else if (simStep === 1) {
    distanceVal = "450m";
    coordVal = "12.9750° N, 77.5910° E";
    socketStatus = "Active";
    cameraStatus = "Locked";
    hashVal = "Pending";
    badgeLabel = "Captain Assigned";
    activeBadge = "bg-blue-50 text-blue-700 border-blue-200 animate-pulse-soft";
    cx = 80;
    cy = 80;
  } else if (simStep === 2) {
    const distanceValNum = Math.round(450 - progress * 438);
    distanceVal = `${distanceValNum}m`;
    const lat = (12.9750 - progress * 0.0034).toFixed(4);
    const lng = (77.5910 + progress * 0.0036).toFixed(4);
    coordVal = `${lat}° N, ${lng}° E`;
    socketStatus = "Live";
    cameraStatus = "Locked";
    hashVal = "Generating...";
    badgeLabel = `En Route (${distanceVal})`;
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
    distanceVal = "12m";
    coordVal = "12.9716° N, 77.5946° E";
    socketStatus = "Active";
    hashVal = simStep === 5 ? "0x3e18a...f8a2" : "Generating...";
    badgeLabel = simStep === 3 ? "Location Reached" : simStep === 4 ? "Capturing Evidence" : "Verification Complete";
    cx = 368;
    cy = 220;
    
    if (simStep === 3) {
      cameraStatus = "Ready";
      activeBadge = "bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse-soft";
    } else if (simStep === 4) {
      cameraStatus = "Capturing...";
      activeBadge = "bg-emerald-500 text-white border-emerald-600";
    } else {
      cameraStatus = "Verified";
      activeBadge = "bg-emerald-600 text-white border-emerald-700";
    }
  }

  // Get terminal logs dynamically
  const getLogs = () => {
    const entries = [
      { t: "14:02:10", type: "INFO", msg: "Inspection request #9821 created." },
      { t: "14:02:11", type: "INFO", msg: "Target location locked: 12.9716° N, 77.5946° E." },
      { t: "14:02:12", type: "INFO", msg: "Geofence active: 100-meter verification radius." }
    ];

    if (simStep >= 1) {
      entries.push(
        { t: "14:02:13", type: "CONN", msg: "Local inspector John Smith accepted the request." },
        { t: "14:02:14", type: "CONN", msg: "Inspector profile verified. Live feed active." },
        { t: "14:02:14", type: "INFO", msg: "Inspector en route to the property." }
      );
    }

    if (simStep >= 2) {
      entries.push(
        { t: "14:02:15", type: "MAP", msg: "Tracking live inspector location." }
      );
      if (progress > 0.25) {
        entries.push({ t: "14:02:17", type: "MAP", msg: "Distance: 310m | Route: Inner Ring Road." });
      }
      if (progress > 0.6) {
        entries.push({ t: "14:02:19", type: "MAP", msg: "Distance: 160m | Route: Richmond Road." });
      }
      if (progress > 0.9) {
        entries.push({ t: "14:02:21", type: "MAP", msg: "Distance: 45m | Arriving at property boundary." });
      }
    }

    if (simStep >= 3) {
      entries.push(
        { t: "14:02:22", type: "LOCK", msg: "Inspector arrived at the property." },
        { t: "14:02:23", type: "LOCK", msg: "Coordinates confirmed. Verification range check: OK." }
      );
    }

    if (simStep >= 4) {
      entries.push(
        { t: "14:02:24", type: "PHOTO", msg: "Camera system initialized. Ready to snap photo." },
        { t: "14:02:25", type: "PHOTO", msg: "Live photo captured by inspector on-site." },
        { t: "14:02:26", type: "SAFE", msg: "Watermarking photo with verified location coordinates and timestamp." },
        { t: "14:02:27", type: "SEAL", msg: "Tamper-proof digital certificate sealed." }
      );
    }

    if (simStep >= 5) {
      entries.push(
        { t: "14:02:28", type: "INFO", msg: "Inspection evidence verified by server. Status: COMPLETED." },
        { t: "14:02:29", type: "INFO", msg: "Session finalized. Verified proof package ready." }
      );
    }

    return entries;
  };

  const currentLogs = getLogs();

  return (
    <div className="min-h-screen bg-surface-50 text-surface-900 selection:bg-primary-500 selection:text-white overflow-x-hidden font-sans">
      {/* Navbar */}
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

          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-surface-600">
            <a href="#how-it-works" className="hover:text-surface-900 transition-colors">How It Works</a>
            <a href="#demo" className="hover:text-surface-900 transition-colors">Interactive Demo</a>
            <a href="#features" className="hover:text-surface-900 transition-colors">Features</a>
            <a href="#portals" className="hover:text-surface-900 transition-colors">Portals</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-[13px] font-semibold text-surface-600 hover:text-surface-900 px-3 py-1.5 rounded-lg transition-colors"
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 border border-primary-100 rounded-full text-[11px] font-bold text-primary-600">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-500"></span>
            </span>
            VERIFY ANY PROPERTY REMOTELY
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-surface-900 leading-[1.15] tracking-tight max-w-4xl mx-auto">
            Verify Any Property or Location, <br />
            From Anywhere in the World
          </h1>

          <p className="text-sm md:text-base text-surface-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Need to inspect a property, check construction progress, or verify land coordinates? InstantLocate connects you with trusted local captains who visit the site, capture live photos, and send you verified proof—instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3 bg-surface-900 text-white hover:bg-surface-950 font-bold rounded-lg transition-all shadow-sm text-[13px] text-center"
            >
              Request an Inspection
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-surface-100 border border-surface-200 text-surface-700 font-bold rounded-lg transition-all shadow-sm text-[13px] text-center"
            >
              Become an Inspector
            </Link>
          </div>

          {/* Key metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16 max-w-4xl mx-auto border-t border-surface-200 text-center">
            <div>
              <div className="text-2xl font-bold text-surface-900 tabular-nums">100m</div>
              <div className="text-[10px] text-surface-500 mt-1 uppercase font-bold tracking-wider">Guaranteed Location Match</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-surface-900 tabular-nums">Live</div>
              <div className="text-[10px] text-surface-500 mt-1 uppercase font-bold tracking-wider">Real-Time Tracking</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-surface-900 tabular-nums">100%</div>
              <div className="text-[10px] text-surface-500 mt-1 uppercase font-bold tracking-wider">Live-Captured Photos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-surface-900 tabular-nums">Certified</div>
              <div className="text-[10px] text-surface-500 mt-1 uppercase font-bold tracking-wider">Certified Audit Proof</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 border-t border-surface-200 bg-surface-100/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">Platform Flow</h2>
            <h3 className="text-2xl font-bold text-surface-900 sm:text-3xl tracking-tight">How it Works in 3 Simple Steps</h3>
            <p className="text-surface-500 text-sm">Getting on-site location proof has never been easier.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-white border border-surface-200/85 hover:border-primary-200 hover:shadow-card-hover transition-all space-y-4">
              <div className="w-9 h-9 rounded-lg bg-primary-50 border border-primary-200/50 text-primary-600 flex items-center justify-center font-bold text-[13px]">
                01
              </div>
              <h4 className="text-[14px] font-bold text-surface-900">1. Request an Inspection</h4>
              <p className="text-xs text-surface-600 leading-relaxed">
                Pin the exact property or coordinates on the map, add any specific inspection instructions, and submit your request.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white border border-surface-200/85 hover:border-primary-200 hover:shadow-card-hover transition-all space-y-4">
              <div className="w-9 h-9 rounded-lg bg-primary-50 border border-primary-200/50 text-primary-600 flex items-center justify-center font-bold text-[13px]">
                02
              </div>
              <h4 className="text-[14px] font-bold text-surface-900">2. Local Captain Visits</h4>
              <p className="text-xs text-surface-600 leading-relaxed">
                A trusted local captain is assigned to travel to the site. Watch their progress on a live map as they travel to your target location.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white border border-surface-200/85 hover:border-primary-200 hover:shadow-card-hover transition-all space-y-4">
              <div className="w-9 h-9 rounded-lg bg-primary-50 border border-primary-200/50 text-primary-600 flex items-center justify-center font-bold text-[13px]">
                03
              </div>
              <h4 className="text-[14px] font-bold text-surface-900">3. Receive Verified Proof</h4>
              <p className="text-xs text-surface-600 leading-relaxed">
                Once at the site, the captain snaps a live photo. Our system guarantees the photo was taken on-location, watermarks the proof, and delivers it to you.
              </p>
            </div>
          </div>
        </div>
      </section>      {/* Redesigned Interactive Simulation Section */}
      <section id="demo" className="py-20 border-t border-surface-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-primary-600 uppercase bg-primary-50 px-2.5 py-1 rounded-full">
                Interactive Demonstration
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-surface-900 mt-3 sm:text-4xl">
                Real-Time Mission Control
              </h2>
              <p className="text-surface-600 text-sm max-w-xl mt-2">
                See exactly how we verify a property location in real-time.
              </p>
            </div>
            
            {/* Simulation Controls */}
            <div className="flex items-center gap-3 bg-surface-100 p-1.5 rounded-xl border border-surface-200 w-fit">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 bg-white text-surface-900 rounded-lg hover:bg-surface-50 shadow-sm border border-surface-200 transition-all cursor-pointer flex items-center justify-center"
                title={isPlaying ? "Pause Simulation" : "Play Simulation"}
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
                className="p-2 text-surface-700 hover:text-surface-900 hover:bg-surface-200 rounded-lg transition-all cursor-pointer"
                title="Restart Simulation"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
              <div className="h-4 w-[1px] bg-surface-200 mx-1" />
              {/* Step quick links */}
              <div className="hidden sm:flex items-center gap-1">
                {SIM_STEPS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSimStep(idx);
                      setProgress(idx === 2 ? 0.5 : 0);
                    }}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                      simStep === idx
                        ? "bg-primary-600 text-white shadow-sm"
                        : "text-surface-600 hover:bg-surface-200"
                    }`}
                  >
                    Step {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Simulation Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Command Center Metrics & CLI */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              
              {/* Telemetry widgets */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Distance widget */}
                <div className="p-4 bg-surface-50 border border-surface-200/80 rounded-xl space-y-2 relative overflow-hidden group hover:border-primary-200 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold tracking-wider text-surface-500 uppercase">Distance to Target</span>
                    <CompassIcon size={16} className="text-primary-600" />
                  </div>
                  <div className="text-2xl font-black text-surface-900 tabular-nums">
                    {distanceVal}
                  </div>
                  <div className="text-[10px] text-surface-450 flex items-center gap-1 font-medium">
                    <span className={`w-1.5 h-1.5 rounded-full ${simStep >= 3 ? "bg-emerald-500" : "bg-primary-500 animate-pulse-soft"}`} />
                    Allowed Range: Within 100m
                  </div>
                </div>

                {/* Live Tracking Feed widget */}
                <div className="p-4 bg-surface-50 border border-surface-200/80 rounded-xl space-y-2 relative overflow-hidden group hover:border-primary-200 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold tracking-wider text-surface-500 uppercase">Live Tracking Feed</span>
                    <ZapIcon size={16} className="text-primary-600 animate-pulse-soft" />
                  </div>
                  <div className="text-2xl font-black text-surface-900 uppercase tracking-tight">
                    {socketStatus}
                  </div>
                  <div className="text-[10px] text-surface-450 font-medium">
                    Secure connection status
                  </div>
                </div>

                {/* Photo Authenticator */}
                <div className="p-4 bg-surface-50 border border-surface-200/80 rounded-xl space-y-2 relative overflow-hidden group hover:border-primary-200 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold tracking-wider text-surface-500 uppercase">Photo Authenticator</span>
                    <CameraIcon size={16} className="text-primary-600" />
                  </div>
                  <div className="text-2xl font-black text-surface-900 uppercase tracking-tight">
                    {cameraStatus}
                  </div>
                  <div className="text-[10px] text-surface-450 font-medium">
                    Verified on-site capture
                  </div>
                </div>

                {/* Secure Proof Hash */}
                <div className="p-4 bg-surface-50 border border-surface-200/80 rounded-xl space-y-2 relative overflow-hidden group hover:border-primary-200 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold tracking-wider text-surface-500 uppercase">Secure Proof Hash</span>
                    <ClipboardIcon size={16} className="text-primary-600" />
                  </div>
                  <div className="text-[13px] font-mono font-bold text-surface-900 leading-tight truncate">
                    {hashVal}
                  </div>
                  <div className="text-[10px] text-surface-450 font-medium">
                    Digital certificate sealed
                  </div>
                </div>

              </div>

              {/* Terminal logs */}
              <div className="bg-zinc-950 rounded-xl border border-zinc-900 shadow-elevated overflow-hidden flex-1 flex flex-col min-h-[200px]">
                {/* Console header */}
                <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-950 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-zinc-500">terminal@instantlocate: ~logs</span>
                  <div className="w-10" />
                </div>
                {/* Console logs box */}
                <div 
                  ref={terminalContainerRef}
                  className="flex-1 p-4 overflow-y-auto font-mono text-[11px] space-y-1.5 text-zinc-400"
                >
                  {currentLogs.map((log: { t: string; type: string; msg: string }, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-zinc-650 flex-shrink-0">[{log.t}]</span>
                      <span className={`px-1 rounded-[3px] text-[9px] font-bold flex-shrink-0 ${
                        log.type === "INFO" ? "bg-zinc-800 text-zinc-300" :
                        log.type === "CONN" ? "bg-blue-900/40 text-blue-400" :
                        log.type === "MAP" ? "bg-amber-900/40 text-amber-400" :
                        log.type === "LOCK" ? "bg-purple-900/40 text-purple-400" :
                        log.type === "PHOTO" ? "bg-emerald-900/40 text-emerald-400" :
                        log.type === "SAFE" ? "bg-pink-900/40 text-pink-400" :
                        log.type === "SEAL" ? "bg-emerald-950/60 text-emerald-400" :
                        "bg-red-900/40 text-red-400"
                      }`}>{log.type}</span>
                      <span className="text-zinc-200">{log.msg}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: High-tech SVG Map Visualization & Camera overlay */}
            <div className="lg:col-span-7 flex flex-col relative min-h-[350px] bg-slate-50 border border-surface-200 rounded-xl overflow-hidden shadow-elevated">
              
              {/* Map header with telemetry feeds */}
              <div className="px-4 py-3 bg-white border-b border-surface-200 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-bold text-surface-900">VERIFICATION MISSION: #9821</span>
                    <span className="text-[9px] font-mono text-surface-450 mt-0.5 leading-none">
                      LOCATION: {coordVal}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 text-[9px] font-black border rounded-full uppercase tracking-wider transition-all ${activeBadge}`}>
                    {badgeLabel}
                  </span>
                </div>
              </div>

              {/* Simulated Map Workspace */}
              <div className="flex-1 relative overflow-hidden bg-white select-none">
                
                {/* SVG Visual map */}
                <svg className="w-full h-full min-h-[300px] absolute inset-0" viewBox="0 0 500 350" fill="none">
                  {/* Blueprint Grid Lines */}
                  <defs>
                    <pattern id="mapGrid" width="35" height="35" patternUnits="userSpaceOnUse">
                      <path d="M 35 0 L 0 0 0 35" fill="none" stroke="oklch(0.93 0.01 250 / 0.7)" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#mapGrid)" />
                  
                  {/* Grid labels */}
                  <text x="10" y="340" fill="oklch(0.7 0.015 250)" fontSize="8" fontFamily="monospace">GRID SECTOR: BLR-S4</text>

                  {/* Bangalore simulated street layout */}
                  {/* Street 1 (North) */}
                  <line x1="20" y1="80" x2="480" y2="80" stroke="oklch(0.93 0.01 250)" strokeWidth="8" strokeLinecap="round" />
                  <line x1="20" y1="80" x2="480" y2="80" stroke="oklch(0.96 0.008 250)" strokeWidth="4" strokeLinecap="round" />

                  {/* Street 2 (Link Vertical) */}
                  <line x1="240" y1="40" x2="240" y2="310" stroke="oklch(0.93 0.01 250)" strokeWidth="8" strokeLinecap="round" />
                  <line x1="240" y1="40" x2="240" y2="310" stroke="oklch(0.96 0.008 250)" strokeWidth="4" strokeLinecap="round" />

                  {/* Street 3 (South) */}
                  <line x1="20" y1="220" x2="480" y2="220" stroke="oklch(0.93 0.01 250)" strokeWidth="8" strokeLinecap="round" />
                  <line x1="20" y1="220" x2="480" y2="220" stroke="oklch(0.96 0.008 250)" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Street labels */}
                  <text x="30" y="74" fill="oklch(0.55 0.015 250)" fontSize="7" fontFamily="monospace" letterSpacing="0.5">RESIDENCY RD</text>
                  <text x="246" y="50" fill="oklch(0.55 0.015 250)" fontSize="7" fontFamily="monospace" letterSpacing="0.5" transform="rotate(90, 246, 50)">RICHMOND RD</text>
                  <text x="30" y="214" fill="oklch(0.55 0.015 250)" fontSize="7" fontFamily="monospace" letterSpacing="0.5">INNER RING RD</text>

                  {/* Route trail showing where captain came from */}
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

                  {/* Target Proximity geofence boundary circle (100m) */}
                  <circle
                    cx="380"
                    cy="220"
                    r="55"
                    className={`transition-all duration-300 ${
                      simStep >= 3
                        ? "stroke-emerald-500 fill-emerald-500/5 stroke-[2] animate-pulse-soft"
                        : "stroke-primary-500 fill-primary-500/5 stroke-[1.5] stroke-dasharray-[4_4]"
                    }`}
                  />

                  {/* Target Geofence Core pulse */}
                  <circle
                    cx="380"
                    cy="220"
                    r="15"
                    className="fill-none stroke-primary-500/30 stroke-[2] animate-ping"
                  />

                  {/* Distance connector label */}
                  {simStep >= 2 && simStep <= 4 && (
                    <>
                      {/* Distance connector dashed line */}
                      <line
                        x1={cx}
                        y1={cy}
                        x2="380"
                        y2="220"
                        className={`stroke-[1.5] stroke-dasharray-[4_3] transition-all duration-300 ${
                          simStep >= 3 ? "stroke-emerald-500" : "stroke-primary-400"
                        }`}
                      />
                      {/* Distance text container */}
                      <rect
                        x={(cx + 380) / 2 - 20}
                        y={(cy + 220) / 2 - 10}
                        width="40"
                        height="16"
                        rx="4"
                        fill="white"
                        stroke={simStep >= 3 ? "oklch(0.65 0.2 145)" : "oklch(0.55 0.2 250)"}
                        strokeWidth="1"
                      />
                      <text
                        x={(cx + 380) / 2}
                        y={(cy + 220) / 2 + 3}
                        fill={simStep >= 3 ? "oklch(0.57 0.2 145)" : "oklch(0.55 0.2 250)"}
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {distanceVal}
                      </text>
                    </>
                  )}

                  {/* Target Pin */}
                  <g transform="translate(380, 220)">
                    {/* Glowing coordinate pin shadow */}
                    <ellipse cx="0" cy="4" rx="6" ry="2.5" className="fill-slate-900/10 stroke-none" />
                    {/* Visual custom pin */}
                    <path
                      d="M0 -14 C-5 -14 -9 -10 -9 -5 C-9 1 -2 9 0 11 C2 9 9 1 0 11 C2 9 9 1 9 -5 C9 -10 5 -14 0 -14 Z"
                      className={`transition-colors duration-300 ${
                        simStep >= 3 ? "fill-emerald-600" : "fill-primary-600"
                      }`}
                    />
                    <circle cx="0" cy="-5" r="3" fill="white" />
                    {/* Pulse overlay */}
                    <circle cx="0" cy="0" r="1.5" fill="black" />
                  </g>

                  {/* Captain Avatar Pin */}
                  {simStep >= 1 && (
                    <g transform={`translate(${cx}, ${cy})`} className="transition-transform duration-100 ease-out">
                      {/* Avatar base shadow */}
                      <circle cx="0" cy="0" r="14" className="fill-white stroke-primary-600 stroke-[2] shadow-sm animate-pulse-soft" />
                      <circle cx="0" cy="0" r="11" fill="oklch(0.55 0.2 250)" />
                      {/* Caption text letter J */}
                      <text
                        x="0"
                        y="3.5"
                        fill="white"
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                        textAnchor="middle"
                      >
                        J
                      </text>
                      {/* Direction locator triangle pointing towards target */}
                      {simStep === 2 && (
                        <polygon
                          points="0,-15 -4,-11 4,-11"
                          fill="oklch(0.55 0.2 250)"
                          transform={`rotate(${
                            progress <= 0.373 ? 90 : progress <= 0.701 ? 180 : 90
                          })`}
                        />
                      )}
                    </g>
                  )}
                </svg>

                {/* Evidence Viewfinder Overlay (fades in at Step 4 & 5) */}
                {simStep >= 4 && (
                  <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center animate-fade-in p-6 z-20">
                    
                    {/* Target Photo Viewfinder Container */}
                    <div className="relative w-full max-w-[340px] aspect-[4/3] rounded-xl border border-emerald-500/80 overflow-hidden bg-slate-900 shadow-elevated">
                      
                      {/* Viewfinder crosshairs */}
                      <div className="absolute inset-0 border-[1.5px] border-emerald-500/20 pointer-events-none" />
                      {/* Corner crop borders */}
                      <div className="absolute top-3 left-3 border-t-2 border-l-2 border-emerald-400 w-5 h-5" />
                      <div className="absolute top-3 right-3 border-t-2 border-r-2 border-emerald-400 w-5 h-5" />
                      <div className="absolute bottom-3 left-3 border-b-2 border-l-2 border-emerald-400 w-5 h-5" />
                      <div className="absolute bottom-3 right-3 border-b-2 border-r-2 border-emerald-400 w-5 h-5" />
                      
                      {/* Center target cursor */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 border border-emerald-400/50 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                        </div>
                      </div>

                      {/* Mock Wireframe Building / Schematic Drawing */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                        <svg className="w-[60%] h-[60%] stroke-emerald-500 stroke-[1.5] fill-none" viewBox="0 0 100 100">
                          {/* Schematic grid */}
                          <line x1="0" y1="50" x2="100" y2="50" strokeDasharray="2 2" stroke="oklch(0.75 0.18 160)" strokeWidth="0.5" />
                          <line x1="50" y1="0" x2="50" y2="100" strokeDasharray="2 2" stroke="oklch(0.75 0.18 160)" strokeWidth="0.5" />
                          {/* House vector outline */}
                          <polygon points="20,80 20,45 50,20 80,45 80,80" />
                          <rect x="30" y="55" width="15" height="25" />
                          <rect x="55" y="45" width="15" height="15" />
                          <circle cx="50" cy="35" r="5" />
                        </svg>
                      </div>

                      {/* Recording status indicators */}
                      <div className="absolute top-3.5 left-4 flex items-center gap-1.5 text-[9px] font-bold font-mono text-emerald-400 tracking-wider">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse-soft" />
                        LIVE VIEWFINDER
                      </div>
                      <div className="absolute top-3.5 right-4 text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/20">
                        LOCATION VERIFIED
                      </div>

                      {/* Secure watermark stamp overlay */}
                      <div className="absolute bottom-3.5 left-4 right-4 bg-slate-950/85 backdrop-blur-md p-2.5 rounded-lg border border-slate-800 text-[8px] font-mono text-emerald-400/90 space-y-0.5">
                        <div className="flex justify-between">
                          <span>LOCATION: 12.971638 N, 77.594612 E</span>
                          <span className="text-emerald-500">ACCURACY: GUARANTEED</span>
                        </div>
                        <div className="flex justify-between">
                          <span>TIMESTAMP: {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC</span>
                          <span>SOURCE: CAMERA (LIVE)</span>
                        </div>
                        <div className="pt-1 border-t border-slate-900 flex justify-between font-bold text-white leading-none">
                          <span className="truncate mr-3">PROOF CERTIFICATE: SHA256/e3b0c44298fc1c...</span>
                          <span className="flex-shrink-0 text-emerald-400 font-bold uppercase tracking-widest text-[7.5px]">Verified</span>
                        </div>
                      </div>

                      {/* Visual shutter click white overlay */}
                      {shutterFlash && (
                        <div className="absolute inset-0 bg-white z-50 animate-fade-out" />
                      )}
                      
                      {/* Success overlay stamp */}
                      {simStep === 5 && (
                        <div className="absolute inset-0 bg-emerald-950/30 flex items-center justify-center z-10 animate-scale-in">
                          <div className="bg-emerald-500 text-white font-black px-4 py-2 rounded-xl text-sm border-2 border-white shadow-elevated flex items-center gap-2 transform -rotate-12 animate-pulse-soft">
                            <svg className="w-4 h-4 fill-none stroke-current stroke-[3]" viewBox="0 0 24 24">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            LOCATION VERIFIED
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Viewfinder metadata text footer */}
                    <div className="mt-3 text-center space-y-0.5">
                      <p className="text-[11px] font-bold text-white flex items-center gap-1.5 justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Tamper-Proof Verification Proof Sealed
                      </p>
                      <p className="text-[9.5px] text-surface-400">
                        Verified photo report delivered securely.
                      </p>
                    </div>

                  </div>
                )}

              </div>

              {/* Telemetry bottom bar */}
              <div className="px-4 py-2 bg-surface-50 border-t border-surface-200 flex justify-between items-center text-[9px] font-mono text-surface-500">
                <span>LOCATION CONFIDENCE: HIGH</span>
                <span>STATUS: {simStep >= 1 ? "MONITORING ACTIVE" : "CONNECTING..."}</span>
                <span>UPDATE INTERVAL: LIVE</span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Features grid */}
      <section id="features" className="py-16 border-t border-surface-200 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">Platform Core</h2>
            <h3 className="text-2xl font-bold text-surface-900 sm:text-3xl tracking-tight">Built on Trust and Transparency</h3>
            <p className="text-surface-500 text-sm">We make remote inspections safe, honest, and reliable.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-lg bg-white border border-surface-200 hover:border-surface-300 hover:shadow-card-hover transition-all space-y-3">
              <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600">
                <ZapIcon size={16} />
              </div>
              <h4 className="text-[13.5px] font-bold text-surface-900">Live Progress Map</h4>
              <p className="text-xs text-surface-600 leading-relaxed">
                Watch your captain travel to the location in real-time with direct, live updates on your personal dashboard.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-surface-200 hover:border-surface-300 hover:shadow-card-hover transition-all space-y-3">
              <div className="w-8 h-8 rounded-lg bg-accent-50 border border-accent-100 flex items-center justify-center text-accent-600">
                <MapPinIcon size={16} />
              </div>
              <h4 className="text-[13.5px] font-bold text-surface-900">Location-Guaranteed Photos</h4>
              <p className="text-xs text-surface-600 leading-relaxed">
                Photos are only accepted if taken within the precise property boundary, completely eliminating location spoofing.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-surface-200 hover:border-surface-300 hover:shadow-card-hover transition-all space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <CameraIcon size={16} />
              </div>
              <h4 className="text-[13.5px] font-bold text-surface-900">Secure In-App Camera</h4>
              <p className="text-xs text-surface-600 leading-relaxed">
                Inspector uses our built-in camera to capture live site photos. Prevents uploading pre-saved images or old files.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-surface-200 hover:border-surface-300 hover:shadow-card-hover transition-all space-y-3">
              <div className="w-8 h-8 rounded-lg bg-surface-100 border border-surface-200 flex items-center justify-center text-surface-650">
                <ClipboardIcon size={16} />
              </div>
              <h4 className="text-[13.5px] font-bold text-surface-900">Inspection Timeline</h4>
              <p className="text-xs text-surface-600 leading-relaxed">
                Track every milestone from the initial request, to dispatch, travel progress, and final image delivery in a single timeline.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-surface-200 hover:border-surface-300 hover:shadow-card-hover transition-all space-y-3">
              <div className="w-8 h-8 rounded-lg bg-surface-100 border border-surface-200 flex items-center justify-center text-surface-650">
                <CompassIcon size={16} />
              </div>
              <h4 className="text-[13.5px] font-bold text-surface-900">Pinpoint Map Selector</h4>
              <p className="text-xs text-surface-600 leading-relaxed">
                Easily drop a pin on our clear visual map to mark the exact building, gate, or vacant land plot you need verified.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-surface-200 hover:border-surface-300 hover:shadow-card-hover transition-all space-y-3">
              <div className="w-8 h-8 rounded-lg bg-surface-100 border border-surface-200 flex items-center justify-center text-surface-650">
                <UserIcon size={16} />
              </div>
              <h4 className="text-[13.5px] font-bold text-surface-900">Dedicated Spaces</h4>
              <p className="text-xs text-surface-600 leading-relaxed">
                Distinct dashboards tailored for property owners and local captains, keeping request tracking and jobs organized.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portals Details */}
      <section id="portals" className="py-16 border-t border-surface-200 bg-surface-100/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">Workspace</h2>
            <h3 className="text-2xl font-bold text-surface-900 sm:text-3xl tracking-tight">Dedicated Spaces</h3>
            <p className="text-surface-500 text-sm">Tailored dashboards for every user.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Portal */}
            <div className="p-6 rounded-lg bg-white border border-surface-200 hover:border-surface-300 hover:shadow-card-hover transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex px-2 py-0.5 bg-primary-50 border border-primary-200/60 text-[9px] text-primary-750 font-bold rounded-full uppercase tracking-wider">
                  Property Owners & Requesters
                </div>
                <h4 className="text-lg font-bold text-surface-900">Property Owners & Requesters</h4>
                <p className="text-surface-650 text-xs leading-relaxed">
                  Pin target coordinates, specify inspection details, watch local captains live on the map, and manage all your reports in one secure dashboard.
                </p>
                <ul className="space-y-2.5 text-xs text-surface-700">
                  <li className="flex items-center gap-2">
                    <span className="text-primary-600">✓</span> Simple drag-and-drop location selection
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-600">✓</span> Real-time map tracking as inspectors travel
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-600">✓</span> Guaranteed on-site photos and visual proof
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
            <div className="p-6 rounded-lg bg-white border border-surface-200 hover:border-surface-300 hover:shadow-card-hover transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex px-2 py-0.5 bg-accent-50 border border-accent-200/60 text-[9px] text-accent-750 font-bold rounded-full uppercase tracking-wider">
                  Local Inspectors & Captains
                </div>
                <h4 className="text-lg font-bold text-surface-900">Local Inspectors & Captains</h4>
                <p className="text-surface-650 text-xs leading-relaxed">
                  Browse open inspection tasks in your local area, accept requests, travel to the site, and capture guaranteed photos to earn money.
                </p>
                <ul className="space-y-2.5 text-xs text-surface-700">
                  <li className="flex items-center gap-2">
                    <span className="text-accent-600">✓</span> Instant notifications of tasks in your neighborhood
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-accent-600">✓</span> Smart distance verification guides you to the target
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-accent-600">✓</span> Secure, in-app camera capture to submit proof
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="mt-6 block w-full py-2.5 bg-surface-900 hover:bg-surface-950 text-white font-bold rounded-lg text-xs text-center shadow-sm"
              >
                Join as Local Captain
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="py-16 border-t border-surface-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">FAQ</h2>
            <h3 className="text-2xl font-bold text-surface-900 sm:text-3xl tracking-tight">Common Questions</h3>
            <p className="text-surface-500 text-sm">Got questions about location verification? We've got answers.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-surface-200/80 rounded-lg overflow-hidden transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-surface-900 hover:bg-surface-50 transition-colors text-xs cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-surface-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
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

      {/* CTA Footer */}
      <section className="relative py-20 border-t border-surface-200 text-center bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative">
          <h3 className="text-2xl font-bold text-surface-900 sm:text-3xl tracking-tight leading-none">
            Ready to verify a location?
          </h3>
          <p className="text-surface-600 text-xs max-w-xl mx-auto leading-relaxed">
            Create your account in less than two minutes. Request an inspection or start earning as a local Captain today.
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
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-surface-100 border border-surface-200 text-surface-700 font-bold rounded-lg text-xs transition-all shadow-sm"
            >
              Access Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200 bg-surface-50 py-10 text-surface-500 text-[11px]">
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
            &copy; {new Date().getFullYear()} InstantLocate. Secure Remote Inspections & Verification.
          </div>
        </div>
      </footer>
    </div>
  );
}
