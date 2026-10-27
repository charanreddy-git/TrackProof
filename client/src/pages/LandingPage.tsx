import { Link } from "react-router-dom";
import {
  MarketingHeader,
  MarketingFooter,
  Button,
  FaqAccordion,
  SampleDossier,
  CheckIcon,
  ArrowRightIcon,
  MapPinIcon,
  CameraIcon,
  ShieldCheckIcon,
  ClockIcon,
  HomeIcon,
  CompassIcon,
  ZapIcon,
} from "../components";

const NAV_ITEMS = [
  { label: "How it works", to: "#how-it-works", isAnchor: true },
  { label: "Pricing", to: "/pricing" },
  { label: "For inspectors", to: "/captain" },
];

const FAQS = [
  {
    q: "How do I show you which property to visit?",
    a: "Paste a Google Maps link or drop a pin on the exact spot. That pin is what the inspector travels to — a street address is helpful but not required. This works well for plots, gated communities, and properties you have never seen in person.",
  },
  {
    q: "How is this different from a photo a relative sends me?",
    a: "The inspector takes the photo inside PinProof. The app records the capture time, GPS location, and accuracy along with the image. The server rejects proof taken more than 100 metres from your pin, so you know it came from the property you asked about.",
  },
  {
    q: "I live outside India. Can I book a visit?",
    a: "Yes. The whole process works from your browser — no Indian phone number, local app, or relative on the ground is needed. Prices are in rupees, and you can review the proof from wherever you are.",
  },
  {
    q: "How quickly will someone visit?",
    a: "Most visits are accepted within a few hours and completed within 24–48 hours. The Detailed visit gets priority matching when an inspector is available near your property.",
  },
  {
    q: "Do I need to install an app?",
    a: "No. Requesters and inspectors both use PinProof in a mobile or desktop browser. Camera and location permissions come from your browser.",
  },
];

const STEPS = [
  {
    icon: MapPinIcon,
    step: "1",
    title: "Pin the property",
    desc: "Share a Google Maps link or tap the exact location. Add a note about what you want checked.",
    time: "Takes about 2 minutes",
    tint: "bg-primary-50 text-primary-700",
  },
  {
    icon: CompassIcon,
    step: "2",
    title: "A local inspector goes",
    desc: "Someone nearby accepts the visit. You can follow their trip on the map as they travel.",
    time: "Most visits start within hours",
    tint: "bg-accent-50 text-accent-700",
  },
  {
    icon: CameraIcon,
    step: "3",
    title: "You get the proof",
    desc: "A dated, GPS-verified photo and a clear visit summary arrive in your dashboard.",
    time: "Usually within 24–48 hours",
    tint: "bg-success-50 text-success-700",
  },
];

const USE_CASES = [
  {
    icon: HomeIcon,
    title: "A plot far from home",
    desc: "Check boundary walls, approach roads, encroachment, and vacant possession.",
    tag: "Land and plots",
    tint: "bg-primary-50 text-primary-700",
  },
  {
    icon: CameraIcon,
    title: "Construction progress",
    desc: "See the slab, site activity, material storage, and access without a flight.",
    tag: "Under construction",
    tint: "bg-accent-50 text-accent-700",
  },
  {
    icon: MapPinIcon,
    title: "A rental before you sign",
    desc: "Check the condition, water, parking, and the street outside before committing.",
    tag: "Rentals and resale",
    tint: "bg-info-50 text-info-700",
  },
  {
    icon: ShieldCheckIcon,
    title: "A family property, shared",
    desc: "Keep an independent record for siblings, parents, or a decision across time zones.",
    tag: "Family and NRI",
    tint: "bg-warning-50 text-warning-700",
  },
];

