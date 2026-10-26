import { Link } from "react-router-dom";
import {
  MarketingHeader,
  MarketingFooter,
  Button,
  FaqAccordion,
  CheckIcon,
  ShieldCheckIcon,
  CameraIcon,
  MapPinIcon,
  NavigationIcon,
  HomeIcon,
  ClockIcon,
} from "../components";

const NAV_ITEMS = [
  { label: "How it works", to: "#how-it-works", isAnchor: true },
  { label: "Pricing", to: "/pricing" },
  { label: "For inspectors", to: "/captain" },
];

const FAQS = [
  {
    q: "How do I tell you which property to visit?",
    a: "Paste a Google Maps link or tap the exact spot on the map when you create a request. That pin is what the inspector is paid to reach — not the area around it.",
  },
  {
    q: "How do I know the photo is real?",
    a: "Inspectors submit their photo from inside the TrackProof dashboard, and the GPS location, accuracy, and time are recorded at upload. The server rejects proof taken more than 100 m from your pin. A gallery fallback is available when a camera cannot be used, but the GPS check still applies.",
  },
  {
    q: "Do I need to install an app?",
    a: "No. TrackProof works in your phone or laptop browser. You can request, track and review a visit without installing anything.",
  },
  {
    q: "How long does a visit take?",
    a: "Most requests are accepted within a few hours and completed within 24–48 hours, depending on the plan and whether an inspector is available near your property.",
  },
];

const STEPS = [
  {
    icon: MapPinIcon,
    title: "Pin the property",
    desc: "Paste a Google Maps link or tap the exact spot on the map. Add a short note about what you need checked.",
  },
  {
    icon: NavigationIcon,
    title: "An inspector travels",
    desc: "A local inspector accepts your request. You can follow their trip live on the map.",
  },
  {
    icon: CameraIcon,
    title: "Get photo proof",
    desc: "A GPS-verified photo taken at your property appears in your dashboard with the location and time attached.",
  },
];

const FEATURES = [
  {
    icon: ShieldCheckIcon,
    title: "GPS-verified proof",
    desc: "Proof is accepted only within 100 m of your pin, with the location and time attached.",
  },
  {
    icon: NavigationIcon,
    title: "Live visit tracking",
    desc: "See when an inspector is on the way, how far they are, and when they reach the property.",
  },
  {
    icon: ClockIcon,
    title: "One simple history",
    desc: "Every request, photo and update stays in your dashboard — easy to find and share later.",
  },
];

