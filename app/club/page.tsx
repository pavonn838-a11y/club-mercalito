import { notFound } from "next/navigation";
import { MapPin, MessageCircle, ShieldCheck, Sparkles, TicketPercent } from "lucide-react";
import { Brand } from "@/components/brand";
import { createAdminClient } from "@/lib/supabase/admin";
import { ClubForm } from "./form";

export default async function ClubPage({
  searchParams
}: {
  searchParams: Promise<{ local?: string }>;
}) {
  const { local } = await searchParams;

  if (!local) notFound();

  const supabase = createAdminClient();
  const { data: branch } = await supabase
    .from("branches")
    .select("name, slug")
    .eq("slug", local)
    .eq("active", true)
    .single();

  if (!branch) notFound();

  return (
    <main className="market-grid min-h-screen overflow-hidden px-4 py-5 sm:px-6">
      <section className="mx-auto grid min-h-[calc(100vh-2.5rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="order-2 hidden lg:block">
          <div className="shell-panel relative min-h-[680px] overflow-hidden bg-merca-orange text-white shadow-label">
            <div className="awning h-16 border-b-4 border-white/90" />
            <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-white/95" />
            <div className="absolute right-8 top-28 stamp-ring grid h-36 w-36 rotate-6 place-items-center text-center text-merca-green">
              <span className="px-4 text-sm font-black uppercase leading-5">
                QR de sucursal
              </span>
            </div>
            <div className="relative px-8 py-10">
              <p className="inline-flex rounded-[8px] bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-merca-orange">
                Club de beneficios
              </p>
              <div className="mt-16 max-w-sm">
                <p className="text-6xl font-black uppercase leading-[0.9] tracking-tight">
                  Ofertas de tu barrio
                </p>
                <p className="mt-5 text-lg font-black leading-7 text-white/90">
                  El cliente escanea, se suma y queda guardado por sucursal.
                </p>
              </div>
            </div>
            <div className="absolute bottom-8 left-8 right-8 grid gap-4">
              {[
                { icon: MessageCircle, title: "Promos por WhatsApp", text: "Ofertas simples, directas y cerca de tu sucursal." },
                { icon: MapPin, title: `Sucursal ${branch.name}`, text: "El QR identifica el local automáticamente." },
                { icon: ShieldCheck, title: "Sin spam", text: "El cliente acepta recibir mensajes y puede darse de baja." }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="ticket-edge rounded-[8px] bg-white p-4 text-merca-ink shadow-label">
                    <Icon className="mb-3 h-6 w-6 text-merca-orange" />
                    <h2 className="text-lg font-black">{item.title}</h2>
                    <p className="mt-1 text-sm font-bold leading-6 text-merca-muted">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="order-1 mx-auto w-full max-w-md lg:order-1">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Brand href={`/club?local=${branch.slug}`} />
            <span className="inline-flex items-center gap-1.5 rounded-[8px] border-2 border-merca-green bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-merca-green shadow-label">
              <Sparkles className="h-4 w-4 text-merca-orange" />
              {branch.name}
            </span>
          </div>
          <div className="mb-6 rounded-[8px] border-l-[10px] border-merca-orange bg-white/70 p-5 shadow-sm">
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-merca-green">
              <TicketPercent className="h-4 w-4 text-merca-orange" />
              Beneficios por WhatsApp
            </p>
            <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-tight text-merca-ink sm:text-6xl">
              Sumate al Club Mercalito
            </h1>
            <p className="mt-5 text-lg font-bold leading-8 text-merca-muted">
              Recibí ofertas, beneficios y promos exclusivas por WhatsApp.
            </p>
          </div>
          <ClubForm branchSlug={branch.slug} />
        </div>
      </section>
    </main>
  );
}