const PROOF_POINTS = [
  "A photo taken inside the app, not forwarded from a gallery",
  "GPS coordinates and accuracy saved with the image",
  "Capture time and submission time, recorded by the server",
  "A private visit page you can revisit whenever you need it",
];

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-50 font-sans text-surface-900">
      <MarketingHeader
        navItems={NAV_ITEMS}
        ctaLabel="Book a visit"
        ctaTo="/verify/signup"
      />

      <main className="flex-1">
        {/* ─── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-surface-50">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 top-8 h-[28rem] w-[28rem] rounded-full bg-accent-100/70 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-primary-100/60 blur-2xl"
          />

          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:gap-14 lg:px-8 lg:pb-20 lg:pt-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3 py-1.5 text-[11.5px] font-bold text-primary-800 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-primary-500" />
                Local inspectors across India
              </span>

              <h1 className="mt-5 max-w-[12ch] text-[2.9rem] font-extrabold leading-[0.98] tracking-[-0.05em] text-surface-950 sm:text-[3.9rem] lg:text-[4.4rem]">
                See your property.
                <br />
                <span className="text-primary-700">From anywhere.</span>
              </h1>

              <p className="mt-5 max-w-[33rem] text-[15px] leading-[1.7] text-surface-600 sm:text-[16.5px]">
                A trusted local inspector visits your plot, flat, or construction
                site. You get a dated, GPS-verified photo and a clear visit summary
                — without making the trip.
              </p>

              <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <Button to="/verify/signup" variant="accent" size="lg" className="w-full sm:w-auto">
                  Book a property visit
                  <ArrowRightIcon size={17} />
                </Button>
                <a
                  href="#sample-visit"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-[14px] font-bold text-surface-700 transition-colors hover:bg-white hover:text-surface-950 sm:justify-start"
                >
                  See a sample visit
                  <span aria-hidden="true" className="text-surface-400">↓</span>
                </a>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-semibold text-surface-600">
                <span className="inline-flex items-center gap-1.5">
                  <CheckIcon size={14} className="text-primary-600" />
                  From ₹999 per visit
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckIcon size={14} className="text-primary-600" />
                  100 m GPS check
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckIcon size={14} className="text-primary-600" />
                  UPI-friendly
                </span>
              </div>

              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-surface-200 bg-white/80 p-3 shadow-sm sm:max-w-md">
                <div className="flex -space-x-2">
                  {["A", "R", "S"].map((initial, index) => (
                    <span
                      key={initial}
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-[11px] font-extrabold ${
                        index === 0
                          ? "bg-accent-200 text-primary-900"
                          : index === 1
                            ? "bg-primary-100 text-primary-800"
                            : "bg-info-100 text-info-700"
                      }`}
                    >
                      {initial}
                    </span>
                  ))}
                </div>
                <p className="text-[11.5px] leading-relaxed text-surface-600">
                  <strong className="font-bold text-surface-900">Built for owners, buyers, and NRIs.</strong>{" "}
                  Google Maps pins, Indian rupees, no app download.
                </p>
              </div>
            </div>

            <div id="sample-visit" className="relative scroll-mt-24 lg:pl-4">
              <div
                aria-hidden="true"
                className="absolute inset-x-5 bottom-3 top-8 rotate-2 rounded-[2rem] bg-accent-200/70 sm:inset-x-8"
              />
              <div className="relative">
                <SampleDossier />
              </div>

              <div className="absolute -left-1 top-16 hidden items-center gap-2 rounded-full border border-surface-200 bg-white px-3 py-2 text-[11px] font-bold text-surface-800 shadow-card sm:flex lg:-left-3">
                <ShieldCheckIcon size={14} className="text-primary-600" />
                GPS verified
              </div>
              <div className="absolute -right-1 bottom-16 hidden items-center gap-2 rounded-full border border-surface-200 bg-white px-3 py-2 text-[11px] font-bold text-surface-800 shadow-card sm:flex lg:-right-2">
                <ClockIcon size={14} className="text-accent-600" />
                In 24–48 hours
              </div>
              <p className="mt-3 text-center text-[10.5px] font-medium text-surface-500">
                Illustrative sample · not a customer visit
              </p>
            </div>
          </div>

          <div className="relative border-y border-surface-200 bg-white/60">
            <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-surface-200 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
              {[
                { icon: MapPinIcon, value: "Google Maps pin", label: "is all we need" },
                { icon: ShieldCheckIcon, value: "100 metres", label: "GPS proof radius" },
                { icon: ZapIcon, value: "₹999", label: "flat, per visit" },
                { icon: ClockIcon, value: "24–48 hours", label: "typical turnaround" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={value} className="flex items-center gap-2.5 px-3 py-4 sm:px-5">
                  <Icon size={18} className="hidden flex-shrink-0 text-primary-600 sm:block" />
                  <div>
                    <p className="text-[12.5px] font-extrabold leading-tight text-surface-900">{value}</p>
                    <p className="mt-0.5 text-[10.5px] font-medium text-surface-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How it works ─────────────────────────────────────────────── */}
        <section id="how-it-works" className="scroll-mt-20 bg-primary-950 text-white">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-[12px] font-bold text-accent-400">Simple from start to finish</p>
              <h2 className="mt-2 text-[2.15rem] font-extrabold leading-[1.04] tracking-[-0.04em] sm:text-[3rem]">
                Three steps. One clear proof.
              </h2>
              <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-primary-200">
                No calls, no bargaining, no “just trust me” photos. You pin it, an
                inspector goes, and the proof comes back to your dashboard.
              </p>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {STEPS.map(({ icon: Icon, step, title, desc, time, tint }) => (
                <div
                  key={step}
                  className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 transition-colors hover:bg-white/[0.1]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tint}`}>
                      <Icon size={20} />
                    </span>
                    <span className="text-[2.2rem] font-extrabold leading-none text-white/15">{step}</span>
                  </div>
                  <h3 className="mt-4 text-[1.15rem] font-bold text-white">{title}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-primary-200">{desc}</p>
                  <p className="mt-4 border-t border-white/10 pt-3 text-[10.5px] font-semibold text-accent-300">
                    {time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Proof standard ───────────────────────────────────────────── */}
        <section className="bg-surface-100">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8">
            <div>
              <p className="text-[12px] font-bold text-primary-700">Proof you can place</p>
              <h2 className="mt-2 max-w-[15ch] text-[2.15rem] font-extrabold leading-[1.04] tracking-[-0.04em] text-surface-950 sm:text-[3rem]">
                A photo is only useful if you know where it came from.
              </h2>
              <p className="mt-4 max-w-lg text-[14px] leading-[1.75] text-surface-600">
                PinProof checks the distance between the inspector’s photo and
                your pin. If it is more than 100 metres away, the server will not
                accept it.
              </p>

              <ul className="mt-6 space-y-2.5">
                {PROOF_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-[13px] font-medium text-surface-700">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                      <CheckIcon size={11} className="text-primary-700" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>

              <Link
                to="/verify/signup"
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary-800 px-5 text-[13px] font-bold text-white transition-colors hover:bg-primary-900"
              >
                Book a visit
                <ArrowRightIcon size={15} />
              </Link>
            </div>

            <div className="relative">
              <div className="rounded-3xl bg-primary-800 p-5 text-white shadow-elevated sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11.5px] font-bold text-primary-200">The 100 m rule</p>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-accent-300">
                    Server-checked
                  </span>
                </div>

                <div className="mt-6 flex items-end gap-2">
                  <span className="text-[5.4rem] font-extrabold leading-[0.78] tracking-[-0.07em] sm:text-[6.5rem]">100</span>
                  <span className="mb-1.5 text-[13px] font-bold text-accent-300">metres</span>
                </div>
                <p className="mt-5 text-[1.15rem] font-bold leading-snug text-white">
                  The maximum distance between your pin and an accepted proof photo.
                </p>

                <div className="mt-6 space-y-2 rounded-2xl bg-white/[0.07] p-3.5">
                  {[
                    "Distance checked when the photo is uploaded",
                    "Coordinates and accuracy saved with the image",
                    "Capture and submission times recorded",
                  ].map((item) => (
                    <p key={item} className="flex items-start gap-2 text-[11.5px] leading-relaxed text-primary-100">
                      <CheckIcon size={12} className="mt-0.5 flex-shrink-0 text-accent-400" />
                      {item}
                    </p>
                  ))}
                </div>

                <p className="mt-4 flex items-center gap-2 text-[10.5px] font-semibold text-primary-300">
                  <ShieldCheckIcon size={13} className="text-accent-400" />
                  A gallery upload is allowed only if the camera cannot be used. The location check still applies.
                </p>
              </div>

              <div className="absolute -bottom-4 -left-3 hidden rotate-[-3deg] rounded-2xl border border-surface-200 bg-white px-3.5 py-2.5 shadow-card sm:block">
                <p className="text-[10px] font-medium text-surface-500">Proof photo</p>
                <p className="mt-0.5 text-[12px] font-extrabold text-primary-800">23 m from pin</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Use cases ────────────────────────────────────────────────── */}
        <section className="bg-surface-50">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-[12px] font-bold text-primary-700">Where it helps</p>
                <h2 className="mt-2 max-w-[18ch] text-[2.15rem] font-extrabold leading-[1.04] tracking-[-0.04em] text-surface-950 sm:text-[3rem]">
                  For the decisions you can’t make from a distance.
                </h2>
              </div>
              <p className="max-w-xs text-[12.5px] leading-relaxed text-surface-500">
                Common reasons people book a local inspector instead of a flight.
              </p>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {USE_CASES.map(({ icon: Icon, title, desc, tag, tint }) => (
                <Link
                  key={title}
                  to="/verify/signup"
                  className="group rounded-2xl border border-surface-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tint}`}>
                      <Icon size={20} />
                    </span>
                    <span className="rounded-full bg-surface-100 px-2.5 py-1 text-[10px] font-bold text-surface-500">
                      {tag}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[1.1rem] font-bold text-surface-950 transition-colors group-hover:text-primary-800">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-surface-600">{desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-bold text-primary-700">
                    Book this visit
                    <ArrowRightIcon size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Pricing ──────────────────────────────────────────────────── */}
        <section className="bg-accent-50/70">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-[12px] font-bold text-accent-800">Simple pricing</p>
                <h2 className="mt-2 text-[2.15rem] font-extrabold leading-[1.04] tracking-[-0.04em] text-surface-950 sm:text-[3rem]">
                  One visit. One flat fee.
                </h2>
              </div>
              <p className="max-w-xs text-[12.5px] leading-relaxed text-surface-600">
                No subscription, no travel surcharge, no per-kilometre surprises.
              </p>
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-2">
              {[
                {
                  name: "Standard visit",
                  price: "999",
                  desc: "For a basic exterior check and one GPS-verified photo.",
                  time: "Usually within 24–48 hours",
                  popular: false,
                  features: [
                    "One flat rate for the visit",
                    "One GPS-verified photo",
                    "Live visit tracking",
                    "Your proof stays in your dashboard",
                  ],
                },
                {
                  name: "Detailed visit",
                  price: "2,499",
                  desc: "For a longer checklist and priority inspector matching.",
                  time: "Priority — usually within 12 hours",
                  popular: true,
                  features: [
                    "Everything in Standard",
                    "Priority inspector matching",
                    "Custom checklist for the inspector",
                    "Same 100 m proof standard",
                  ],
                },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-3xl border p-5 sm:p-6 ${
                    plan.popular
                      ? "border-primary-800 bg-primary-900 text-white shadow-elevated"
                      : "border-surface-200 bg-white text-surface-950 shadow-sm"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute right-4 top-4 rounded-full bg-accent-400 px-2.5 py-1 text-[10px] font-bold text-primary-950">
                      Most popular
                    </span>
                  )}
                  <h3 className={`text-[1.15rem] font-bold ${plan.popular ? "text-white" : "text-surface-950"}`}>
                    {plan.name}
                  </h3>
                  <p className={`mt-1 max-w-xs text-[12px] leading-relaxed ${plan.popular ? "text-primary-200" : "text-surface-500"}`}>
                    {plan.time}
                  </p>

                  <div className={`mt-4 flex items-baseline gap-1 border-y py-4 ${plan.popular ? "border-white/15" : "border-surface-200"}`}>
                    <span className={`text-[2.6rem] font-extrabold leading-none tracking-[-0.05em] ${plan.popular ? "text-white" : "text-surface-950"}`}>
                      ₹{plan.price}
                    </span>
                    <span className={`pb-1 text-[11px] font-semibold ${plan.popular ? "text-primary-300" : "text-surface-500"}`}>
                      / visit
                    </span>
                  </div>

                  <p className={`mt-3 text-[12.5px] leading-relaxed ${plan.popular ? "text-primary-200" : "text-surface-600"}`}>
                    {plan.desc}
                  </p>

                  <ul className="mt-4 flex-1 space-y-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className={`flex items-start gap-2 text-[12px] font-medium ${plan.popular ? "text-primary-100" : "text-surface-700"}`}
                      >
                        <CheckIcon
                          size={13}
                          className={`mt-0.5 flex-shrink-0 ${plan.popular ? "text-accent-400" : "text-primary-600"}`}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    to="/verify/signup"
                    variant={plan.popular ? "accent" : "secondary"}
                    className="mt-5 w-full"
                  >
                    Book this visit
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-accent-200 bg-white/70 px-4 py-3">
              <p className="text-[11.5px] font-medium text-surface-600">
                Pay per visit. UPI, cards, and international transfer can be discussed before the visit.
              </p>
              <Link to="/pricing" className="inline-flex min-h-9 items-center gap-1.5 text-[11.5px] font-bold text-primary-700">
                See full pricing
                <ArrowRightIcon size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Inspector CTA ────────────────────────────────────────────── */}
        <section className="bg-accent-400">
          <div className="mx-auto grid max-w-6xl gap-5 px-4 py-10 sm:px-6 sm:py-14 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
            <div>
              <p className="text-[12px] font-bold text-primary-800">For local inspectors</p>
              <h2 className="mt-1.5 max-w-2xl text-[1.8rem] font-extrabold leading-[1.06] tracking-[-0.035em] text-primary-950 sm:text-[2.5rem]">
                Already nearby? Get paid to check.
              </h2>
              <p className="mt-2 max-w-xl text-[13px] font-medium leading-relaxed text-primary-900/80">
                Accept a property visit in your area, take a GPS-checked proof photo,
                and earn per completed visit. No joining fee, no fixed hours.
              </p>
            </div>
            <Link
              to="/captain"
              className="inline-flex h-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-950 px-5 text-[13.5px] font-bold text-white shadow-sm transition-colors hover:bg-primary-900"
            >
              Start inspecting
              <ArrowRightIcon size={15} className="ml-2" />
            </Link>
          </div>
        </section>

        {/* ─── FAQ ─────────────────────────────────────────────────────── */}
        <section className="bg-surface-50">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16 lg:px-8">
            <div>
              <p className="text-[12px] font-bold text-primary-700">Common questions</p>
              <h2 className="mt-2 text-[2.15rem] font-extrabold leading-[1.04] tracking-[-0.04em] text-surface-950 sm:text-[2.8rem]">
                Still deciding?
              </h2>
              <p className="mt-3 max-w-xs text-[12.5px] leading-relaxed text-surface-500">
                Write to{" "}
                <a
                  href="mailto:hello@pinproof.in"
                  className="font-bold text-primary-700 underline underline-offset-4"
                >
                  hello@pinproof.in
                </a>
                . A real person replies.
              </p>
              <div className="mt-5 rounded-2xl border border-surface-200 bg-white p-4 shadow-sm">
                <p className="flex items-center gap-2 text-[12px] font-bold text-surface-900">
                  <ShieldCheckIcon size={15} className="text-primary-600" />
                  Your proof is private
                </p>
                <p className="mt-2 text-[11.5px] leading-relaxed text-surface-500">
                  Visit photos and coordinates are visible only to the people on that
                  visit. They are not public listings.
                </p>
              </div>
            </div>
            <FaqAccordion items={FAQS} />
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
