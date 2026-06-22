import clsx from "clsx";
import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-merca-orange px-5 py-3 text-center text-sm font-black text-white shadow-warm transition hover:bg-merca-orangeDark disabled:cursor-not-allowed disabled:opacity-60",
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
        "focus-ring min-h-12 w-full rounded-lg border border-orange-200 bg-white px-4 text-base text-merca-ink placeholder:text-merca-muted",
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
        "focus-ring min-h-12 w-full rounded-lg border border-orange-200 bg-white px-4 text-base text-merca-ink",
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
        "focus-ring min-h-36 w-full rounded-lg border border-orange-200 bg-white px-4 py-3 text-base text-merca-ink placeholder:text-merca-muted",
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
    <div className="rounded-lg border border-orange-200 bg-white/80 p-4 shadow-sm">
      <p className="text-sm font-bold text-merca-muted">{label}</p>
      <p className="mt-2 text-3xl font-black text-merca-ink">{value}</p>
    </div>
  );
}