const USE_CASES = [
  {
    icon: HomeIcon,
    title: "Vacant plots",
    desc: "Check boundaries, access and encroachment before you buy.",
  },
  {
    icon: CameraIcon,
    title: "Under construction",
    desc: "See real progress without flying down for a site visit.",
  },
  {
    icon: MapPinIcon,
    title: "Rentals and resale",
    desc: "Confirm condition and occupancy before you commit.",
  },
];

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-50 font-sans text-surface-900">
      <MarketingHeader
        navItems={NAV_ITEMS}
        ctaLabel="Request a visit"
        ctaTo="/verify/signup"
      />

      <main className="flex-1">
        {/* Hero */}
        <section className="paper-bg overflow-hidden border-b border-surface-200">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-800">
                <span aria-hidden="true">🇮🇳</span>
                Property verification across India
              </div>

              <h1 className="mt-6 text-[38px] font-extrabold leading-[1.08] tracking-[-0.035em] text-surface-950 sm:text-5xl lg:text-[56px]">
                See your property.
                <br />
                <span className="text-primary-700">Without the travel.</span>
              </h1>

              <p className="mt-5 max-w-lg text-base leading-relaxed text-surface-600 sm:text-[17px]">
                A local inspector visits your plot, flat or shop, takes a
                GPS-verified photo, and sends you the visit details — usually within 24 hours.
                Built for buyers in India and Indians living abroad.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button to="/verify/signup" size="lg">
                  Request a property visit
                </Button>
                <a
                  href="#how-it-works"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-surface-300 bg-white px-6 text-[15px] font-semibold text-surface-800 transition-colors hover:bg-surface-50"
                >
                  See how it works
                </a>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium text-surface-600">
                {["GPS-verified photo", "Live tracking", "No app needed"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <CheckIcon size={14} className="text-primary-600" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Sample visit report */}
            <div className="relative mx-auto w-full max-w-[430px] lg:mx-0 lg:ml-auto">
              <div className="absolute -inset-3 -z-0 rotate-2 rounded-[28px] bg-primary-100/70" />
              <div className="relative z-10 overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-elevated">
                <div className="flex items-center justify-between border-b border-surface-150 px-4 py-3.5">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-surface-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
                    Sample visit report
                  </span>
                  <span className="text-[11px] font-medium text-surface-500">12 Aug 2026</span>
                </div>

                <div className="relative m-3 overflow-hidden rounded-2xl">
                  <img
                    src="/verified_property.png"
                    alt="Example property photo submitted after an inspection"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-surface-950/75 px-2.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                    <ShieldCheckIcon size={13} className="text-accent-300" />
                    GPS verified
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-lg bg-surface-950/75 px-2.5 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm">
                    23 m from your pin
                  </div>
                </div>

                <div className="space-y-3 px-4 pb-4 pt-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <MapPinIcon size={16} className="mt-0.5 flex-shrink-0 text-primary-600" />
                      <div>
                        <p className="text-sm font-semibold text-surface-900">
                          Plot 42, Kompally
                        </p>
                        <p className="text-xs text-surface-500">Hyderabad, Telangana</p>
                      </div>
                    </div>
                    <span className="rounded-md bg-surface-100 px-2 py-1 text-[10px] font-semibold text-surface-500">
                      1 photo
                    </span>
                  </div>

                  <div className="space-y-1.5 rounded-xl bg-surface-50 p-3">
                    {["Boundary wall checked", "Road access confirmed"].map((item) => (
                      <p key={item} className="flex items-center gap-2 text-xs font-medium text-surface-700">
                        <CheckIcon size={13} className="text-primary-600" />
                        {item}
                      </p>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-surface-100 pt-3 text-[11px] text-surface-500">
                    <span>Inspector: Ravi K.</span>
                    <span>GPS checked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-20 border-b border-surface-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-primary-700">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-surface-950 sm:text-4xl">
                Three steps. No site visit needed.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-surface-600">
                From your phone, anywhere in the world. You will always know
                exactly where the proof came from.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-surface-200 bg-surface-50/60 p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                        <Icon size={20} />
                      </div>
                      <span className="text-xs font-bold tabular-nums text-surface-300">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-surface-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-surface-600">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-primary-100 bg-primary-50/60 p-4 sm:items-center">
              <ShieldCheckIcon size={18} className="mt-0.5 flex-shrink-0 text-primary-700 sm:mt-0" />
              <p className="text-sm leading-relaxed text-primary-900">
                <strong className="font-semibold">The 100 m rule:</strong> a photo
                is only submitted when the inspector's GPS is within 100 metres
                of your pin. This is checked by the server, not just the app.
              </p>
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="border-b border-surface-200 bg-surface-50">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary-700">
                  What you get
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-surface-950 sm:text-4xl">
                  Proof, not just a promise.
                </h2>
                <p className="mt-3 max-w-md text-base leading-relaxed text-surface-600">
                  Every visit leaves a clear record you can check later — or share
                  with your family, lawyer or bank.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {FEATURES.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="rounded-2xl border border-surface-200 bg-white p-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                        <Icon size={19} />
                      </div>
                      <h3 className="mt-4 text-[15px] font-semibold text-surface-900">
                        {feature.title}
                      </h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-surface-600">
                        {feature.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="border-b border-surface-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary-700">
                  Made for real property checks
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-surface-950 sm:text-4xl">
                  Wherever you are, we can look.
                </h2>
              </div>
              <Link
                to="/verify/signup"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800"
              >
                Start a request
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {USE_CASES.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4 rounded-2xl border border-surface-200 p-5">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                      <Icon size={19} />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-surface-900">{item.title}</h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-surface-600">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing preview */}
        <section className="border-b border-surface-200 bg-surface-50">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-2 lg:items-center lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary-700">
                Simple pricing
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-surface-950 sm:text-4xl">
                One visit. One clear price.
              </h2>
              <p className="mt-3 max-w-md text-base leading-relaxed text-surface-600">
                No travel charges. No subscriptions. Choose the level of detail
                you need and pay per visit.
              </p>
              <Button to="/pricing" variant="secondary" className="mt-6">
                View plans and pricing
              </Button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-surface-200 bg-white">
              <div className="flex items-center justify-between border-b border-surface-150 px-5 py-4">
                <div>
                  <p className="text-[15px] font-semibold text-surface-900">Standard visit</p>
                  <p className="text-xs text-surface-500">Exterior check and one GPS-verified photo</p>
                </div>
                <p className="text-xl font-extrabold text-surface-950">₹999</p>
              </div>
              <div className="flex items-center justify-between border-b border-surface-150 px-5 py-4">
                <div>
                  <p className="text-[15px] font-semibold text-surface-900">Detailed audit</p>
                  <p className="text-xs text-surface-500">Priority visit and a custom checklist</p>
                </div>
                <p className="text-xl font-extrabold text-surface-950">₹2,499</p>
              </div>
              <div className="flex items-center gap-2 bg-surface-50 px-5 py-3.5 text-xs text-surface-500">
                <CheckIcon size={13} className="flex-shrink-0 text-primary-600" />
                Pay only for the visit you request
              </div>
            </div>
          </div>
        </section>

        {/* Inspector CTA */}
        <section className="bg-primary-900">
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-accent-300">
                For inspectors
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Already nearby? Get paid to check.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-primary-100">
                Accept a property visit in your area, take a GPS-verified photo,
                and earn per completed visit. Work when you want.
              </p>
            </div>
            <Link
              to="/captain"
              className="inline-flex h-12 flex-shrink-0 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-primary-900 transition-colors hover:bg-primary-50"
            >
              Work as an inspector
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-primary-700">FAQ</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-surface-950">
                Common questions
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
