import {
  MarketingHeader,
  MarketingFooter,
  Button,
  FaqAccordion,
  CheckIcon,
  ShieldCheckIcon,
  ClockIcon,
  MapPinIcon,
  CameraIcon,
  ArrowRightIcon,
} from "../components";

interface Plan {
  id: string;
  name: string;
  priceINR: string;
  priceUSD: string;
  turnaround: string;
  bestFor: string;
  features: string[];
  recommended?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "standard",
    name: "Standard visit",
    priceINR: "999",
    priceUSD: "12",
    turnaround: "Usually within 24–48 hours",
    bestFor: "Vacant plots, basic exterior checks, and confirming a property exists.",
    features: [
      "One flat rate for the visit",
      "One GPS-verified photo",
      "Live visit tracking",
      "Visit summary in your dashboard",
      "No travel or distance charges",
    ],
  },
  {
    id: "detailed",
    name: "Detailed visit",
    priceINR: "2,499",
    priceUSD: "30",
    turnaround: "Priority — usually within 12 hours",
    bestFor: "NRIs and serious buyers who need a longer checklist and priority matching.",
    features: [
      "Everything in Standard",
      "Priority inspector matching",
      "Custom inspection checklist",
      "Same 100 m proof standard",
    ],
    recommended: true,
  },
];

const INCLUDED = [
  {
    icon: ShieldCheckIcon,
    title: "GPS-verified proof",
    desc: "A photo only counts when taken within 100 m of your pin.",
  },
  {
    icon: MapPinIcon,
    title: "Live tracking",
    desc: "Follow the inspector’s trip to the property on the map.",
  },
  {
    icon: ClockIcon,
    title: "Clear turnaround",
    desc: "Know when to expect your visit summary in the dashboard.",
  },
  {
    icon: CameraIcon,
    title: "Private photos",
    desc: "Your proof is visible only to the people on the visit.",
  },
];

const STEPS = [
  {
    number: "1",
    title: "Choose a visit",
    desc: "Standard suits most plots. Choose Detailed for a longer checklist and priority matching.",
  },
  {
    number: "2",
    title: "Pin the property",
    desc: "Share a Google Maps link or tap the exact location. Add instructions for the inspector.",
  },
  {
    number: "3",
    title: "Review the proof",
    desc: "The photo, location details, and visit summary arrive together in your dashboard.",
  },
];

const FAQS = [
  {
    q: "Are there travel or distance charges?",
    a: "No. The price shown is the price for a visit within the city. We do not add per-kilometre travel fees on top.",
  },
  {
    q: "What is the difference between Standard and Detailed?",
    a: "Standard covers an exterior visit with one GPS-verified photo — ideal for a vacant plot or a basic existence check. Detailed adds priority matching, a custom checklist, and a longer visit for a fuller inspection.",
  },
  {
    q: "Can I ask the inspector to check specific things?",
    a: "Yes. When you create a request, describe exactly what you need checked. The Detailed visit is best if you have a longer checklist or need a fuller inspection.",
  },
  {
    q: "Can I pay from outside India?",
    a: "Pricing is shown in Indian rupees, with an approximate USD amount for reference. Payment arrangements are confirmed before the visit. UPI, card, and international transfer options can be discussed at that stage.",
  },
  {
    q: "What if no inspector accepts my request?",
    a: "Most requests are accepted within a few hours. If no inspector is available in your area, your request stays open and your dashboard reflects that. You can create another request at any time.",
  },
];

