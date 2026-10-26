import {
  MarketingHeader,
  MarketingFooter,
  Button,
  FaqAccordion,
  Card,
  CheckIcon,
  MapPinIcon,
  CameraIcon,
  NavigationIcon,
  IndianRupeeIcon,
  ClockIcon,
  ShieldCheckIcon,
} from "../../components";

const NAV_ITEMS = [
  { label: "How it works", to: "#how-it-works", isAnchor: true },
  { label: "Earnings", to: "#earnings", isAnchor: true },
  { label: "Requirements", to: "#requirements", isAnchor: true },
  { label: "FAQ", to: "#faq", isAnchor: true },
];

const VISIT_TYPES = [
  {
    id: "quick",
    name: "Quick check",
    payout: 120,
    turnaround: "Same day",
    desc: "Exterior photo, vacant plot and shop checks.",
    includes: ["One proof photo", "GPS check-in", "Short visit"],
  },
  {
    id: "detailed",
    name: "Detailed visit",
    payout: 250,
    turnaround: "Within 24 hours",
    desc: "Rental checks, construction progress and neighbourhood visits.",
    includes: ["One proof photo", "Custom checklist", "GPS check-in"],
  },
  {
    id: "priority",
    name: "Priority inspection",
    payout: 500,
    turnaround: "Priority",
    desc: "Priority visits and longer checklists for time-sensitive requests.",
    includes: ["One proof photo", "Priority task", "Custom checklist"],
  },
];

const STEPS = [
  {
    icon: MapPinIcon,
    title: "Find a nearby request",
    desc: "Open your dashboard and see property visits available in your area.",
  },
  {
    icon: NavigationIcon,
    title: "Travel to the pin",
    desc: "Accept a visit and use Google Maps directions to reach the exact location.",
  },
  {
    icon: CameraIcon,
    title: "Take a proof photo",
    desc: "Take a photo in the app within 100 m of the pin. The location is attached automatically.",
  },
  {
    icon: IndianRupeeIcon,
    title: "Get paid weekly",
    desc: "Your earnings are sent to your bank account or UPI ID every week.",
  },
];

const EARNINGS_POINTS = [
  {
    icon: IndianRupeeIcon,
    title: "Clear per-visit pay",
    desc: "The base payout for each visit type is listed above. There are no joining fees or deductions.",
  },
  {
    icon: ClockIcon,
    title: "Weekly settlement",
    desc: "Completed visits are settled to your bank account or UPI ID at the end of the week.",
  },
  {
    icon: ShieldCheckIcon,
    title: "No joining fee",
    desc: "Create your account and start accepting visits without paying anything upfront.",
  },
];

const NEEDS = [
  "Smartphone with GPS",
  "Working camera",
  "Bike, scooter or car",
  "Mobile data for live tracking",
];

const FAQS = [
  {
    q: "How do I earn as an inspector?",
    a: "Accept a property visit from your dashboard, travel to the location, and submit a proof photo through the app. The visit is paid after the requester reviews and completes it.",
  },
  {
    q: "How much can I earn per visit?",
    a: "Quick checks start at ₹120, detailed visits at ₹250, and priority inspections at ₹500. The base payout is listed with each visit type above, with no joining fees.",
  },
  {
    q: "When do I get paid?",
    a: "Payouts are settled weekly to your bank account or UPI ID. There is no minimum payout threshold.",
  },
  {
    q: "What do I need to start?",
    a: "A smartphone with a working camera and GPS, mobile data, and a bike, scooter or car to reach the property. TrackProof works in your browser — no app download is required.",
  },
  {
    q: "Do I have to accept every task?",
    a: "No. You choose the visits that suit your location and schedule. There are no joining fees or minimum hours.",
  },
];

