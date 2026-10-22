"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string | null;
  trailing?: React.ReactNode;
}

export function Input({
  label,
  hint,
  error,
  trailing,
  className,
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy =
    [hint ? `${inputId}-hint` : null, error ? `${inputId}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-1.5 block font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-secondary"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-10 w-full rounded-sm border bg-surface-sunken px-3.5 text-[0.875rem] text-ink placeholder:text-ink-muted/70 transition-colors focus:border-acid focus:outline-none focus:ring-1 focus:ring-acid/30",
            error ? "border-danger/70" : "border-line",
            trailing && "pr-11",
            className
          )}
          {...props}
        />
        {trailing ? (
          <div className="absolute inset-y-0 right-1.5 flex items-center">
            {trailing}
          </div>
        ) : null}
      </div>
      {hint && !error ? (
        <p
          id={`${inputId}-hint`}
          className="mt-1.5 font-mono text-[0.6875rem] text-ink-muted"
        >
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 font-mono text-[0.6875rem] text-danger"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export function Select({
  label,
  options,
  id,
  className,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="w-full">
      <label
        htmlFor={selectId}
        className="mb-1.5 block font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-secondary"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            "h-10 w-full cursor-pointer appearance-none rounded-sm border border-line bg-surface-sunken pl-3.5 pr-9 text-[0.875rem] text-ink transition-colors focus:border-acid focus:outline-none focus:ring-1 focus:ring-acid/30",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-acid"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
