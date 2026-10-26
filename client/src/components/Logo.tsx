import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "accent";
  label?: string;
  to?: string;
}

const sizeConfig = {
  sm: { box: "w-7 h-7", icon: "w-4 h-4", text: "text-sm" },
  md: { box: "w-9 h-9", icon: "w-5 h-5", text: "text-lg" },
  lg: { box: "w-11 h-11", icon: "w-6 h-6", text: "text-2xl" },
};

const markColors = {
  primary: "bg-primary-700",
  accent: "bg-accent-400",
};

function Mark({ size = "md", variant = "primary" }: Omit<LogoProps, "label" | "to">) {
  const s = sizeConfig[size];
  const isAccent = variant === "accent";

  return (
    <div
      className={`${s.box} ${markColors[variant]} rounded-[10px] flex items-center justify-center flex-shrink-0 shadow-sm`}
    >
      <svg
        className={`${s.icon} ${isAccent ? "text-surface-950" : "text-white"}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 21s7-7.4 7-12a7 7 0 1 0-14 0c0 4.6 7 12 7 12Z" />
        <path d="m8.8 10.5 2.2 2.2 4.4-4.6" className={isAccent ? "text-primary-900" : "text-accent-300"} />
      </svg>
    </div>
  );
}

export function Logo({
  size = "md",
  variant = "primary",
  label = "TrackProof",
  to = "/",
}: LogoProps) {
  const s = sizeConfig[size];

  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2.5 -my-2 rounded-lg py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2"
      aria-label={`${label} home`}
    >
      <Mark size={size} variant={variant} />
      <span className={`${s.text} font-extrabold tracking-tight text-surface-900`}>
        {label === "TrackProof" ? (
          <>
            Track<span className="text-primary-700">Proof</span>
          </>
        ) : (
          label
        )}
      </span>
    </Link>
  );
}

/** Non-interactive version for loading states, headers, and mobile chrome. */
export function LogoMark({
  size = "md",
  variant = "primary",
}: Omit<LogoProps, "label" | "to">) {
  return <Mark size={size} variant={variant} />;
}
