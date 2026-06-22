import { createBranch, updateBranchStatus } from "@/app/actions";
import { BranchTools } from "@/components/branch-tools";
import { Button, Input } from "@/components/ui";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Branch } from "@/lib/types";

export default async function BranchesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("branches").select("*").order("name");
  const branches = (data ?? []) as Branch[];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-black text-merca-ink">Sucursales</h1>
        <p className="mt-2 text-sm font-semibold text-merca-muted">
          Cada sucursal tiene su link de registro y QR propio.
        </p>
      </div>

      <form action={createBranch} className="grid gap-3 rounded-lg border border-orange-200 bg-white/85 p-4 shadow-sm md:grid-cols-4">
        <Input name="name" required placeholder="Nombre" />
        <Input name="slug" required placeholder="slug-ejemplo" />
        <Input name="address" required placeholder="Dirección" />
        <label className="flex min-h-12 items-center gap-2 rounded-lg bg-merca-cream px-3 text-sm font-black">
          <input name="active" type="checkbox" defaultChecked className="h-5 w-5 accent-merca-orange" />
          Activa
        </label>
        <Button type="submit" className="md:col-span-4">
          Crear sucursal
        </Button>
      </form>

      <section className="grid gap-3 lg:grid-cols-2">
        {branches.map((branch) => {
          const url = `${siteUrl}/club?local=${branch.slug}`;
          return (
            <article key={branch.id} className="rounded-lg border border-orange-200 bg-white/85 p-4 shadow-sm">
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div>
                  <h2 className="text-xl font-black text-merca-ink">{branch.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-merca-muted">{branch.address}</p>
                  <p className="mt-3 break-all rounded-lg bg-merca-cream px-3 py-2 text-sm font-bold text-merca-ink">
                    {url}
                  </p>
                </div>
                <form action={updateBranchStatus}>
                  <input type="hidden" name="id" value={branch.id} />
                  <input type="hidden" name="active" value={branch.active ? "false" : "true"} />
                  <button className="rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm font-black text-merca-ink">
                    {branch.active ? "Desactivar" : "Activar"}
                  </button>
                </form>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="rounded-md bg-merca-green px-2 py-1 text-xs font-black text-white">
                  {branch.active ? "activa" : "inactiva"}
                </span>
                <BranchTools url={url} slug={branch.slug} />
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
