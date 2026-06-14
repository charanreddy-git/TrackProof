import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { ClockIcon } from "../../components/Icons";
import { MarketingHeader } from "../../components/MarketingHeader";
import { MarketingFooter } from "../../components/MarketingFooter";
import { FaqAccordion } from "../../components/FaqAccordion";

const NAV_ITEMS = [
  { label: "How to Earn", to: "#how-it-works", isAnchor: true },
  { label: "Payout Calculator", to: "#calculator", isAnchor: true },
  { label: "Captain Benefits", to: "#bonuses", isAnchor: true },
  { label: "FAQ", to: "#faq", isAnchor: true },
];

const PAYOUT_PLANS = [
  {
    id: "quick",
    name: "Quick Verification Payout",
    basePayout: 120,
    turnaround: "Same-day delivery",
    desc: "Fast exterior property checks, vacant plot coordinate matching, and shop verification.",
    requirements: [
      "Ride to target coordinates",
      "Capture up to 5 clear on-site photos",
      "Complete in-app GPS check-in",
    ],
  },
  {
    id: "detailed",
    name: "Detailed Verification Payout",
    basePayout: 250,
    turnaround: "Within 24 hours",
    desc: "Rental inspections, neighborhood environment checks, and detailed construction monitoring.",
    requirements: [
      "Capture up to 15 site photos",
      "Provide brief inspector notes summary",
      "Complete in-app GPS check-in",
    ],
  },
  {
    id: "premium",
    name: "Premium Inspection Payout",
    basePayout: 500,
    turnaround: "Priority (<12 hours)",
    desc: "Full property walkthrough reports, business presence audits, and checklist audits.",
    requirements: [
      "Capture walkthrough video",
      "Follow custom inspection guidelines",
      "Priority dispatch matching",
    ],
  },
];

const FAQS = [
  {
    q: "How do I earn money as a Captain?",
    a: "As a Captain, you claim inspection tasks in your local area through the dashboard. Ride to the location, follow specific photo/video instructions, verify your GPS location via our web app, capture evidence, and submit. You get paid for every successfully completed task.",
  },
  {
    q: "What is the payout model?",
    a: "Captains earn a high base cut of 60-65% of customer fees. Additionally, you receive 100% of the travel allowance (₹5/km after 3 km) and 100% of any urgency bonus (₹199 if the requester needs it under 4 hours), making travel and promptness highly lucrative.",
  },
  {
    q: "When and how do I get paid?",
    a: "Payouts are processed weekly directly to your bank account or UPI ID. There is no minimum payout threshold, ensuring you get your hard-earned funds promptly.",
  },
  {
    q: "What equipment do I need?",
    a: "Just a standard smartphone with a working camera and GPS capability, and your own mode of transport (e.g., bike, scooter, or car) to travel to inspection locations.",
  },
  {
    q: "Do I need to download an application from the app store?",
    a: "No! InstantLocate works directly in your phone's web browser. Just open the claimed task link, grant location and camera access, snap the photos, and submit.",
  },
];

