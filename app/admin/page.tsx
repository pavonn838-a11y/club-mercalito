import Link from "next/link";
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
      <div>
        <h1 className="text-3xl font-black text-merca-ink">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-merca-muted">
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
        <div className="rounded-lg border border-orange-200 bg-white/85 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-merca-ink">Últimos registros</h2>
            <Link href="/admin/customers" className="text-sm font-black text-merca-orange">
              Ver clientes
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

        <div className="rounded-lg border border-orange-200 bg-white/85 p-4 shadow-sm">
          <h2 className="text-xl font-black text-merca-ink">Ranking de sucursales</h2>
          <div className="mt-4 space-y-3">
            {ranking.map((item, index) => (
              <div key={item.branch_name} className="flex items-center justify-between rounded-lg bg-merca-cream px-3 py-2">
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
