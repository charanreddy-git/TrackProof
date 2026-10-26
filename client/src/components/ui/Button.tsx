import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?: "primary" | "accent" | "secondary" | "inverse" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: ReactNode;
  to?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  to,
  href,
  type = "button",
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer no-underline whitespace-nowrap";

  const variantClasses = {
    primary:
      "bg-primary-700 text-white hover:bg-primary-800 shadow-sm",
    accent:
      "bg-accent-400 text-surface-950 hover:bg-accent-300 shadow-sm",
    secondary:
      "bg-white text-surface-800 border border-surface-200 hover:bg-surface-50 hover:border-surface-300",
    inverse:
      "bg-white text-primary-900 hover:bg-primary-50 shadow-sm",
    danger:
      "bg-danger-600 text-white hover:bg-danger-700 shadow-sm",
    ghost:
      "text-surface-550 hover:text-surface-900 hover:bg-surface-100",
  };

  const sizeClasses = {
    sm: "h-9 px-3 text-[13px] gap-1.5",
    md: "h-11 px-4 text-sm gap-2",
    lg: "h-12 px-6 text-[15px] gap-2",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const spinner = (
    <svg className="animate-spin h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );

  const content = (
    <>
      {isLoading && spinner}
      {children}
    </>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {content}
    </button>
  );
}
