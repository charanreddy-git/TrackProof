import { Link } from "react-router-dom";
import {
  MapPinIcon,
  CameraIcon,
  ClipboardIcon,
} from "../../components/Icons";
import { MarketingHeader } from "../../components/MarketingHeader";
import { MarketingFooter } from "../../components/MarketingFooter";
import { FaqAccordion } from "../../components/FaqAccordion";

const NAV_ITEMS = [
  { label: "How It Works", to: "#how-it-works", isAnchor: true },
  { label: "Pricing", to: "/pricing" },
  { label: "FAQ", to: "#faq", isAnchor: true },
];

const USE_CASES = [
  {
    title: "Verify Before Booking",
    desc: "Check plot boundaries, vacancy, and surroundings before wire-transferring token money to a seller.",
  },
  {
    title: "Inspect Without Flights",
    desc: "Audit inherited land or local property investments in India without booking expensive flight tickets.",
  },
  {
    title: "Monitor Construction",
    desc: "See raw, on-site photos of concrete pours and brick layouts to release builder milestones on time.",
  },
];

const FAQS = [
  {
    q: "What happens if no inspector is matched?",
    a: "If a task remains unassigned after 24 hours, we automatically increase the inspector payout. In the rare event that no inspector accepts the task within 48 hours, your request is canceled and your payment is refunded immediately and automatically.",
  },
  {
    q: "How do I know the photos are real and actually taken at my property?",
    a: "Our secure system forces inspectors to capture photos live at the coordinates using our browser camera. Uploading screenshots, older camera-roll photos, or pre-saved images is blocked. Every photo is automatically sealed with coordinates and timestamps.",
  },
  {
    q: "What exactly do I need to provide to start?",
    a: "Just the coordinates or a Google Maps pin of the property, plus any specific details you need checked (e.g. 'check if the boundary gate is locked' or 'take a photo of the adjacent road').",
  },
  {
    q: "How long does the entire inspection take?",
    a: "Most inspections are accepted and completed within 12 to 24 hours. You will receive an SMS and email notification with your sealed PDF report as soon as the inspector submits the photos.",
  },
];

const EVIDENCE_ITEMS = [
  {
    label: "Front Gate & Entrance",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    check: "Locks secure, boundary gates aligned.",
  },
  {
    label: "Boundary Wall Limits",
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
    check: "Plots match official municipal layout.",
  },
  {
    label: "Asphalt Road Access",
    img: "https://images.unsplash.com/photo-1594913785162-e6785b490895?auto=format&fit=crop&w=600&q=80",
    check: "Direct, paved asphalt connection verified.",
  },
  {
    label: "Construction Progress Check",
    img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
    check: "Pillars complete, brickwork finalized.",
  },
];

export function RequesterLandingPage() {
  return (
    <div className="min-h-screen bg-surface-50 text-surface-900 font-sans selection:bg-primary-500 selection:text-white">
      <MarketingHeader
        navItems={NAV_ITEMS}
        ctaLabel="Verify This Property"
        ctaTo="/verify/signup"
      />

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-surface-900 tracking-tight leading-[1.1] max-w-3xl mx-auto">
            Someone will visit your property and send you proof. Today.
          </h1>

          <p className="text-sm md:text-base text-surface-600 max-w-xl mx-auto leading-relaxed">
            Verify vacant plots, homes, or construction progress anywhere in India without leaving your seat. Safe, secure, and fast.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 pt-2">
            <Link
              to="/verify/signup"
              className="px-8 py-3.5 bg-surface-900 hover:bg-surface-950 text-white font-bold rounded-lg transition-all shadow-md text-[13px] text-center"
            >
              Verify This Property
            </Link>

            <div className="text-[11px] font-semibold text-surface-500 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span>Inspections start at <strong className="text-surface-900 font-bold text-xs">₹199</strong></span>
              <span className="hidden sm:inline text-surface-300">•</span>
              <span>100% Refund if no inspector matches in 48 hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-14 border-t border-surface-200 bg-surface-100/30">
        <div className="max-w-4xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">How It Works</h2>
            <h3 className="text-xl font-bold text-surface-900 tracking-tight">Takes Less Than 2 Minutes</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3 p-5 bg-white rounded-xl border border-surface-150 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                <MapPinIcon size={16} />
              </div>
              <span className="text-xs font-bold text-surface-900 block">01 / Inspector Accepts</span>
              <p className="text-xs text-surface-650 leading-relaxed">
                A vetted local inspector claims your coordinates within minutes of submission.
              </p>
            </div>
            <div className="space-y-3 p-5 bg-white rounded-xl border border-surface-150 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                <ClipboardIcon size={16} />
              </div>
              <span className="text-xs font-bold text-surface-900 block">02 / On the Way</span>
              <p className="text-xs text-surface-650 leading-relaxed">
                Watch them travel to the site coordinates in real-time on your dashboard.
              </p>
            </div>
            <div className="space-y-3 p-5 bg-white rounded-xl border border-surface-150 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                <CameraIcon size={16} />
              </div>
              <span className="text-xs font-bold text-surface-900 block">03 / Photos Delivered</span>
              <p className="text-xs text-surface-650 leading-relaxed">
                Receive watermarked, live-captured proof reports directly on your dashboard.
              </p>
            </div>
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
          <FaqAccordion items={FAQS} />
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
