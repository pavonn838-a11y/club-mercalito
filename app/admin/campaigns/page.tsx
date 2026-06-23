import { Download, Send } from "lucide-react";
import { createCampaign, sendCampaignByWhatsApp } from "@/app/actions";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBranchName, type Branch, type Campaign } from "@/lib/types";

const exampleMessage =
  "Hola {nombre}. Soy Mercalito. Te dejamos las ofertas del finde en tu sucursal {sucursal}. Mostrá este mensaje en caja y aprovechá el beneficio. Para dejar de recibir mensajes, respondé BAJA.";

function WhatsAppNotice({
  status,
  sent,
  failed,
  vars
}: {
  status?: string;
  sent?: string;
  failed?: string;
  vars?: string;
}) {
  if (!status) return null;

  const messages: Record<string, string> = {
    missing: `Faltan claves de WhatsApp para enviar: ${vars ?? ""}. Cargalas en Netlify y volvé a probar.`,
    empty: "No hay clientes activos con permiso para recibir esta campaña.",
    sent: `Campaña enviada por WhatsApp. Enviados: ${sent ?? "0"}. Errores: ${failed ?? "0"}.`,
    "not-found": "No encontramos esa campaña."
  };

  return (
    <div className="rounded-[8px] border-2 border-merca-orange/30 bg-white px-4 py-3 text-sm font-black text-merca-ink shadow-label">
      {messages[status] ?? "No pudimos completar la acción de WhatsApp."}
    </div>
  );
}

export default async function CampaignsPage({
  searchParams
}: {
  searchParams: Promise<{
    whatsapp?: string;
    sent?: string;
    failed?: string;
    vars?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = createAdminClient();

  const [{ data: branchesData }, { data: campaignsData }] = await Promise.all([
    supabase.from("branches").select("*").eq("active", true).order("name"),
    supabase
      .from("campaigns")
      .select("id, name, message, branch_id, status, created_at, sent_at, branches(name, slug)")
      .order("created_at", { ascending: false })
  ]);

  const branches = (branchesData ?? []) as Branch[];
  const campaigns = (campaignsData ?? []) as unknown as Campaign[];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-black text-merca-ink">Campañas</h1>
        <p className="mt-2 text-sm font-semibold text-merca-muted">
          Creá campañas, exportá destinatarios o envialas por WhatsApp cuando esté conectada la API.
        </p>
      </div>
      <WhatsAppNotice
        status={params.whatsapp}
        sent={params.sent}
        failed={params.failed}
        vars={params.vars}
      />

      <form action={createCampaign} className="grid gap-3 rounded-lg border border-orange-200 bg-white/85 p-4 shadow-sm lg:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-sm font-black">Nombre de campaña</span>
          <Input name="name" required placeholder="Ofertas del finde" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-black">Sucursal destino</span>
          <Select name="branchId" defaultValue="all">
            <option value="all">Todas las sucursales</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </Select>
        </label>
        <div className="rounded-lg bg-merca-cream px-3 py-3 text-sm font-bold leading-6 text-merca-muted">
          Variables disponibles: {"{nombre}"} y {"{sucursal}"}
        </div>
        <label className="block lg:col-span-3">
          <span className="mb-2 block text-sm font-black">Mensaje de campaña</span>
          <Textarea name="message" required defaultValue={exampleMessage} />
        </label>
        <Button type="submit" className="lg:col-span-3">
          Crear campaña
        </Button>
      </form>

      <section className="grid gap-3">
        {campaigns.map((campaign) => (
          <article key={campaign.id} className="rounded-lg border border-orange-200 bg-white/85 p-4 shadow-sm">
            <div className="flex flex-col justify-between gap-3 md:flex-row">
              <div>
                <h2 className="text-xl font-black text-merca-ink">{campaign.name}</h2>
                <p className="mt-1 text-sm font-semibold text-merca-muted">
                  Destino: {getBranchName(campaign.branches) || "Todas las sucursales"} · Creada:{" "}
                  {new Date(campaign.created_at).toLocaleDateString("es-AR")}
                </p>
              </div>
              <span className="h-fit rounded-md bg-merca-cream px-2 py-1 text-xs font-black text-merca-ink">
                {campaign.status === "draft" ? "borrador" : "enviada"}
              </span>
            </div>
            <p className="mt-4 whitespace-pre-wrap rounded-lg bg-merca-cream px-3 py-3 text-sm font-semibold leading-6 text-merca-ink">
              {campaign.message}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`/api/campaigns/${campaign.id}/export`}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-merca-orange px-3 text-sm font-black text-white"
              >
                <Download className="h-4 w-4" />
                Exportar destinatarios
              </a>
              {campaign.status === "draft" ? (
                <form action={sendCampaignByWhatsApp}>
                  <input type="hidden" name="id" value={campaign.id} />
                  <button className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-orange-200 bg-white px-3 text-sm font-black text-merca-ink">
                    <Send className="h-4 w-4 text-merca-orange" />
                    Enviar por WhatsApp
                  </button>
                </form>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
