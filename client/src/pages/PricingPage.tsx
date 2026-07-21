import { Card, Button, CompassIcon, CameraIcon, ZapIcon, CheckCircleIcon, MarketingHeader, MarketingFooter, FaqAccordion } from "../components";

interface Plan {
  id: string;
  name: string;
  priceINR: number;
  priceUSD: number;
  turnaround: string;
  useCase: string;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: "standard",
    name: "Standard Visit",
    priceINR: 999,
    priceUSD: 12,
    turnaround: "Within 24 - 48 hours",
    useCase: "Ideal for vacant plots, basic exterior checks, and ensuring a property physically exists before transferring tokens.",
    features: [
      "Flat rate anywhere in the city",
      "Up to 10 verified photos",
      "GPS-confirmed coordinates",
      "Digital timestamped proof certificate",
      "100% refund if not verified",
    ],
  },
  {
    id: "premium",
    name: "Premium Audit",
    priceINR: 2499,
    priceUSD: 30,
    turnaround: "Priority (<12 hours)",
    useCase: "Designed for NRIs and serious buyers who need comprehensive insights, interior walkthroughs, and custom spot-checks.",
    features: [
      "Everything in Standard",
      "Full video walkthrough",
      "Custom inspection checklist support",
      "Detailed inspector field notes",
      "Priority queue assignment",
    ],
  },
];

const NAV_ITEMS = [
  { label: "How It Works", to: "/#how-it-works" },
  { label: "Pricing", to: "/pricing", isActive: true },
];

const FAQS = [
  {
    q: "Are there any hidden distance fees or travel charges?",
    a: "Absolutely not. The price you see is the final price. We do not charge per-kilometer distance fees within city limits. We handle inspector payouts on our end to ensure you get a flat, predictable rate.",
  },
  {
    q: "What happens if no inspector accepts my task?",
    a: "Our dispatch system immediately pushes your request to local, vetted inspectors in the specific neighborhood. In the rare event that no inspector claims the task within 48 hours, you will receive a full, automatic 100% refund. No questions asked.",
  },
  {
    q: "I live outside of India. Can I pay in USD?",
    a: "Yes. Our payment gateway supports all major international credit cards and automatically converts the currency for you. The USD prices shown are estimates based on current exchange rates.",
  },
  {
    q: "Can I instruct the inspector to check specific things?",
    a: "Yes. With the Premium Audit package, you can submit a custom checklist (e.g. 'Check if the back boundary wall is intact' or 'Verify the number of pillars constructed on the first floor'). The inspector will provide explicit notes and photos against your custom requests.",
  },
];

const HOW_IT_WORKS = [
  { step: 1, title: "Submit Coordinates", desc: "Share the property pin and choose your verification package." },
  { step: 2, title: "Inspector Dispatched", desc: "A vetted local expert claims the task and travels to the exact GPS coordinates." },
  { step: 3, title: "On-Site Capture", desc: "Photos and videos are snapped directly through our secured camera. Gallery uploads are blocked." },
  { step: 4, title: "Proof Delivered", desc: "Review your watermarked, timestamped verification certificate on your dashboard." },
];

const TRUST_ITEMS = [
  { icon: CameraIcon, title: "Tamper-Proof Evidence", desc: "We verify location bounds using device metrics. Inspectors cannot upload old gallery photos.", color: "emerald" },
  { icon: ZapIcon, title: "Live Tracking", desc: "Track the assigned inspector live on the map as they navigate to your property.", color: "primary" },
  { icon: CompassIcon, title: "100% Refund Guarantee", desc: "If the verification fails or the property is inaccessible, you receive your money back.", color: "accent" },
];

