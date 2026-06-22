import Link from "next/link";
import { ArrowUpRight, Trophy } from "lucide-react";
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
      <div className="warm-band shell-panel overflow-hidden p-6 sm:p-8">
        <p className="mb-3 inline-flex rounded-lg bg-white/80 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-merca-green">
          Panel Mercalito
        </p>
        <h1 className="text-4xl font-black tracking-tight text-merca-ink sm:text-5xl">
          Dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-merca-muted">
          Vista rápida del Club Mercalito, altas recientes y sucursales que más están sumando clientes.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total registrados" value={total.count ?? 0} />
        <StatCard label="Registros de hoy" value={today.count ?? 0} />
        <StatCard label="Esta semana" value={week.count ?? 0} />
        <StatCard label="Este mes" value={month.count ?? 0} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="shell-panel p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-merca-ink">Últimos registros</h2>
            <Link href="/admin/customers" className="inline-flex items-center gap-1 text-sm font-black text-merca-orange">
              Ver clientes
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs uppercase text-merca-muted">
                <tr>
                  <th className="py-2">Nombre</th>
                  <th>WhatsApp</th>
                  <th>Sucursal</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {latestRows.map((customer) => (
                  <tr key={customer.id} className="border-t border-orange-100">
                    <td className="py-3 font-bold">{customer.name}</td>
                    <td>{customer.phone}</td>
                    <td>{getBranchName(customer.branches) || "-"}</td>
                    <td>{new Date(customer.created_at).toLocaleDateString("es-AR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="shell-panel p-5">
          <h2 className="flex items-center gap-2 text-xl font-black text-merca-ink">
            <Trophy className="h-5 w-5 text-merca-orange" />
            Ranking de sucursales
          </h2>
          <div className="mt-4 space-y-3">
            {ranking.map((item, index) => (
              <div key={item.branch_name} className="flex items-center justify-between rounded-lg bg-merca-cream px-4 py-3 shadow-sm">
                <span className="font-black text-merca-ink">
                  {index + 1}. {item.branch_name}
                </span>
                <span className="rounded-md bg-merca-green px-2 py-1 text-sm font-black text-white">
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
