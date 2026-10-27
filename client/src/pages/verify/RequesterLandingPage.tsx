import {
  MarketingHeader,
  MarketingFooter,
  Button,
  FaqAccordion,
  SampleDossier,
  CheckIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  MapPinIcon,
  CameraIcon,
  CompassIcon,
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
    a: "The inspector travels to the exact pin you share, checks the property from the outside (and inside for a Detailed visit), takes a photo through PinProof, and submits it. You can add specific instructions for them.",
  },
  {
    q: "Can I book a visit for a plot with no address?",
    a: "Yes. A Google Maps pin is the most reliable location for a plot. You can paste a Maps link or tap the exact spot on the map. That coordinate is what the inspector travels to.",
  },
  {
    q: "How will I know the photo was taken at my property?",
    a: "Proof can only be submitted from within 100 m of your pin. The location and time are stored with the visit, so you can see where and when the photo was taken.",
  },
  {
    q: "How quickly can someone visit?",
    a: "Most requests are accepted within a few hours and completed within 24–48 hours. The Detailed visit gets priority matching where an inspector is available.",
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
    tint: "bg-primary-50 text-primary-700",
  },
  {
    icon: CompassIcon,
    title: "Follow the visit",
    desc: "A local inspector accepts and starts the trip. Watch their location on the map if you like.",
    tint: "bg-accent-50 text-accent-700",
  },
  {
    icon: CameraIcon,
    title: "Get the proof",
    desc: "A GPS-verified photo and a clear visit summary arrive in your dashboard for review.",
    tint: "bg-info-50 text-info-700",
  },
];

export function RequesterLandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-50 font-sans text-surface-900">
      <MarketingHeader
        navItems={NAV_ITEMS}
        ctaLabel="Book a visit"
        ctaTo="/verify/signup"
      />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-surface-200 bg-surface-50">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-10 h-[24rem] w-[24rem] rounded-full bg-accent-100/80 blur-2xl"
          />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-14 lg:px-8 lg:py-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3 py-1.5 text-[11.5px] font-bold text-primary-800 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-primary-500" />
                For owners, buyers, and families abroad
              </span>
              <h1 className="mt-5 max-w-[13ch] text-[2.9rem] font-extrabold leading-[0.98] tracking-[-0.05em] text-surface-950 sm:text-[3.8rem]">
                Your property.
                <br />
                <span className="text-primary-700">Checked locally.</span>
              </h1>
              <p className="mt-5 max-w-lg text-[15px] leading-[1.7] text-surface-600">
                A nearby inspector visits the exact pin, takes a GPS-verified photo,
                and sends back a clear visit summary. No travel, no guesswork, no
                forwarded picture with no context.
              </p>

              <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
                <Button to="/verify/signup" variant="accent" size="lg" className="w-full sm:w-auto">
                  Book a property visit
                  <ArrowRightIcon size={16} />
                </Button>
                <Button to="/pricing" variant="secondary" size="lg" className="w-full sm:w-auto">
                  See pricing
                </Button>
              </div>

              <p className="mt-4 text-[11.5px] font-semibold text-surface-500">
                From ₹999 per visit · No app needed · UPI-friendly
              </p>
            </div>

            <div>
              <SampleDossier />
              <p className="mt-3 text-center text-[10.5px] font-medium text-surface-500">
                Illustrative sample visit
              </p>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 border-b border-surface-200 bg-primary-950">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-[12px] font-bold text-accent-400">How it works</p>
              <h2 className="mt-2 text-[2.1rem] font-extrabold leading-[1.04] tracking-[-0.04em] text-white sm:text-[2.9rem]">
                Two minutes to send someone.
              </h2>
              <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-primary-200">
                You do not need an address, an Indian phone number, or a relative on
                the ground. The pin is the address.
              </p>
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-3">
              {STEPS.map(({ icon: Icon, title, desc, tint }, index) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.07] p-5">
                  <div className="flex items-center justify-between">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tint}`}>
                      <Icon size={20} />
                    </span>
                    <span className="text-[2rem] font-extrabold leading-none text-white/15">{index + 1}</span>
                  </div>
                  <h3 className="mt-4 text-[1.1rem] font-bold text-white">{title}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-primary-200">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-surface-200 bg-surface-50">
          <div className="mx-auto grid max-w-6xl gap-9 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:px-8">
            <div>
              <p className="text-[12px] font-bold text-primary-700">What we can check</p>
              <h2 className="mt-2 max-w-[15ch] text-[2.1rem] font-extrabold leading-[1.04] tracking-[-0.04em] text-surface-950 sm:text-[2.8rem]">
                Tell us what matters on site.
              </h2>
              <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-surface-600">
                These are common checks. You can write your own instructions in the
                request — the inspector follows them on site.
              </p>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {CHECKS.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 rounded-xl border border-surface-200 bg-white px-3.5 py-3 text-[12.5px] font-semibold text-surface-700 shadow-sm"
                  >
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                      <CheckIcon size={11} className="text-primary-700" />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-primary-800 p-5 text-white shadow-elevated sm:p-6">
              <p className="flex items-center gap-2 text-[11.5px] font-bold text-accent-300">
                <ShieldCheckIcon size={14} />
                Location is checked, not claimed
              </p>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-[4.8rem] font-extrabold leading-[0.78] tracking-[-0.06em]">100</span>
                <span className="mb-1.5 text-[12px] font-bold text-primary-200">metres</span>
              </div>
              <h3 className="mt-5 text-[1.2rem] font-bold leading-snug">
                The server checks the distance when proof is uploaded.
              </h3>
              <p className="mt-2.5 text-[12px] leading-relaxed text-primary-200">
                Not just at check-in. The photo, GPS coordinates, accuracy, and time
                are attached to the visit. Proof from somewhere else is rejected.
              </p>
              <div className="mt-5 flex items-center gap-2 border-t border-white/15 pt-4">
                <ClockIcon size={14} className="text-accent-300" />
                <p className="text-[10.5px] font-semibold text-primary-200">
                  Capture time and submission time are both recorded
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-surface-200 bg-accent-50/70">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center lg:px-8">
            <div>
              <p className="text-[12px] font-bold text-accent-800">Simple pricing</p>
              <h2 className="mt-1.5 text-[1.8rem] font-extrabold leading-tight tracking-[-0.03em] text-surface-950 sm:text-[2.2rem]">
                Visits start at ₹999.
              </h2>
              <p className="mt-1.5 max-w-md text-[12.5px] leading-relaxed text-surface-600">
                Standard for a basic check. Detailed for a longer checklist and
                priority matching. You pay per visit.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button to="/pricing" variant="secondary">
                Compare visits
              </Button>
              <Button to="/verify/signup" variant="accent">
                Book a visit
                <ArrowRightIcon size={15} />
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-surface-50">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.62fr_1.38fr] lg:gap-16 lg:px-8">
            <div>
              <p className="text-[12px] font-bold text-primary-700">Questions</p>
              <h2 className="mt-2 text-[2.1rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-surface-950 sm:text-[2.6rem]">
                Before you book.
              </h2>
              <p className="mt-3 max-w-xs text-[12.5px] leading-relaxed text-surface-500">
                Write to{" "}
                <a href="mailto:hello@pinproof.in" className="font-bold text-primary-700 underline underline-offset-4">
                  hello@pinproof.in
                </a>{" "}
                if your question is not here.
              </p>
            </div>
            <FaqAccordion items={FAQS} />
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
