import Link from "next/link";
import { BarChart3, Megaphone, Store, Users } from "lucide-react";
import { Brand } from "@/components/brand";
import { signOut } from "@/app/actions";
import { requireAdminUser } from "@/lib/auth";

const links = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/customers", label: "Clientes", icon: Users },
  { href: "/admin/campaigns", label: "Campañas", icon: Megaphone },
  { href: "/admin/branches", label: "Sucursales", icon: Store }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminUser();

  return (
    <div className="market-grid min-h-screen">
      <header className="sticky top-0 z-20 border-b-2 border-merca-orange/30 bg-merca-creamSoft/95 shadow-sm backdrop-blur">
        <div className="awning h-3" />
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Brand />
          <form action={signOut}>
            <button className="rounded-[8px] border-2 border-merca-orange/30 bg-white px-4 py-2 text-sm font-black uppercase tracking-wide text-merca-ink shadow-sm transition hover:bg-merca-cream">
              Salir
            </button>
          </form>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[8px] border-2 border-merca-orange/20 bg-white px-4 text-sm font-black text-merca-ink shadow-sm transition hover:-translate-y-0.5 hover:border-merca-orange/70 hover:text-merca-orange"
              >
                <Icon className="h-4 w-4 text-merca-orange" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