export function PricingPage() {
  return (
    <div className="min-h-screen bg-surface-50 text-surface-900 font-sans selection:bg-primary-500 selection:text-white">
      <MarketingHeader navItems={NAV_ITEMS} ctaLabel="Get Started" ctaTo="/verify/signup" />

      {/* Hero Section */}
      <section className="pt-16 pb-12 text-center bg-white border-b border-surface-200">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div className="inline-flex px-3 py-1 bg-primary-50 border border-primary-100 rounded-full text-[10px] font-bold text-primary-600 uppercase tracking-wider">
            Flat, Predictable Pricing
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-surface-900 tracking-tight leading-none max-w-2xl mx-auto">
            Peace of Mind for <br/> Your Remote Investments
          </h1>
          <p className="text-sm md:text-base text-surface-550 max-w-xl mx-auto font-normal">
            No complex travel fees. No hidden add-ons. Just transparent, flat-rate verification tailored for remote buyers.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              padding="lg"
              className={`flex flex-col justify-between relative border-2 ${
                plan.id === "premium"
                  ? "border-primary-500 shadow-md ring-4 ring-primary-50"
                  : "border-surface-200 hover:border-surface-300 bg-white"
              }`}
            >
              {plan.id === "premium" && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm">
                  Recommended for NRIs
                </span>
              )}
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-surface-900 tracking-tight">{plan.name}</h3>
                  <p className="text-xs text-surface-400 mt-1 font-semibold uppercase tracking-wider">{plan.turnaround}</p>
                </div>
                
                <div className="flex items-baseline gap-2 py-2">
                  <span className="text-4xl font-black text-surface-900">₹{plan.priceINR}</span>
                  <span className="text-sm text-surface-450 font-bold">/ visit</span>
                  <span className="text-xs text-surface-400 bg-surface-100 px-2 py-0.5 rounded-md ml-1 font-mono">
                    ~${plan.priceUSD} USD
                  </span>
                </div>
                
                <p className="text-[13px] text-surface-650 leading-relaxed font-normal min-h-[60px]">
                  {plan.useCase}
                </p>
                
                <hr className="border-surface-150" />
                
                <ul className="space-y-3.5 text-sm text-surface-700 font-medium">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircleIcon size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-10">
                <Button
                  to="/verify/signup"
                  className="w-full"
                  size="md"
                >
                  Request {plan.name}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* How Pricing Works */}
        <section className="py-20 mt-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-1">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">Pricing Transparency</h2>
            <h3 className="text-2xl font-bold text-surface-900 tracking-tight">How Verification Works</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="space-y-3 text-center p-2">
                <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center font-black mx-auto text-sm">
                  {item.step}
                </div>
                <h4 className="text-sm font-bold text-surface-900">{item.title}</h4>
                <p className="text-[11px] text-surface-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Users Trust InstantLocate */}
        <section className="py-16 bg-surface-100/30 rounded-2xl px-6 sm:px-10 border border-surface-200">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-1">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">Built-In Safety</h2>
            <h3 className="text-2xl font-bold text-surface-900 tracking-tight">Why Remote Buyers Trust Us</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TRUST_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              const colorMap: Record<string, { bg: string; border: string; text: string }> = {
                emerald: { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600" },
                primary: { bg: "bg-primary-50", border: "border-primary-100", text: "text-primary-600" },
                accent: { bg: "bg-accent-50", border: "border-accent-100", text: "text-accent-650" },
              };
              const c = colorMap[item.color];
              return (
                <div key={idx} className="flex gap-4 items-start">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} ${c.text} flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm`}>
                    <Icon size={20} />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-surface-900">{item.title}</h4>
                    <p className="text-[11.5px] text-surface-555 leading-relaxed font-normal">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-20 mt-4 max-w-3xl mx-auto">
          <div className="text-center mb-10 space-y-1">
            <h2 className="text-[11px] font-bold text-primary-500 uppercase tracking-widest">FAQ</h2>
            <h3 className="text-2xl font-bold text-surface-900 tracking-tight">Pricing FAQ</h3>
          </div>
          <FaqAccordion items={FAQS} />
        </section>
      </main>

      <MarketingFooter tagline="Secure Remote Inspections & Verification." />
    </div>
  );
}
