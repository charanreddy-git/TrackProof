import {
  MarketingHeader,
  MarketingFooter,
  Button,
  FaqAccordion,
  CheckIcon,
  MapPinIcon,
  CameraIcon,
  NavigationIcon,
  ShieldCheckIcon,
  ClockIcon,
} from "../../components";

const NAV_ITEMS = [
  { label: "How it works", to: "#how-it-works", isAnchor: true },
  { label: "Pricing", to: "/pricing" },
  { label: "For inspectors", to: "/captain" },
];

const FAQS = [
  {
    q: "What does the inspector actually do?",
    a: "The inspector travels to the exact pin you share, checks the property from the outside (and inside for a Detailed audit), takes a photo through the TrackProof dashboard, and submits it. You can add specific instructions for them.",
  },
  {
    q: "Can I request a visit for a plot with no address?",
    a: "Yes. A Google Maps pin is the most reliable location for a plot. You can paste a Maps link or tap the exact spot on the map. Coordinates are what the inspector travels to.",
  },
  {
    q: "How will I know the photo was taken at my property?",
    a: "Proof can only be submitted from within 100 m of your pin. The location and time are stored with the visit, so you can see where and when the photo was taken.",
  },
  {
    q: "How quickly can someone visit?",
    a: "Most requests are accepted within a few hours and completed within 24–48 hours. The Detailed audit gets priority matching where an inspector is available.",
  },
];

const CHECKS = [
  "Boundary walls and gates",
  "Construction progress",
  "Possession and occupancy",
  "Road and site access",
  "Water and electricity",
  "Surrounding area",
];

const STEPS = [
  {
    icon: MapPinIcon,
    title: "Pin the property",
    desc: "Paste a Google Maps link or tap the exact location. Add a note about what you need checked.",
  },
  {
    icon: NavigationIcon,
    title: "Follow the visit",
    desc: "A local inspector accepts and starts the trip. You can watch their location on the map.",
  },
  {
    icon: CameraIcon,
    title: "See the proof",
    desc: "A GPS-verified photo and the visit details arrive in your dashboard for you to review.",
  },
];

export function RequesterLandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-50 font-sans text-surface-900">
      <MarketingHeader
        navItems={NAV_ITEMS}
        ctaLabel="Request a visit"
        ctaTo="/verify/signup"
      />

      <main className="flex-1">
        <section className="paper-bg border-b border-surface-200">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-800">
                <span aria-hidden="true">🇮🇳</span>
                For property owners and NRI buyers
              </p>
              <h1 className="mt-6 text-[38px] font-extrabold leading-[1.1] tracking-[-0.035em] text-surface-950 sm:text-5xl">
                Someone you can trust
                <br />
                visits your property.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-surface-600 sm:text-[17px]">
                Get a GPS-verified photo, live updates and clear visit details
                from a local inspector. No travel, no guesswork.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button to="/verify/signup" size="lg">
                  Request a property visit
                </Button>
                <Button to="/pricing" variant="secondary" size="lg">
                  See pricing
                </Button>
              </div>
              <p className="mt-4 text-[13px] text-surface-500">
                Starting at ₹999 per visit. No app needed.
              </p>
            </div>

            <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-card sm:p-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                  <ClipboardListIcon />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-surface-900">What we can check</h2>
                  <p className="text-xs text-surface-500">Tell us anything specific in your request</p>
                </div>
              </div>
              <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {CHECKS.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 rounded-lg bg-surface-50 px-3 py-2.5 text-[13px] font-medium text-surface-700"
                  >
                    <CheckIcon size={14} className="flex-shrink-0 text-primary-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 border-b border-surface-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-primary-700">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-surface-950 sm:text-4xl">
                It takes about two minutes to request.
              </h2>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="rounded-2xl border border-surface-200 bg-surface-50/60 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                        <Icon size={20} />
                      </div>
                      <span className="text-xs font-bold tabular-nums text-surface-300">0{index + 1}</span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-surface-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-surface-600">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-surface-200 bg-surface-50">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary-700">
                  Why you can rely on it
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-surface-950 sm:text-4xl">
                  The location is checked, not claimed.
                </h2>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-surface-600">
                  Inspectors cannot submit proof from somewhere else. The
                  platform checks the phone's GPS distance when proof is
                  uploaded — not just when the visit starts.
                </p>
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-primary-100 bg-primary-50/60 p-4">
                  <ShieldCheckIcon size={18} className="mt-0.5 flex-shrink-0 text-primary-700" />
                  <p className="text-sm leading-relaxed text-primary-900">
                    <strong className="font-semibold">100 m geofence.</strong> The
                    server checks the distance before accepting any evidence.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: ShieldCheckIcon, text: "Location checked on upload" },
                  { icon: MapPinIcon, text: "Location attached" },
                  { icon: NavigationIcon, text: "Live on the map" },
                  { icon: ClockIcon, text: "Timestamps included" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="rounded-xl border border-surface-200 bg-white p-4">
                      <Icon size={18} className="text-primary-700" />
                      <p className="mt-3 text-sm font-semibold text-surface-900">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-surface-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 px-4 py-12 sm:px-6 md:flex-row md:items-center lg:px-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-surface-950">
                Plans start at ₹999 per visit.
              </h2>
              <p className="mt-1 text-sm text-surface-600">
                Standard for a basic check, Detailed for a longer checklist and priority matching.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button to="/pricing" variant="secondary">
                Compare plans
              </Button>
              <Button to="/verify/signup">Request a visit</Button>
            </div>
          </div>
        </section>

        <section className="bg-surface-50">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-primary-700">FAQ</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-surface-950 sm:text-3xl">
                Before you request
              </h2>
            </div>
            <div className="mt-8">
              <FaqAccordion items={FAQS} />
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

function ClipboardListIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  );
}
