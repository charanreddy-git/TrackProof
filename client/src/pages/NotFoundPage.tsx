import { Link } from "react-router-dom";
import { Logo, Button } from "../components";

const HELPFUL_LINKS = [
  { label: "How TrackProof works", to: "/#how-it-works" },
  { label: "Pricing", to: "/pricing" },
  { label: "For inspectors", to: "/captain" },
  { label: "Sign in", to: "/login" },
];

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <Link
          to="/"
          className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900"
        >
          Back to home
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-16 pt-6 sm:px-6">
        <div className="w-full max-w-lg animate-slide-up text-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-accent-700">
            Error 404
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
            We couldn’t find that page
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-surface-500">
            The link may be old or mistyped. Your visits and reports are safe — head
            back to your dashboard or start a new request.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/" size="lg">
              Go to home
            </Button>
            <Button to="/verify" variant="secondary" size="lg">
              Request a visit
            </Button>
          </div>

          <div className="mt-12 border-t border-surface-200 pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">
              Popular pages
            </p>
            <nav className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
              {HELPFUL_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="inline-flex min-h-11 items-center px-1 text-sm font-medium text-primary-800 underline-offset-4 hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}
