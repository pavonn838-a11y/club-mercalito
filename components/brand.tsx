import Link from "next/link";

export function Brand({ href = "/admin" }: { href?: string }) {
  return (
    <Link href={href} className="group flex items-center gap-3">
      <span className="grid h-12 w-12 place-items-center rounded-lg bg-merca-orange text-xl font-black text-white shadow-warm ring-4 ring-white/70 transition group-hover:bg-merca-orangeDark">
        M
      </span>
      <span>
        <span className="block text-xl font-black leading-5 text-merca-ink">
          Mercalito
        </span>
        <span className="mt-1 block text-xs font-black uppercase tracking-[0.22em] text-merca-green">
          Club
        </span>
      </span>
    </Link>
  );
}
