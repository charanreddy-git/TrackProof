import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  id?: string;
}

export function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
  id,
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-6 sm:p-7",
  };

  return (
    <div
      id={id}
      className={`
        bg-white rounded-2xl border border-surface-200
        shadow-card
        ${hover ? "hover:shadow-card-hover hover:border-surface-300 transition-all duration-200" : ""}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
