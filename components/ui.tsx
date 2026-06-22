import clsx from "clsx";
import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-merca-orange px-5 py-3 text-center text-sm font-black text-white shadow-warm transition hover:-translate-y-0.5 hover:bg-merca-orangeDark disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "focus-ring min-h-12 w-full rounded-lg border border-orange-200 bg-white/95 px-4 text-base font-semibold text-merca-ink shadow-sm placeholder:text-merca-muted",
        className
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={clsx(
        "focus-ring min-h-12 w-full rounded-lg border border-orange-200 bg-white/95 px-4 text-base font-semibold text-merca-ink shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "focus-ring min-h-36 w-full rounded-lg border border-orange-200 bg-white/95 px-4 py-3 text-base font-semibold text-merca-ink shadow-sm placeholder:text-merca-muted",
        className
      )}
      {...props}
    />
  );
}

export function StatCard({
  label,
  value
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="shell-panel relative overflow-hidden p-5">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-merca-orange via-merca-green to-merca-orange" />
      <p className="text-sm font-black text-merca-muted">{label}</p>
      <p className="mt-3 text-4xl font-black tracking-tight text-merca-ink">{value}</p>
    </div>
  );
}
