import Link from "next/link";

export function Brand({ href = "/admin" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <span className="grid h-11 w-11 place-items-center rounded-lg bg-merca-orange text-xl font-black text-white shadow-warm">
        M
      </span>
      <span>
        <span className="block text-lg font-black leading-5 text-merca-ink">
          Mercalito
        </span>
        <span className="block text-xs font-bold uppercase tracking-[0.18em] text-merca-green">
          Club
        </span>
      </span>
    </Link>
  );
}
