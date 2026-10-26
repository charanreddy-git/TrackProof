import { Component, type ReactNode, type ErrorInfo } from "react";
import { Logo } from "./Logo";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col bg-surface-50">
          <header className="mx-auto flex w-full max-w-6xl items-center px-4 py-5 sm:px-6">
            <Logo />
          </header>

          <main className="flex flex-1 items-center justify-center px-4 pb-16 pt-6 sm:px-6">
            <div className="w-full max-w-md animate-slide-up text-center">
              <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-danger-600">
                Something went wrong
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-surface-900">
                This page hit a snag
              </h1>
              <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-surface-500">
                Reloading usually fixes it. Your requests and reports are not affected.
              </p>

              {this.state.message && (
                <p className="mx-auto mt-5 max-w-sm truncate rounded-xl border border-surface-200 bg-white px-3 py-2 font-mono text-xs text-surface-500">
                  {this.state.message}
                </p>
              )}

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex h-12 cursor-pointer items-center justify-center rounded-xl bg-primary-700 px-6 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2"
                >
                  Reload page
                </button>
                <a
                  href="/"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-surface-200 bg-white px-6 text-[15px] font-semibold text-surface-800 transition-colors hover:border-surface-300 hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2"
                >
                  Go to home
                </a>
              </div>
            </div>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}
