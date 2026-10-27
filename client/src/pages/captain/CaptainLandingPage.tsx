import {
  MarketingHeader,
  MarketingFooter,
  Button,
  FaqAccordion,
  CheckIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  MapPinIcon,
  CameraIcon,
  CompassIcon,
  ZapIcon,
} from "../../components";

const NAV_ITEMS = [
  { label: "How it works", to: "#how-it-works", isAnchor: true },
  { label: "Earnings", to: "#earnings", isAnchor: true },
  { label: "Requirements", to: "#requirements", isAnchor: true },
  { label: "FAQ", to: "#faq", isAnchor: true },
];

const VISIT_TYPES = [
  {
    name: "Quick check",
    payout: "120",
    turnaround: "Same day",
    desc: "Exterior photo, vacant plots, and shop-front checks.",
    includes: "One proof photo · GPS check-in",
    tint: "bg-primary-50 text-primary-700",
  },
  {
    name: "Detailed visit",
    payout: "250",
    turnaround: "Within 24 hours",
    desc: "Rental checks, construction progress, and neighbourhood visits.",
    includes: "One proof photo · custom checklist",
    tint: "bg-accent-50 text-accent-700",
  },
  {
    name: "Priority inspection",
    payout: "500",
    turnaround: "Priority",
    desc: "Longer checklists for time-sensitive requests.",
    includes: "One proof photo · priority visit",
    tint: "bg-warning-50 text-warning-700",
  },
];

const STEPS = [
  {
    icon: CompassIcon,
    title: "Find a nearby request",
    desc: "Open the app and see property visits available around you.",
  },
  {
    icon: MapPinIcon,
    title: "Travel to the pin",
    desc: "Accept the visit and follow directions to the exact location.",
  },
  {
    icon: CameraIcon,
    title: "Take the proof photo",
    desc: "Capture it inside PinProof, within 100 m of the pin. Location and time attach automatically.",
  },
  {
    icon: CheckIcon,
    title: "Get paid",
    desc: "The requester reviews the proof. Payouts are settled weekly to your bank account or UPI ID.",
  },
];

const NEEDS = [
  "Smartphone with GPS",
  "Working camera",
  "Bike, scooter, or car",
  "Mobile data for tracking",
];

const FAQS = [
  {
    q: "How do I earn as an inspector?",
    a: "Accept a property visit from your dashboard, travel to the location, and submit a proof photo through the app. The visit is paid after the requester reviews and completes it.",
  },
  {
    q: "How much can I earn per visit?",
    a: "Quick checks start at ₹120, detailed visits at ₹250, and priority inspections at ₹500. The base payout is listed with each visit type, with no joining fees.",
  },
  {
    q: "When do I get paid?",
    a: "Payouts are settled weekly to your bank account or UPI ID. There is no minimum payout threshold.",
  },
  {
    q: "What do I need to start?",
    a: "A smartphone with a working camera and GPS, mobile data, and a bike, scooter, or car to reach the property. PinProof works in your browser — no app download is required.",
  },
  {
    q: "Do I have to accept every visit?",
    a: "No. You choose the visits that suit your location and schedule. There are no joining fees or minimum hours.",
  },
];