export function CaptainLandingPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("detailed");
  const [distance, setDistance] = useState<number>(3);
  const [isUrgent, setIsUrgent] = useState<boolean>(false);

  const selectedPlan = PAYOUT_PLANS.find((p) => p.id === selectedPlanId) || PAYOUT_PLANS[1];
  const distanceEarnings = Math.max(0, distance - 3) * 5;
  const urgencyEarnings = isUrgent ? 199 : 0;
  const totalPayout = selectedPlan.basePayout + distanceEarnings + urgencyEarnings;

  return (
    <div className="min-h-screen bg-surface-50 text-surface-900 font-sans selection:bg-accent-500 selection:text-white">
      <MarketingHeader
        variant="accent"
        logoLabel="InstantLocate Captains"
        navItems={NAV_ITEMS}
        ctaLabel="Join as Captain"
        ctaTo="/captain/signup"
      />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-50 border border-accent-100 rounded-full text-[11px] font-bold text-accent-600 uppercase tracking-wider">
            Flexible Local Gig Earnings
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-surface-900 leading-[1.15] tracking-tight max-w-4xl mx-auto">
            Turn Your Travel Into Income. <br />
            Inspect Properties on Your Own Schedule.
          </h1>

          <p className="text-sm md:text-base text-surface-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Become an InstantLocate Captain. Browse verified inspection tasks in your neighborhood, ride to coordinates, snap photos inside geofences, and get paid weekly. No signup fees or commitments.
          </p>

          <div className="flex items-center justify-center pt-3">
            <Link
              to="/captain/signup"
              className="px-8 py-3.5 bg-surface-900 text-white hover:bg-surface-950 font-bold rounded-lg transition-all shadow-md text-[13px] text-center"
            >
              Start Earning - Join the Fleet
            </Link>
          </div>

          {/* Key metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16 max-w-4xl mx-auto border-t border-surface-200 text-center">
            <div>
              <div className="text-2xl font-bold text-surface-900">Weekly</div>
              <div className="text-[10px] text-surface-500 mt-1 uppercase font-bold tracking-wider">Fast Direct Payouts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-surface-900">100%</div>
              <div className="text-[10px] text-surface-500 mt-1 uppercase font-bold tracking-wider">Travel Fees Passed to You</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-surface-900">Flexible</div>
              <div className="text-[10px] text-surface-500 mt-1 uppercase font-bold tracking-wider">Inspect Whenever You Want</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-surface-900">Web App</div>
              <div className="text-[10px] text-surface-500 mt-1 uppercase font-bold tracking-wider">No App Store Install Required</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 border-t border-surface-200 bg-surface-100/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <h2 className="text-[11px] font-bold text-accent-500 uppercase tracking-widest">Captain Workflow</h2>
            <h3 className="text-2xl font-bold text-surface-900 sm:text-3xl tracking-tight">Earn in 4 Simple Steps</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "1. Browse Available Tasks", desc: "Check your dashboard to view coordinate inspection requests near your current location. Claim any task that suits you." },
              { step: "02", title: "2. Travel to Location", desc: "Navigate to the target coordinates using your browser's map. Distance fee rewards apply automatically after 3 km." },
              { step: "03", title: "3. Geofenced Capture", desc: "Open the in-browser camera within the 100m geofence. Capture site photos and submit securely." },
              { step: "04", title: "4. Weekly Payouts", desc: "Verification logs are instantly verified by the customer. Earnings are dispatched directly to your bank account weekly." },
            ].map((item) => (
              <div key={item.step} className="p-6 rounded-lg bg-white border border-surface-200/85 hover:border-accent-200 hover:shadow-card-hover transition-all space-y-4">
                <div className="w-9 h-9 rounded-lg bg-accent-50 border border-accent-200/50 text-accent-600 flex items-center justify-center font-bold text-[13px]">
                  {item.step}
                </div>
                <h4 className="text-[13px] font-bold text-surface-900">{item.title}</h4>
                <p className="text-[11px] text-surface-650 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Payout Grid */}
      <section id="calculator" className="py-16 border-t border-surface-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <h2 className="text-[11px] font-bold text-accent-500 uppercase tracking-widest">Earnings Transparency</h2>
            <h3 className="text-2xl font-bold text-surface-900 sm:text-3xl tracking-tight">Competitive Payout Structure</h3>
            <p className="text-surface-500 text-sm">We value your time, transportation fuel, and verification efforts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {PAYOUT_PLANS.map((plan) => (
              <Card key={plan.id} padding="lg" className="border border-surface-200 hover:shadow-card-hover transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-surface-900">{plan.name}</h3>
                    <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mt-0.5">Guaranteed Captain share</p>
                  </div>
                  <div className="flex items-baseline gap-1 py-1">
                    <span className="text-3xl font-extrabold text-emerald-600">₹{plan.basePayout}</span>
                    <span className="text-xs text-surface-450 font-semibold">/ completed task</span>
                  </div>
                  <p className="text-xs text-surface-650 leading-relaxed min-h-[40px]">{plan.desc}</p>
                  <hr className="border-surface-100" />
                  <div className="space-y-1.5 text-xs text-surface-700">
                    <div className="text-[10px] font-bold text-surface-400 uppercase tracking-wider mb-1">Requirements</div>
                    {plan.requirements.map((req, idx) => (
                      <p key={idx}>• {req}</p>
                    ))}
                  </div>
                </div>
                <div className="pt-6">
                  <Link
                    to="/captain/signup"
                    className="block w-full py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-lg text-xs text-center transition-all shadow-sm"
                  >
                    Start Earning
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Interactive Calculator */}
          <div className="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-surface-900">Estimate Your Payout</h3>
                <p className="text-xs text-surface-500 mt-1">Simulate travel distances and urgency overrides to estimate exact earnings.</p>
              </div>

              <div className="space-y-2.5">
                <label className="block text-[11px] font-bold text-surface-400 uppercase tracking-wider">
                  1. Select Verification Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PAYOUT_PLANS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlanId(p.id)}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        selectedPlanId === p.id
                          ? "bg-accent-50/50 border-accent-500 ring-2 ring-accent-500/10"
                          : "bg-white border-surface-200 hover:border-surface-300"
                      }`}
                    >
                      <div className="text-xs font-bold text-surface-900">{p.name.split(" ")[0]}</div>
                      <div className="text-[11px] font-extrabold text-accent-600 mt-0.5">₹{p.basePayout}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="block text-[11px] font-bold text-surface-400 uppercase tracking-wider">
                    2. One-Way Travel Distance
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
                  className="w-full h-1.5 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-accent-500 focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-surface-400 font-medium px-0.5">
                  <span>Within City (0-3 km included)</span>
                  <span>Outskirts (15 km)</span>
                </div>
                {distance > 3 ? (
                  <p className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-100 rounded-lg p-2">
                    Distances beyond 3 km earn you +₹5/km travel allowance (+₹{distanceEarnings} added to payout).
                  </p>
                ) : (
                  <p className="text-[10.5px] text-surface-500 bg-surface-100 border border-surface-200 rounded-lg p-2">
                    Base travel covers first 3 km. No additional travel bonus applies.
                  </p>
                )}
              </div>

              <div className="space-y-2.5">
                <label className="block text-[11px] font-bold text-surface-400 uppercase tracking-wider">
                  3. Priority Dispatch Surcharges
                </label>
                <label className="flex items-center justify-between p-3 rounded-lg border border-surface-200 hover:bg-surface-50/50 cursor-pointer select-none">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="w-4 h-4 text-accent-500 border-surface-300 rounded focus:ring-accent-400"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-surface-900 block">Urgent 4-Hour Matching</span>
                      <span className="text-[10px] text-surface-500">100% of the customer's urgency surcharge is paid to you.</span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-accent-600">+₹199</span>
                </label>
              </div>
            </div>

            <div className="lg:col-span-5 bg-surface-50 border-t lg:border-t-0 lg:border-l border-surface-200 p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-surface-800 uppercase tracking-wider">Earnings Estimate</h3>
                <div className="space-y-3.5 text-xs text-surface-650">
                  <div className="flex justify-between">
                    <span>Base Task Payout</span>
                    <span className="font-semibold text-surface-900">₹{selectedPlan.basePayout}</span>
                  </div>
                  {distanceEarnings > 0 && (
                    <div className="flex justify-between">
                      <span>Travel Surcharge Bonus</span>
                      <span className="font-semibold text-surface-900">+₹{distanceEarnings}</span>
                    </div>
                  )}
                  {isUrgent && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Urgent Verification Bonus</span>
                      <span className="font-semibold">+₹199</span>
                    </div>
                  )}
                  <hr className="border-surface-200 my-1" />
                  <div className="flex justify-between items-baseline text-sm pt-2">
                    <span className="font-bold text-surface-950">Total Estimated Payout</span>
                    <span className="text-2xl font-black text-emerald-600">₹{totalPayout}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-8">
                <Link
                  to="/captain/signup"
                  className="block w-full py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-lg text-xs text-center shadow transition-colors"
                >
                  Join as Captain Now
                </Link>
                <p className="text-[10px] text-surface-400 text-center leading-relaxed">
                  Payouts are settled directly to UPI weekly. Start verifying today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits & Bonuses */}
      <section id="bonuses" className="py-16 border-t border-surface-200 bg-surface-100/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-1">
            <h2 className="text-[11px] font-bold text-accent-500 uppercase tracking-widest">Captain Bonuses</h2>
            <h3 className="text-xl font-bold text-surface-900 tracking-tight">Earn Extra with Weekly Challenges</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-lg bg-white border border-surface-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                5x
              </div>
              <h4 className="text-xs font-bold text-surface-900">Tier 1 Challenge</h4>
              <p className="text-[11px] text-surface-550 leading-relaxed">
                Complete 5 verification tasks in a single calendar week to earn a **₹250 bonus** payout automatically.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-surface-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                10x
              </div>
              <h4 className="text-xs font-bold text-surface-900">Tier 2 Challenge</h4>
              <p className="text-[11px] text-surface-550 leading-relaxed">
                Complete 10 verification tasks in a single calendar week to earn an extra **₹600 bonus** payout.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white border border-surface-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-accent-50 border border-accent-100 flex items-center justify-center text-accent-600">
                <ClockIcon size={16} />
              </div>
              <h4 className="text-xs font-bold text-surface-900">Priority matching access</h4>
              <p className="text-[11px] text-surface-550 leading-relaxed">
                Maintain a completion rate above 90% to receive priority task notifications 15 minutes before they go live to others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Captain FAQs Section */}
      <section id="faq" className="py-16 border-t border-surface-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-[11px] font-bold text-accent-500 uppercase tracking-widest">FAQ</h2>
            <h3 className="text-2xl font-bold text-surface-900 sm:text-3xl tracking-tight">Captain FAQ</h3>
          </div>
          <FaqAccordion items={FAQS} />
        </div>
      </section>

      <MarketingFooter
        variant="accent"
        logoLabel="InstantLocate Captains"
        tagline="Secure Remote Inspections & Verification."
      />
    </div>
  );
}
