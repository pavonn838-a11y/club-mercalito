import Link from "next/link";
import { ArrowUpRight, MessageCircle, Store, Trophy } from "lucide-react";
import { StatCard } from "@/components/ui";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBranchName, type Customer } from "@/lib/types";

function startOfDay() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

function startOfMonth() {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

export default async function AdminDashboard() {
  const supabase = createAdminClient();

  const [
    total,
    today,
    week,
    month,
    latest,
    byBranch
  ] = await Promise.all([
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("customers").select("id", { count: "exact", head: true }).gte("created_at", startOfDay()),
    supabase.from("customers").select("id", { count: "exact", head: true }).gte("created_at", daysAgo(7)),
    supabase.from("customers").select("id", { count: "exact", head: true }).gte("created_at", startOfMonth()),
    supabase
      .from("customers")
      .select("id, name, phone, created_at, status, branches(name, slug)")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("customers_by_branch").select("*")
  ]);

  const latestRows = (latest.data ?? []) as unknown as Customer[];
  const ranking = (byBranch.data ?? []) as Array<{ branch_name: string; total: number }>;

  return (
    <div className="space-y-6">
      <div className="shell-panel relative overflow-hidden bg-merca-orange p-6 text-white shadow-label sm:p-8">
        <div className="absolute right-0 top-0 hidden h-full w-72 bg-white/10 sm:block" />
        <div className="absolute -right-10 -top-10 hidden h-36 w-36 rounded-full border-[18px] border-white/20 sm:block" />
        <p className="mb-3 inline-flex rounded-[8px] bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-merca-orange">
          Panel Mercalito
        </p>
        <h1 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
          Club en movimiento
        </h1>
        <p className="mt-3 max-w-2xl text-base font-bold leading-7 text-white/90">
          Altas recientes, sucursales que más suman y contactos listos para ofertas por WhatsApp.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black">
            <Store className="h-4 w-4" />
            Por sucursal
          </span>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total registrados" value={total.count ?? 0} />
        <StatCard label="Registros de hoy" value={today.count ?? 0} />
        <StatCard label="Esta semana" value={week.count ?? 0} />
        <StatCard label="Este mes" value={month.count ?? 0} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="shell-panel overflow-hidden p-5 shadow-label">
          <div className="awning -mx-5 -mt-5 mb-5 h-4" />
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black uppercase text-merca-ink">Últimos registros</h2>
            <Link href="/admin/customers" className="inline-flex items-center gap-1 text-sm font-black text-merca-orange">
              Ver clientes
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-merca-green">
                <tr>
                  <th className="py-2">Nombre</th>
                  <th>WhatsApp</th>
                  <th>Sucursal</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {latestRows.map((customer) => (
                  <tr key={customer.id} className="border-t-2 border-orange-100">
                    <td className="py-3 font-black">{customer.name}</td>
                    <td>{customer.phone}</td>
                    <td>{getBranchName(customer.branches) || "-"}</td>
                    <td>{new Date(customer.created_at).toLocaleDateString("es-AR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="shell-panel overflow-hidden p-5 shadow-label">
          <div className="awning -mx-5 -mt-5 mb-5 h-4" />
          <h2 className="flex items-center gap-2 text-2xl font-black uppercase text-merca-ink">
            <Trophy className="h-5 w-5 text-merca-orange" />
            Ranking de sucursales
          </h2>
          <div className="mt-4 space-y-3">
            {ranking.map((item, index) => (
              <div key={item.branch_name} className="flex items-center justify-between rounded-[8px] border-2 border-merca-orange/15 bg-merca-cream px-4 py-3 shadow-sm">
                <span className="font-black text-merca-ink">
                  {index + 1}. {item.branch_name}
                </span>
                <span className="rounded-full bg-merca-green px-3 py-1 text-sm font-black text-white">
                  {item.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
