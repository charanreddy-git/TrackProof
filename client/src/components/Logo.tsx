import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "accent";
  label?: string;
}

const sizeConfig = {
  sm: { box: "w-6 h-6", icon: "w-3.5 h-3.5", text: "text-xs" },
  md: { box: "w-8 h-8", icon: "w-4.5 h-4.5", text: "text-[15px]" },
  lg: { box: "w-9 h-9", icon: "w-5 h-5", text: "text-xl" },
};

export function Logo({ size = "md", variant = "primary", label = "InstantLocate" }: LogoProps) {
  const s = sizeConfig[size];
  const bgColor = variant === "accent" ? "bg-accent-500" : "bg-primary-600";

  return (
    <Link to="/" className="flex items-center gap-2.5">
      <div className={`${s.box} ${bgColor} rounded-lg flex items-center justify-center`}>
        <svg className={`${s.icon} text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <span className={`font-bold ${s.text} tracking-tight text-surface-900`}>{label}</span>
    </Link>
  );
}

/** Non-interactive version for loading states / footers */
export function LogoMark({ size = "md", variant = "primary" }: Omit<LogoProps, "label">) {
  const s = sizeConfig[size];
  const bgColor = variant === "accent" ? "bg-accent-500" : "bg-gradient-to-br from-primary-500 to-primary-700";

  return (
    <div className={`${s.box} ${bgColor} rounded-lg flex items-center justify-center shadow-sm`}>
      <svg className={`${s.icon} text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </div>
  );
}
