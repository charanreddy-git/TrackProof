import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-surface-800"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          className={`
            w-full h-12 px-3.5 rounded-xl border text-base sm:text-[15px] transition-colors
            bg-white text-surface-900 placeholder:text-surface-500
            ${
              error
                ? "border-danger-500 focus:border-danger-500 focus:ring-4 focus:ring-danger-500/10"
                : "border-surface-200 hover:border-surface-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
            }
            focus:outline-none disabled:bg-surface-50 disabled:text-surface-500
            ${className}
          `}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-[13px] text-danger-600 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-[13px] text-surface-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
