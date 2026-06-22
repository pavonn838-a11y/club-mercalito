import Link from "next/link";

export function Brand({ href = "/admin" }: { href?: string }) {
  return (
    <Link href={href} className="group flex items-center gap-3">
      <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-merca-green bg-merca-orange text-xl font-black text-white shadow-label ring-4 ring-white/80 transition group-hover:-rotate-3 group-hover:bg-merca-orangeDark">
        M
      </span>
      <span>
        <span className="block text-2xl font-black uppercase leading-5 tracking-tight text-merca-orange">
          MERCALITO
        </span>
        <span className="mt-1 block text-xs font-black uppercase tracking-[0.22em] text-merca-green">
          Club
        </span>
      </span>
    </Link>
  );
}