export function CaptainLandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-50 font-sans text-surface-900">
      <MarketingHeader
        variant="accent"
        navItems={NAV_ITEMS}
        ctaLabel="Join as inspector"
        ctaTo="/captain/signup"
      />

      <main className="flex-1">
        {/* Hero */}
        <section className="paper-bg overflow-hidden border-b border-surface-200">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3.5 py-1.5 text-xs font-semibold text-accent-700">
                Flexible local work
              </p>
              <h1 className="mt-6 text-[38px] font-extrabold leading-[1.1] tracking-[-0.035em] text-surface-950 sm:text-5xl">
                Inspect nearby properties.
                <br />
                <span className="text-accent-600">Earn per visit.</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-surface-600 sm:text-[17px]">
                Accept a property check in your area, visit the exact location,
                and submit a GPS-verified photo. No joining fee, no app needed,
                and payouts every week.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button to="/captain/signup" variant="accent" size="lg">
                  Join as an inspector
                </Button>
                <a
                  href="#earnings"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-surface-300 bg-white px-6 text-[15px] font-semibold text-surface-800 transition-colors hover:bg-surface-50"
                >
                  See earnings
                </a>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium text-surface-600">
                {["₹0 joining fee", "Weekly payouts", "Work when you want"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <CheckIcon size={14} className="text-accent-600" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[390px] lg:mx-0 lg:ml-auto">
              <div className="absolute -inset-3 rotate-1 rounded-[28px] bg-accent-100/80" />
              <Card className="relative z-10 rounded-3xl p-5 shadow-elevated sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-surface-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
                    This week
                  </div>
                  <span className="rounded-md bg-accent-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-700">
                    Sample
                  </span>
                </div>
                <p className="mt-4 text-sm text-surface-500">Estimated earnings</p>
                <p className="mt-1 text-4xl font-extrabold tracking-tight text-surface-950">
                  ₹1,980
                </p>
                <p className="mt-1 text-xs text-surface-500">10 completed visits</p>

                <div className="mt-5 space-y-2.5">
                  {[
                    { label: "6 detailed visits", value: "₹1,500" },
                    { label: "4 quick checks", value: "₹480" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-[13px]">
                      <span className="text-surface-500">{row.label}</span>
                      <span className="font-semibold text-surface-800">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-2 rounded-xl bg-surface-50 p-3 text-xs text-surface-500">
                  <ClockIcon size={14} className="flex-shrink-0 text-accent-600" />
                  Paid to your bank or UPI every week
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-20 border-b border-surface-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-accent-700">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-surface-950 sm:text-4xl">
                Four simple steps per visit.
              </h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="rounded-2xl border border-surface-200 bg-surface-50/60 p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                        <Icon size={19} />
                      </div>
                      <span className="text-xs font-bold tabular-nums text-surface-300">0{index + 1}</span>
                    </div>
                    <h3 className="mt-4 text-[15px] font-semibold text-surface-900">{step.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-surface-600">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Earnings */}
        <section id="earnings" className="scroll-mt-20 border-b border-surface-200 bg-surface-50">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-accent-700">
                Simple earnings
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-surface-950 sm:text-4xl">
                Know what a visit pays.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-surface-600">
                Your base payout is fixed for each visit type. No joining fees,
                no confusing deductions, and payouts every week.
              </p>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-surface-200 bg-white">
              {VISIT_TYPES.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 ${
                    index > 0 ? "border-t border-surface-150" : ""
                  }`}
                >
                  <div className="min-w-0 sm:flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[15px] font-semibold text-surface-900">{plan.name}</h3>
                      <span className="rounded-md bg-surface-100 px-2 py-0.5 text-[10px] font-semibold text-surface-500">
                        {plan.turnaround}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] text-surface-600">{plan.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 sm:w-[260px]">
                    {plan.includes.map((item) => (
                      <span key={item} className="inline-flex items-center gap-1.5 text-xs text-surface-500">
                        <CheckIcon size={12} className="text-accent-600" />
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-baseline gap-1 sm:w-28 sm:justify-end">
                    <span className="text-2xl font-extrabold tracking-tight text-surface-950">₹{plan.payout}</span>
                    <span className="text-xs font-medium text-surface-500">/ visit</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {EARNINGS_POINTS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-xl border border-surface-200 bg-white p-4">
                    <Icon size={17} className="text-accent-600" />
                    <p className="mt-2.5 text-sm font-semibold text-surface-900">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-surface-500">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section id="requirements" className="scroll-mt-20 border-b border-surface-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-accent-700">
                  What you need
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-surface-950 sm:text-3xl">
                  A phone, a camera, and a way to get there.
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-surface-600">
                  No app download, no joining fee and no fixed hours. Accept work
                  when it fits your day.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {NEEDS.map((item) => (
                  <div key={item} className="flex items-center gap-2.5 rounded-xl border border-surface-200 bg-surface-50/60 px-4 py-3 text-sm font-medium text-surface-700">
                    <CheckIcon size={15} className="flex-shrink-0 text-accent-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 bg-surface-50">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-accent-700">FAQ</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-surface-950 sm:text-3xl">
                Inspector questions
              </h2>
            </div>
            <div className="mt-8">
              <FaqAccordion items={FAQS} />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-surface-950">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 px-4 py-12 sm:px-6 md:flex-row md:items-center lg:px-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Ready to start inspecting?</h2>
              <p className="mt-1 text-sm text-surface-300">
                Create your account and find requests near you.
              </p>
            </div>
            <Button to="/captain/signup" variant="accent" size="lg" className="flex-shrink-0">
              Join as an inspector
            </Button>
          </div>
        </section>
      </main>

      <MarketingFooter variant="accent" tagline="Inspect properties nearby and earn per visit." />
    </div>
  );
}