function EarningsCard() {
  return (
    <article className="overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-elevated">
      <div className="flex items-center justify-between gap-3 bg-primary-900 px-4 py-3.5 text-white">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <ZapIcon size={16} className="text-accent-300" />
          </span>
          <div>
            <p className="text-[12.5px] font-bold leading-none">Weekly earnings</p>
            <p className="mt-1 text-[10.5px] font-medium text-primary-200">Bengaluru</p>
          </div>
        </div>
        <span className="rounded-full bg-accent-400 px-2.5 py-1 text-[10px] font-bold text-primary-950">
          Sample
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11.5px] font-semibold text-surface-500">10 visits completed</p>
            <p className="mt-1 text-[1.3rem] font-extrabold leading-tight tracking-[-0.02em] text-surface-950">
              This week’s payout
            </p>
          </div>
          <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[10px] font-bold text-primary-700 ring-1 ring-primary-200">
            Settled
          </span>
        </div>

        <p className="mt-4 flex items-baseline gap-1 border-y border-surface-200 py-4">
          <span className="text-[1.2rem] font-bold text-surface-500">₹</span>
          <span className="text-[3.3rem] font-extrabold leading-[0.8] tracking-[-0.055em] text-surface-950">1,980</span>
        </p>

        <div className="mt-3">
          {[
            ["6 detailed visits", "₹1,500"],
            ["4 quick checks", "₹480"],
            ["Deductions", "None"],
          ].map(([label, value], index) => (
            <div
              key={label}
              className={`flex items-center justify-between gap-4 py-2 text-[11.5px] ${index > 0 ? "border-t border-surface-100" : ""}`}
            >
              <span className="font-medium text-surface-600">{label}</span>
              <span className="font-bold text-surface-900">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-xl bg-surface-100 px-3 py-2.5">
          <ClockIcon size={13} className="mt-0.5 flex-shrink-0 text-accent-600" />
          <p className="text-[10.5px] leading-relaxed text-surface-600">
            Weekly settlement to bank or UPI. No joining fee, no minimum hours.
          </p>
        </div>
      </div>
    </article>
  );
}

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
        <section className="relative overflow-hidden border-b border-surface-200 bg-accent-50/70">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-24 h-80 w-80 rounded-full bg-accent-200/60 blur-2xl"
          />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-14 lg:px-8 lg:py-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-300 bg-white px-3 py-1.5 text-[11.5px] font-bold text-primary-800 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-accent-500" />
                Work near you
              </span>
              <h1 className="mt-5 max-w-[12ch] text-[2.9rem] font-extrabold leading-[0.98] tracking-[-0.05em] text-surface-950 sm:text-[3.8rem]">
                Check properties.
                <br />
                <span className="text-primary-700">Earn per visit.</span>
              </h1>
              <p className="mt-5 max-w-[31rem] text-[15px] leading-[1.7] text-surface-600 sm:text-[16px]">
                Accept a property visit in your area, go to the exact pin, and submit
                a GPS-verified photo. No joining fee, no fixed hours.
              </p>

              <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <Button to="/captain/signup" variant="accent" size="lg" className="w-full sm:w-auto">
                  Join as an inspector
                  <ArrowRightIcon size={16} />
                </Button>
                <a
                  href="#earnings"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-[14px] font-bold text-surface-700 transition-colors hover:bg-white hover:text-surface-950 sm:justify-start"
                >
                  See what visits pay
                  <span aria-hidden="true" className="text-surface-400">↓</span>
                </a>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-2">
                {[
                  ["₹0", "Joining fee"],
                  ["Weekly", "Settlement"],
                  ["Your hours", "No minimum"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-xl border border-accent-200 bg-white/80 px-3 py-3">
                    <p className="text-[13px] font-extrabold leading-tight text-surface-950">{value}</p>
                    <p className="mt-0.5 text-[10.5px] font-medium text-surface-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-x-5 -bottom-2 top-5 rotate-2 rounded-[2rem] bg-accent-200/80"
              />
              <div className="relative">
                <EarningsCard />
              </div>
              <p className="relative mt-3 text-center text-[10.5px] font-medium text-surface-500">
                Illustrative earnings · not a payout promise
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-20 border-b border-surface-200 bg-primary-950">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-[12px] font-bold text-accent-400">The visit</p>
              <h2 className="mt-2 text-[2.1rem] font-extrabold leading-[1.04] tracking-[-0.04em] text-white sm:text-[2.9rem]">
                Four steps. One clean proof.
              </h2>
              <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-primary-200">
                You are not selling a listing or chasing a lead. You go to the pin,
                record what is there, and submit it.
              </p>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map(({ icon: Icon, title, desc }, index) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-400 text-primary-950">
                      <Icon size={18} />
                    </span>
                    <span className="text-[1.7rem] font-extrabold leading-none text-white/15">{index + 1}</span>
                  </div>
                  <h3 className="mt-3.5 text-[13.5px] font-bold text-white">{title}</h3>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-primary-200">{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3.5">
              <ShieldCheckIcon size={16} className="mt-0.5 flex-shrink-0 text-accent-400" />
              <p className="max-w-2xl text-[11.5px] leading-relaxed text-primary-200">
                <strong className="font-bold text-white">Proof is checked on the server.</strong>{" "}
                The distance between your photo and the pin is verified before the visit is accepted.
              </p>
            </div>
          </div>
        </section>

        {/* Earnings */}
        <section id="earnings" className="scroll-mt-20 border-b border-surface-200 bg-surface-50">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-[12px] font-bold text-primary-700">What a visit pays</p>
                <h2 className="mt-2 max-w-[15ch] text-[2.1rem] font-extrabold leading-[1.04] tracking-[-0.04em] text-surface-950 sm:text-[2.9rem]">
                  Clear pay. No confusing deductions.
                </h2>
              </div>
              <p className="max-w-xs text-[12.5px] leading-relaxed text-surface-500">
                Your base payout is fixed for each visit type, so you know what a
                visit is worth before you accept.
              </p>
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-3">
              {VISIT_TYPES.map(({ name, payout, turnaround, desc, includes, tint }) => (
                <div key={name} className="flex flex-col rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tint}`}>
                      <ZapIcon size={16} />
                    </span>
                    <span className="rounded-full bg-surface-100 px-2.5 py-1 text-[10px] font-bold text-surface-500">
                      {turnaround}
                    </span>
                  </div>
                  <h3 className="mt-3 text-[1.05rem] font-bold text-surface-950">{name}</h3>
                  <p className="mt-1 flex-1 text-[12px] leading-relaxed text-surface-600">{desc}</p>
                  <div className="mt-4 flex items-baseline gap-1 border-t border-surface-200 pt-3">
                    <span className="text-[1.8rem] font-extrabold leading-none tracking-[-0.04em] text-surface-950">₹{payout}</span>
                    <span className="text-[10.5px] font-semibold text-surface-500">/ visit</span>
                  </div>
                  <p className="mt-2 text-[10.5px] font-medium text-primary-700">{includes}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {[
                {
                  title: "Clear per-visit pay",
                  desc: "The base payout is listed with each visit type. Nothing is deducted.",
                },
                {
                  title: "Weekly settlement",
                  desc: "Completed visits are settled to your bank account or UPI ID at the end of the week.",
                },
                {
                  title: "No joining fee",
                  desc: "Create your account and start accepting visits without paying anything upfront.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl bg-surface-100 px-4 py-3.5">
                  <p className="flex items-center gap-1.5 text-[12px] font-bold text-surface-900">
                    <CheckIcon size={13} className="text-primary-600" />
                    {item.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-surface-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section id="requirements" className="scroll-mt-20 border-b border-surface-200 bg-surface-100">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-start lg:gap-16 lg:px-8">
            <div>
              <p className="text-[12px] font-bold text-primary-700">What you need</p>
              <h2 className="mt-2 max-w-[17ch] text-[2.1rem] font-extrabold leading-[1.04] tracking-[-0.04em] text-surface-950 sm:text-[2.7rem]">
                A phone, a camera, and a way to get there.
              </h2>
              <p className="mt-3 max-w-md text-[13px] leading-relaxed text-surface-600">
                No app download, no joining fee, and no fixed hours. Accept work when
                it fits your day.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {NEEDS.map((item) => (
                <div key={item} className="flex items-center gap-2.5 rounded-xl border border-surface-200 bg-white px-3.5 py-3.5 text-[12.5px] font-semibold text-surface-800 shadow-sm">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                    <CheckIcon size={11} className="text-primary-700" />
                  </span>
                  {item}
                </div>
              ))}
              <p className="sm:col-span-2 rounded-xl bg-primary-50 px-3.5 py-3 text-[11.5px] font-medium leading-relaxed text-primary-800">
                PinProof runs in the browser · no install required
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 bg-surface-50">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.62fr_1.38fr] lg:gap-16 lg:px-8">
            <div>
              <p className="text-[12px] font-bold text-primary-700">Questions</p>
              <h2 className="mt-2 text-[2.1rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-surface-950 sm:text-[2.7rem]">
                Inspector questions.
              </h2>
              <p className="mt-3 max-w-xs text-[12.5px] leading-relaxed text-surface-500">
                Still unsure? Write to{" "}
                <a href="mailto:field@pinproof.in" className="font-bold text-primary-700 underline underline-offset-4">
                  field@pinproof.in
                </a>
                .
              </p>
            </div>
            <FaqAccordion items={FAQS} />
          </div>
        </section>

        {/* CTA */}
        <section className="bg-accent-400">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 px-4 py-9 sm:px-6 md:flex-row md:items-center lg:px-8">
            <div>
              <p className="text-[11.5px] font-bold text-primary-800">Ready when you are</p>
              <h2 className="mt-1 text-[1.8rem] font-extrabold leading-tight tracking-[-0.03em] text-primary-950 sm:text-[2.1rem]">
                Start inspecting nearby.
              </h2>
              <p className="mt-1 text-[12.5px] font-medium text-primary-900/80">
                Create your account and find visits in your area.
              </p>
            </div>
            <Button to="/captain/signup" variant="primary" className="flex-shrink-0">
              Join as an inspector
              <ArrowRightIcon size={15} />
            </Button>
          </div>
        </section>
      </main>

      <MarketingFooter
        variant="accent"
        tagline="Inspect properties nearby and earn per visit. Photograph, geotag, and submit proof."
      />
    </div>
  );
}