export function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-50 font-sans text-surface-900">
      <MarketingHeader
        navItems={[
          { label: "How it works", to: "/#how-it-works" },
          { label: "Pricing", to: "/pricing", isActive: true },
          { label: "For inspectors", to: "/captain" },
        ]}
        ctaLabel="Book a visit"
        ctaTo="/verify/signup"
      />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-surface-200 bg-surface-50">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-20 h-80 w-80 rounded-full bg-accent-100/80 blur-2xl"
          />
          <div className="relative mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-16 lg:py-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3 py-1.5 text-[11.5px] font-bold text-primary-800 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary-500" />
              Honest, flat pricing
            </span>
            <h1 className="mt-5 text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.045em] text-surface-950 sm:text-[3.4rem]">
              One visit. One flat fee.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[14.5px] leading-[1.7] text-surface-600">
              Choose the depth of check you need and pay per visit. No subscription,
              no add-ons, no per-kilometre surprises.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12px] font-semibold text-surface-600">
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon size={13} className="text-primary-600" />
                Indian rupees
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon size={13} className="text-primary-600" />
                UPI-friendly
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon size={13} className="text-primary-600" />
                No app needed
              </span>
            </div>
          </div>
        </section>

        <section className="border-b border-surface-200 bg-surface-100/70">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="grid items-stretch gap-4 md:grid-cols-2">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-3xl border p-5 sm:p-6 ${
                    plan.recommended
                      ? "border-primary-800 bg-primary-900 text-white shadow-elevated"
                      : "border-surface-200 bg-white text-surface-950 shadow-card"
                  }`}
                >
                  {plan.recommended && (
                    <span className="absolute right-4 top-4 rounded-full bg-accent-400 px-2.5 py-1 text-[10px] font-bold text-primary-950">
                      Best for NRIs
                    </span>
                  )}

                  <h2 className={`text-[1.25rem] font-bold ${plan.recommended ? "text-white" : "text-surface-950"}`}>
                    {plan.name}
                  </h2>
                  <p className={`mt-1 text-[12px] font-medium ${plan.recommended ? "text-primary-200" : "text-surface-500"}`}>
                    {plan.turnaround}
                  </p>

                  <div className={`mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-y py-5 ${plan.recommended ? "border-white/15" : "border-surface-200"}`}>
                    <span className={`text-[3.2rem] font-extrabold leading-[0.85] tracking-[-0.055em] ${plan.recommended ? "text-white" : "text-surface-950"}`}>
                      ₹{plan.priceINR}
                    </span>
                    <span className={`pb-1 text-[11px] font-semibold ${plan.recommended ? "text-primary-300" : "text-surface-500"}`}>
                      / visit · approx. ${plan.priceUSD}
                    </span>
                  </div>

                  <p className={`mt-4 text-[13px] leading-relaxed ${plan.recommended ? "text-primary-200" : "text-surface-600"}`}>
                    {plan.bestFor}
                  </p>

                  <ul className="mt-5 flex-1 space-y-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className={`flex items-start gap-2 text-[12.5px] font-medium ${plan.recommended ? "text-primary-100" : "text-surface-700"}`}
                      >
                        <CheckIcon
                          size={13}
                          className={`mt-0.5 flex-shrink-0 ${plan.recommended ? "text-accent-400" : "text-primary-600"}`}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    to="/verify/signup"
                    variant={plan.recommended ? "accent" : "secondary"}
                    className="mt-6 w-full"
                  >
                    Book this visit
                    <ArrowRightIcon size={15} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-surface-200 bg-white px-4 py-3.5 shadow-sm">
              <ShieldCheckIcon size={16} className="mt-0.5 flex-shrink-0 text-primary-600" />
              <p className="text-[12px] leading-relaxed text-surface-600">
                Every visit includes GPS verification, a photo with recorded capture
                time, and access to your complete visit history. Request a visit only
                when you are ready.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-surface-200 bg-surface-50">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-[12px] font-bold text-primary-700">Included every time</p>
                <h2 className="mt-2 text-[2rem] font-extrabold leading-tight tracking-[-0.035em] text-surface-950 sm:text-[2.5rem]">
                  The important bits, standard.
                </h2>
              </div>
              <p className="max-w-xs text-[12px] leading-relaxed text-surface-500">
                No app · no subscription · no hidden travel fees
              </p>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {INCLUDED.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-2xl border border-surface-200 bg-white p-4 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                    <Icon size={18} />
                  </span>
                  <h3 className="mt-3 text-[13.5px] font-bold text-surface-900">{title}</h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-surface-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-surface-200 bg-surface-100">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[0.62fr_1.38fr] lg:gap-16 lg:px-8">
            <div>
              <p className="text-[12px] font-bold text-primary-700">How booking works</p>
              <h2 className="mt-2 text-[2rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-surface-950 sm:text-[2.5rem]">
                From request to proof.
              </h2>
              <p className="mt-3 max-w-xs text-[12.5px] leading-relaxed text-surface-500">
                You can book from a phone, laptop, or anywhere with a browser.
              </p>
            </div>
            <div className="space-y-3">
              {STEPS.map((step) => (
                <div key={step.number} className="flex items-start gap-3 rounded-2xl border border-surface-200 bg-white p-4 shadow-sm">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-800 text-[12px] font-extrabold text-white">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-[13.5px] font-bold text-surface-900">{step.title}</h3>
                    <p className="mt-1 max-w-xl text-[12.5px] leading-relaxed text-surface-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-50">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.62fr_1.38fr] lg:gap-16 lg:px-8">
            <div>
              <p className="text-[12px] font-bold text-primary-700">Questions</p>
              <h2 className="mt-2 text-[2rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-surface-950 sm:text-[2.5rem]">
                Pricing, explained.
              </h2>
              <p className="mt-3 max-w-xs text-[12.5px] leading-relaxed text-surface-500">
                Still unsure? Write to{" "}
                <a href="mailto:hello@trackproof.in" className="font-bold text-primary-700 underline underline-offset-4">
                  hello@trackproof.in
                </a>
                .
              </p>
            </div>
            <FaqAccordion items={FAQS} />
          </div>
        </section>

        <section className="bg-primary-900">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center lg:px-8">
            <div>
              <h2 className="text-[1.8rem] font-extrabold leading-tight tracking-[-0.03em] text-white sm:text-[2.2rem]">
                Ready to see the property?
              </h2>
              <p className="mt-1.5 text-[12.5px] font-medium text-primary-200">
                Pin the location and tell us what to check. About two minutes.
              </p>
            </div>
            <Button to="/verify/signup" variant="accent" className="flex-shrink-0">
              Book a visit
              <ArrowRightIcon size={15} />
            </Button>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
