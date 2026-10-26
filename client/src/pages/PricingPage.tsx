import {
  MarketingHeader,
  MarketingFooter,
  Button,
  FaqAccordion,
  CheckIcon,
  ShieldCheckIcon,
  NavigationIcon,
  ClockIcon,
  IndianRupeeIcon,
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
    turnaround: "Within 24–48 hours",
    bestFor: "Vacant plots, basic exterior checks, and confirming a property exists.",
    features: [
      "Flat rate for the visit",
      "One GPS-verified photo",
      "Live visit tracking",
      "Visit details in your dashboard",
      "No travel or distance charges",
    ],
  },
  {
    id: "detailed",
    name: "Detailed audit",
    priceINR: "2,499",
    priceUSD: "30",
    turnaround: "Priority — within 12 hours",
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
    icon: NavigationIcon,
    title: "Live tracking",
    desc: "Follow the inspector's trip to your property.",
  },
  {
    icon: ClockIcon,
    title: "Clear turnaround",
    desc: "Know when to expect your visit report.",
  },
  {
    icon: IndianRupeeIcon,
    title: "Flat pricing",
    desc: "No per-kilometre or hidden travel fees.",
  },
];

const STEPS = [
  {
    title: "Choose a visit",
    desc: "Pick the level of detail you need. Standard is enough for most plots; Detailed is for a longer checklist and priority matching.",
  },
  {
    title: "Pin your property",
    desc: "Share a Google Maps link or tap the exact location. Add instructions for the inspector.",
  },
  {
    title: "Review the proof",
    desc: "The photo and visit details appear in your dashboard with the location and time attached.",
  },
];

const FAQS = [
  {
    q: "Are there any travel or distance charges?",
    a: "No. The price shown is the price for a visit within the city. We do not add per-kilometre travel fees on top.",
  },
  {
    q: "What is the difference between Standard and Detailed?",
    a: "Standard covers an exterior visit with one GPS-verified photo — ideal for a vacant plot or a basic existence check. Detailed adds priority matching, a custom checklist and a longer visit for a fuller inspection.",
  },
  {
    q: "Can I ask the inspector to check specific things?",
    a: "Yes. When you create a request, describe exactly what you need checked. The Detailed audit is best if you have a longer checklist or need a fuller inspection.",
  },
  {
    q: "Can I pay from outside India?",
    a: "Pricing is shown in Indian rupees, with an approximate USD amount for reference. Arrangements for payment are confirmed before the visit.",
  },
  {
    q: "What if no inspector accepts my request?",
    a: "Most requests are accepted within a few hours. If no inspector is available in your area, your request stays open and we will update your dashboard. You can create another request at any time.",
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
        ctaLabel="Request a visit"
        ctaTo="/verify/signup"
      />

      <main className="flex-1">
        <section className="paper-bg border-b border-surface-200">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 md:py-20 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-700">
              Simple, flat pricing
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.035em] text-surface-950 sm:text-5xl">
              Pay for the visit.
              <br className="hidden sm:block" /> Not the travel.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-surface-600">
              Choose what you need, pin your property, and get photo proof.
              No subscriptions, no add-ons, no per-kilometre charges.
            </p>
          </div>
        </section>

        <section className="border-b border-surface-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <div className="grid items-stretch gap-5 md:grid-cols-2">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl border bg-white p-6 sm:p-7 ${
                    plan.recommended
                      ? "border-primary-600 ring-4 ring-primary-50"
                      : "border-surface-200"
                  }`}
                >
                  {plan.recommended && (
                    <span className="absolute -top-3 left-6 rounded-full bg-primary-700 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      Best for NRIs
                    </span>
                  )}

                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-surface-950">
                      {plan.name}
                    </h2>
                    <p className="mt-1 text-[13px] font-medium text-surface-500">
                      {plan.turnaround}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-4xl font-extrabold tracking-tight text-surface-950">
                      ₹{plan.priceINR}
                    </span>
                    <span className="text-sm font-medium text-surface-500">/ visit</span>
                    <span className="rounded-md bg-surface-100 px-2 py-0.5 text-[11px] font-medium text-surface-500">
                      approx. ${plan.priceUSD}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-surface-600">
                    {plan.bestFor}
                  </p>

                  <div className="my-6 border-t border-surface-150" />

                  <ul className="flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-surface-700">
                        <CheckIcon size={15} className="mt-0.5 flex-shrink-0 text-primary-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    to="/verify/signup"
                    variant={plan.recommended ? "primary" : "secondary"}
                    className="mt-7 w-full"
                  >
                    Request this visit
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-surface-200 bg-surface-50 p-4 text-[13px] leading-relaxed text-surface-600">
              <ShieldCheckIcon size={16} className="mt-0.5 flex-shrink-0 text-primary-600" />
              <p>
                Every visit includes GPS verification, a photo with a recorded
                capture time, and access to your complete visit history. You only
                request a visit when you are ready.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-surface-200 bg-surface-50">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
            <h2 className="text-center text-2xl font-bold tracking-tight text-surface-950">
              Included with every visit
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {INCLUDED.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-surface-200 bg-white p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-surface-900">{item.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-surface-600">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-surface-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
            <div className="mx-auto max-w-xl text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-primary-700">
                How it works
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-surface-950 sm:text-3xl">
                From request to proof
              </h2>
            </div>

            <div className="mt-9 grid gap-8 sm:grid-cols-3">
              {STEPS.map((step, index) => (
                <div key={step.title}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-700">
                    {index + 1}
                  </div>
                  <h3 className="mt-4 text-[15px] font-semibold text-surface-900">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-surface-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-50">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-primary-700">FAQ</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-surface-950 sm:text-3xl">
                Pricing questions
              </h2>
            </div>
            <div className="mt-8">
              <FaqAccordion items={FAQS} />
            </div>
          </div>
        </section>

        <section className="bg-primary-900">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center lg:px-8">
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Ready to see your property?
              </h2>
              <p className="mt-1 text-sm text-primary-100">
                Pin the location and tell us what to check. It takes about two minutes.
              </p>
            </div>
            <Button
              to="/verify/signup"
              variant="inverse"
              className="flex-shrink-0"
            >
              Request a visit
            </Button>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
