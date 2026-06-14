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
        <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center px-4 text-center">
          <div className="w-full max-w-md space-y-8 animate-slide-up">
            <div className="flex justify-center">
              <Logo size="lg" />
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-bold text-danger-500 uppercase tracking-widest">
                Something went wrong
              </p>
              <h1 className="text-2xl font-bold text-surface-900 tracking-tight">
                An unexpected error occurred
              </h1>
              <p className="text-sm text-surface-500 leading-relaxed max-w-xs mx-auto">
                Please reload the page. If this persists, contact support.
              </p>
              {this.state.message && (
                <p className="text-xs font-mono text-surface-400 bg-surface-100 rounded-lg px-3 py-2 max-w-sm mx-auto truncate">
                  {this.state.message}
                </p>
              )}
            </div>

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-lg transition-all shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
