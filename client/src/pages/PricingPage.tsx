import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import {
  CompassIcon,
  CameraIcon,
  ZapIcon,
  ChevronDownIcon,
  CheckCircleIcon,
} from "../components/Icons";

interface Plan {
  id: string;
  name: string;
  price: number;
  turnaround: string;
  useCase: string;
  features: string[];
}

export function PricingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Calculator State
  const [selectedPlanId, setSelectedPlanId] = useState<string>("detailed");
  const [distance, setDistance] = useState<number>(3);
  const [addOns, setAddOns] = useState({
    video: false,
    priority: false,
    photos: false,
    urgent: false,
    checklist: false,
  });

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const plans: Plan[] = [
    {
      id: "quick",
      name: "Quick Verification",
      price: 199,
      turnaround: "Same-day delivery",
      useCase: "Exterior property checks, shop verification, land verification, basic confirmation.",
      features: [
        "One location visit",
        "Up to 5 verified photos",
        "GPS-confirmed on-site submission",
        "Timestamped digital proof",
      ],
    },
    {
      id: "detailed",
      name: "Detailed Verification",
      price: 399,
      turnaround: "Within 24 hours",
      useCase: "Property buyers, NRIs looking at houses, rental inspections, construction checks.",
      features: [
        "Everything in Quick",
        "Up to 15 verified photos",
        "Detailed inspector summary notes",
        "Surroundings and neighborhood checks",
      ],
    },
    {
      id: "premium",
      name: "Premium Inspection",
      price: 799,
      turnaround: "Priority verification (<12 hrs)",
      useCase: "Investors, high-value asset verification, business monitoring, construction site audits.",
      features: [
        "Everything in Detailed",
        "Full walkthrough video report",
        "Priority queue assignment",
        "Extended structural check checklist",
      ],
    },
  ];

  // Calculations
  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[1];
  const distanceFee = Math.max(0, distance - 3) * 5;
  const addOnPrices = {
    video: 149,
    priority: 99,
    photos: 49,
    urgent: 199,
    checklist: 99,
  };

  const totalAddOns =
    (addOns.video ? addOnPrices.video : 0) +
    (addOns.priority ? addOnPrices.priority : 0) +
    (addOns.photos ? addOnPrices.photos : 0) +
    (addOns.urgent ? addOnPrices.urgent : 0) +
    (addOns.checklist ? addOnPrices.checklist : 0);

  const finalTotal = selectedPlan.price + distanceFee + totalAddOns;

  const faqs = [
    {
      q: "Why do verification prices vary?",
      a: "Our prices correspond to the level of detail you require. A Quick Verification covers external validation and basic status checks (ideal for vacant land or shop presence), whereas a Detailed or Premium inspection requires the inspector to spend more time taking multiple photos, checking surroundings, or capturing walkthrough videos.",
    },
    {
      q: "What happens if no inspector accepts my task?",
      a: "Our dispatch system immediately highlights tasks with higher distances or urgency to inspectors in that specific neighborhood. If a task remains unassigned after 24 hours, we increase the payout. In the rare event that no inspector claims the task within 48 hours, you will receive a full, automatic refund.",
    },
    {
      q: "Can I customize the verification checklist?",
      a: "Yes. By selecting the 'Custom Inspection Checklist' add-on (+₹99) during checkout, you can supply specific step-by-step instructions or items you need the inspector to verify (e.g. 'Check if the boundary gates are locked' or 'Take a photo of the nearby electrical post').",
    },
    {
      q: "Do I get a refund if the verification fails?",
      a: "If an inspector travels to the site but finds it completely inaccessible due to locked gates or private security, they will capture photos of the access barrier and submit them. You will receive this proof along with a 50% refund. If the inspection fails due to weather, natural factors, or inspector cancellation, you receive a 100% refund.",
    },
  ];

  return (
    <div className="min-h-screen bg-surface-50 text-surface-900 font-sans selection:bg-primary-500 selection:text-white">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link to="/verify" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-bold text-[15px] tracking-tight text-surface-900">InstantLocate</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-surface-650">
            <Link to="/verify" className="hover:text-surface-900 transition-colors">Home</Link>
            <Link to="/pricing" className="text-primary-600 font-bold transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-[13px] font-semibold text-surface-650 hover:text-surface-900 px-3 py-1.5 rounded-lg transition-colors">
              Sign In
            </Link>
            <Link to="/verify/signup" className="text-[12.5px] font-bold bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-8 text-center bg-white border-b border-surface-200">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div className="inline-flex px-3 py-1 bg-primary-50 border border-primary-100 rounded-full text-[10px] font-bold text-primary-600 uppercase tracking-wider">
            Simple, On-Demand Pricing
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight leading-none">
            Get Any Location Verified Without Being There
          </h1>
          <p className="text-sm text-surface-500 max-w-xl mx-auto">
            Choose the level of verification that fits your needs. Pay per inspection with no recurring subscription contracts.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-12">
          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                padding="lg"
                className={`flex flex-col justify-between relative border-2 ${
                  plan.id === "detailed"
                    ? "border-primary-500 shadow-md ring-4 ring-primary-50"
                    : "border-surface-200 hover:border-surface-300"
                }`}
              >
                {plan.id === "detailed" && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-primary-600 text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-surface-900">{plan.name}</h3>
                    <p className="text-[11px] text-surface-400 mt-0.5 font-medium">{plan.turnaround}</p>
                  </div>
                  <div className="flex items-baseline gap-1 py-1">
                    <span className="text-3xl font-extrabold text-surface-900">₹{plan.price}</span>
                    <span className="text-xs text-surface-400 font-medium">/ request</span>
                  </div>
                  <p className="text-xs text-surface-600 leading-relaxed min-h-[48px]">
                    {plan.useCase}
                  </p>
                  <hr className="border-surface-100" />
                  <ul className="space-y-2.5 text-xs text-surface-700">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircleIcon size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-6">
                  <Link
                    to="/verify/signup"
                    className={`block w-full py-2.5 font-bold rounded-lg text-xs text-center transition-all shadow-sm ${
                      plan.id === "detailed"
                        ? "bg-primary-600 hover:bg-primary-700 text-white"
                        : "bg-surface-900 hover:bg-surface-950 text-white"
                    }`}
                  >
                    Book {plan.name.split(" ")[0]}
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Interactive Calculator Section */}
          <div className="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Calculator Panel */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-surface-900">Estimate Your Inspection Fee</h3>
                <p className="text-xs text-surface-500 mt-1">
                  Select options and map distance to see exact pricing upfront.
                </p>
              </div>

              {/* Step 1: Select Plan */}
              <div className="space-y-2.5">
                <label className="block text-[11px] font-bold text-surface-400 uppercase tracking-wider">
                  1. Select Verification Detail Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {plans.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlanId(p.id)}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        selectedPlanId === p.id
                          ? "bg-primary-50/50 border-primary-500 ring-2 ring-primary-500/10"
                          : "bg-white border-surface-200 hover:border-surface-300"
                      }`}
                    >
                      <div className="text-xs font-bold text-surface-900">{p.name.split(" ")[0]}</div>
                      <div className="text-[11px] font-extrabold text-primary-600 mt-0.5">₹{p.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Distance estimation */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="block text-[11px] font-bold text-surface-400 uppercase tracking-wider">
                    2. Travel Distance from City Center
                  </label>
                  <span className="font-mono text-xs font-bold text-surface-700 bg-surface-100 px-2 py-0.5 rounded">
                    {distance} km
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={distance}
                  onChange={(e) => setDistance(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-primary-600 focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-surface-400 font-medium px-0.5">
                  <span>Within City (0-3 km included)</span>
                  <span>Outskirts (15 km)</span>
                </div>
                {distance > 3 ? (
                  <p className="text-[11px] text-amber-700 font-semibold bg-amber-50 border border-amber-100 rounded-lg p-2 flex items-center gap-1.5">
                    Travel beyond 3 km adds ₹5/km travel allowance. (+₹{distanceFee} added)
                  </p>
                ) : (
                  <p className="text-[10.5px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-100 rounded-lg p-2 flex items-center gap-1.5">
                    Free travel zone: No distance fee applies for first 3 km.
                  </p>
                )}
              </div>

              {/* Step 3: Add-ons selection */}
              <div className="space-y-2.5">
                <label className="block text-[11px] font-bold text-surface-400 uppercase tracking-wider">
                  3. Select Task Add-ons
                </label>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-lg border border-surface-200 hover:bg-surface-50/50 cursor-pointer select-none">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={addOns.video}
                        onChange={(e) => setAddOns({ ...addOns, video: e.target.checked })}
                        className="w-4 h-4 text-primary-600 border-surface-300 rounded focus:ring-primary-500"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-surface-900 block">Video Walkthrough</span>
                        <span className="text-[10px] text-surface-500">Get a continuous high-definition video of the target site.</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-primary-600 flex-shrink-0 ml-4">+₹149</span>
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border border-surface-200 hover:bg-surface-50/50 cursor-pointer select-none">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={addOns.priority}
                        onChange={(e) => setAddOns({ ...addOns, priority: e.target.checked })}
                        className="w-4 h-4 text-primary-600 border-surface-300 rounded focus:ring-primary-500"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-surface-900 block">Priority Assignment</span>
                        <span className="text-[10px] text-surface-500">Put your inspection at the front of local inspector lists.</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-primary-600 flex-shrink-0 ml-4">+₹99</span>
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border border-surface-200 hover:bg-surface-50/50 cursor-pointer select-none">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={addOns.photos}
                        onChange={(e) => setAddOns({ ...addOns, photos: e.target.checked })}
                        className="w-4 h-4 text-primary-600 border-surface-300 rounded focus:ring-primary-500"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-surface-900 block">Additional Photos</span>
                        <span className="text-[10px] text-surface-500">Instruct inspector to capture up to 10 more custom photos.</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-primary-600 flex-shrink-0 ml-4">+₹49</span>
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border border-surface-200 hover:bg-surface-50/50 cursor-pointer select-none">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={addOns.urgent}
                        onChange={(e) => setAddOns({ ...addOns, urgent: e.target.checked })}
                        className="w-4 h-4 text-primary-600 border-surface-300 rounded focus:ring-primary-500"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-surface-900 block">Urgent Verification (Under 4 hours)</span>
                        <span className="text-[10px] text-surface-500">Matches inspector instantly and triggers active notification signals.</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-primary-600 flex-shrink-0 ml-4">+₹199</span>
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border border-surface-200 hover:bg-surface-50/50 cursor-pointer select-none">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={addOns.checklist}
                        onChange={(e) => setAddOns({ ...addOns, checklist: e.target.checked })}
                        className="w-4 h-4 text-primary-600 border-surface-300 rounded focus:ring-primary-500"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-surface-900 block">Custom Inspection Checklist</span>
                        <span className="text-[10px] text-surface-500">Submit custom specific verification rules for the inspector.</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-primary-600 flex-shrink-0 ml-4">+₹99</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Estimate Summary Panel */}
            <div className="lg:col-span-5 bg-surface-50 border-t lg:border-t-0 lg:border-l border-surface-200 p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-surface-800 uppercase tracking-wider">Estimate Summary</h3>

                <div className="space-y-3.5 text-xs text-surface-650">
                  <div className="flex justify-between">
                    <span>{selectedPlan.name} (Base)</span>
                    <span className="font-semibold text-surface-900">₹{selectedPlan.price}</span>
                  </div>

                  {distanceFee > 0 && (
                    <div className="flex justify-between">
                      <span>Distance Allowance ({distance} km)</span>
                      <span className="font-semibold text-surface-900">+₹{distanceFee}</span>
                    </div>
                  )}

                  {addOns.video && (
                    <div className="flex justify-between">
                      <span>Video Walkthrough</span>
                      <span className="font-semibold text-surface-900">+₹{addOnPrices.video}</span>
                    </div>
                  )}
                  {addOns.priority && (
                    <div className="flex justify-between">
                      <span>Priority Queue Assignment</span>
                      <span className="font-semibold text-surface-900">+₹{addOnPrices.priority}</span>
                    </div>
                  )}
                  {addOns.photos && (
                    <div className="flex justify-between">
                      <span>Additional Photo Slots</span>
                      <span className="font-semibold text-surface-900">+₹{addOnPrices.photos}</span>
                    </div>
                  )}
                  {addOns.urgent && (
                    <div className="flex justify-between text-amber-700">
                      <span>Urgent Surcharge (Under 4h)</span>
                      <span className="font-semibold">+₹{addOnPrices.urgent}</span>
                    </div>
                  )}
                  {addOns.checklist && (
                    <div className="flex justify-between">
                      <span>Custom Checklist Review</span>
                      <span className="font-semibold text-surface-900">+₹{addOnPrices.checklist}</span>
                    </div>
                  )}

                  <hr className="border-surface-200 my-1" />

                  <div className="flex justify-between items-baseline text-sm pt-2">
                    <span className="font-bold text-surface-950">Estimated Total</span>
                    <span className="text-2xl font-black text-primary-600">₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-8">
                <Link
                  to="/verify/signup"
                  className="block w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg text-xs text-center shadow transition-colors"
                >
                  Request Verification Now
                </Link>
                <p className="text-[10px] text-surface-400 text-center leading-relaxed font-medium">
                  No charge is placed until an inspector accepts your task. Full refund guaranteed if verification is not completed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How Pricing Works */}
        <section className="py-12 border-t border-surface-200 mt-12">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-1">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">Pricing Transparency</h2>
            <h3 className="text-xl font-bold text-surface-900 tracking-tight">How Pricing Works in 4 Steps</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2 text-center p-4">
              <div className="w-9 h-9 rounded-full bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center font-black mx-auto text-xs">
                1
              </div>
              <h4 className="text-xs font-bold text-surface-900">Create Request</h4>
              <p className="text-[11px] text-surface-500 leading-relaxed">
                Specify location details and instructions. Choose your level of detail and optional add-ons.
              </p>
            </div>

            <div className="space-y-2 text-center p-4">
              <div className="w-9 h-9 rounded-full bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center font-black mx-auto text-xs">
                2
              </div>
              <h4 className="text-xs font-bold text-surface-900">Inspector Claims Job</h4>
              <p className="text-[11px] text-surface-500 leading-relaxed">
                A nearby verified inspector claims your request and immediately departs for the location.
              </p>
            </div>

            <div className="space-y-2 text-center p-4">
              <div className="w-9 h-9 rounded-full bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center font-black mx-auto text-xs">
                3
              </div>
              <h4 className="text-xs font-bold text-surface-900">On-Site Verification</h4>
              <p className="text-[11px] text-surface-500 leading-relaxed">
                Photos are snapped directly inside the property boundary. The inspector must be physically on-location to capture evidence.
              </p>
            </div>

            <div className="space-y-2 text-center p-4">
              <div className="w-9 h-9 rounded-full bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center font-black mx-auto text-xs">
                4
              </div>
              <h4 className="text-xs font-bold text-surface-900">Receive Trust Proof</h4>
              <p className="text-[11px] text-surface-500 leading-relaxed">
                Get notified as soon as evidence is uploaded. View watermarked, location-stamped reports from your dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* Why Users Trust InstantLocate */}
        <section className="py-12 border-t border-surface-200 bg-surface-100/20 rounded-xl px-6 sm:px-8 mt-4">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-1">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">Built-In Safety</h2>
            <h3 className="text-xl font-bold text-surface-900 tracking-tight">Why Users Trust InstantLocate</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CameraIcon size={16} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-surface-900">On-Site Photo Evidence</h4>
                <p className="text-[11px] text-surface-555 leading-relaxed">
                  We verify coordinates bounds using browser device metrics. Inspectors must be on-site to take photos. Uploading pre-saved gallery files is blocked.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ZapIcon size={16} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-surface-900">Real-Time Progress Map</h4>
                <p className="text-[11px] text-surface-555 leading-relaxed">
                  Track the assigned inspector live on the map as they navigate to the coordinates, keeping you updated on travel stages.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-accent-50 border border-accent-100 text-accent-650 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CompassIcon size={16} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-surface-900">Secure Audit Records</h4>
                <p className="text-[11px] text-surface-555 leading-relaxed">
                  Every photo contains encrypted metadata containing date, time, and positioning parameters.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-12 border-t border-surface-200 mt-12 max-w-3xl mx-auto">
          <div className="text-center mb-10 space-y-1">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">FAQ</h2>
            <h3 className="text-xl font-bold text-surface-900 tracking-tight">Pricing FAQ</h3>
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
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-200 bg-white py-10 text-surface-500 text-[11px]">
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
