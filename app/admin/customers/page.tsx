import { unsubscribeCustomer } from "@/app/actions";
import { CustomerExport } from "@/components/customer-export";
import { Button, Input, Select } from "@/components/ui";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBranchName, type Branch, type Customer, type CustomerStatus } from "@/lib/types";

export default async function CustomersPage({
  searchParams
}: {
  searchParams: Promise<{
    branch?: string;
    status?: CustomerStatus;
    q?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = createAdminClient();

  const { data: branchesData } = await supabase
    .from("branches")
    .select("*")
    .order("name");

  let query = supabase
    .from("customers")
    .select("id, name, phone, branch_id, status, opt_in, source, created_at, unsubscribed_at, branches(name, slug)")
    .order("created_at", { ascending: false });

  if (params.branch) query = query.eq("branch_id", params.branch);
  if (params.status) query = query.eq("status", params.status);
  if (params.from) query = query.gte("created_at", `${params.from}T00:00:00`);
  if (params.to) query = query.lte("created_at", `${params.to}T23:59:59`);
  if (params.q) {
    query = query.or(`name.ilike.%${params.q}%,phone.ilike.%${params.q}%`);
  }

  const { data } = await query;
  const branches = (branchesData ?? []) as Branch[];
  const customers = (data ?? []) as unknown as Customer[];

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-black text-merca-ink">Clientes</h1>
          <p className="mt-2 text-sm font-semibold text-merca-muted">
            Buscá, filtrá, exportá y gestioná bajas sin borrar contactos.
          </p>
        </div>
        <CustomerExport customers={customers} />
      </div>

      <form className="grid gap-3 rounded-lg border border-orange-200 bg-white/85 p-4 shadow-sm md:grid-cols-6">
        <Input name="q" defaultValue={params.q ?? ""} placeholder="Nombre o WhatsApp" className="md:col-span-2" />
        <Select name="branch" defaultValue={params.branch ?? ""}>
          <option value="">Todas las sucursales</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </Select>
        <Select name="status" defaultValue={params.status ?? ""}>
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="unsubscribed">Baja</option>
        </Select>
        <Input name="from" type="date" defaultValue={params.from ?? ""} />
        <Input name="to" type="date" defaultValue={params.to ?? ""} />
        <Button type="submit" className="md:col-span-6">
          Aplicar filtros
        </Button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-orange-200 bg-white/85 shadow-sm">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-merca-cream text-xs uppercase text-merca-muted">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th>WhatsApp</th>
              <th>Sucursal</th>
              <th>Registro</th>
              <th>Estado</th>
              <th className="pr-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t border-orange-100">
                <td className="px-4 py-3 font-bold">{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{getBranchName(customer.branches) || "-"}</td>
                <td>{new Date(customer.created_at).toLocaleString("es-AR")}</td>
                <td>
                  <span className="rounded-md bg-merca-cream px-2 py-1 text-xs font-black">
                    {customer.status === "active" ? "activo" : "baja"}
                  </span>
                </td>
                <td className="pr-4 text-right">
                  {customer.status === "active" ? (
                    <form action={unsubscribeCustomer}>
                      <input type="hidden" name="id" value={customer.id} />
                      <button className="rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm font-black text-merca-orangeDark">
                        Marcar baja
                      </button>
                    </form>
                  ) : (
                    <span className="text-sm font-bold text-merca-muted">Sin acción</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
