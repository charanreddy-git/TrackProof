import { Component, type ReactNode, type ErrorInfo } from "react";
import { Logo } from "./Logo";
import { Button } from "./ui";
import { AlertTriangleIcon, ShieldCheckIcon } from "./Icons";

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
        <div className="paper-bg flex min-h-screen flex-col">
          <header className="mx-auto flex w-full max-w-6xl items-center px-4 py-5 sm:px-6">
            <Logo />
          </header>

          <main className="flex flex-1 items-center justify-center px-4 pb-16 pt-6 sm:px-6">
            <div className="w-full max-w-md animate-slide-up text-center">
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rotate-6 rounded-3xl bg-danger-100"
                />
                <span className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-card">
                  <AlertTriangleIcon size={32} className="text-danger-600" />
                </span>
              </div>

              <h1 className="mt-6 text-[2rem] font-extrabold leading-tight tracking-[-0.04em] text-surface-950">
                Something went wrong.
              </h1>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-surface-600">
                A quick reload usually fixes it. Your visits and proof are not
                affected.
              </p>

              {this.state.message && (
                <p className="mt-5 break-words rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-left text-[11.5px] leading-relaxed text-surface-500 shadow-sm">
                  {this.state.message}
                </p>
              )}

              <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                <Button onClick={() => window.location.reload()}>
                  Reload page
                </Button>
                <Button to="/" variant="secondary">
                  Go to home
                </Button>
              </div>

              <p className="mt-6 flex items-center justify-center gap-1.5 text-[10.5px] font-medium text-surface-500">
                <ShieldCheckIcon size={12} className="text-primary-600" />
                Your visit history is safe
              </p>
            </div>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}
