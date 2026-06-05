interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-7 w-7",
    lg: "h-10 w-10",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        className={`animate-spin text-primary-500 ${sizeClasses[size]}`}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-80"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        {/* Logo mark */}
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-sm">
          <svg className="w-5 h-5 text-white animate-pulse-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-sm text-surface-400 font-medium tracking-wide">Loading…</p>
      </div>
    </div>
  );
}

/** Skeleton line — use in place of text while loading */
export function SkeletonLine({ width = "100%", height = "14px", className = "" }: { width?: string; height?: string; className?: string }) {
  return (
    <div
      className={`skeleton rounded-md ${className}`}
      style={{ width, height }}
    />
  );
}

/** Skeleton block — for card-shaped placeholders */
export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-surface-100 p-5 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <SkeletonLine width="60%" height="16px" />
        <SkeletonLine width="60px" height="20px" className="rounded-full" />
      </div>
      <SkeletonLine width="85%" height="13px" />
      <SkeletonLine width="50%" height="13px" />
      <div className="flex items-center gap-2 pt-1">
        <SkeletonLine width="80px" height="13px" />
      </div>
    </div>
  );
}
