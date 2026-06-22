import { notFound } from "next/navigation";
import { MapPin, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
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
    <main className="min-h-screen overflow-hidden px-4 py-5 sm:px-6">
      <section className="mx-auto grid min-h-[calc(100vh-2.5rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="order-2 hidden lg:block">
          <div className="warm-band shell-panel relative overflow-hidden p-8">
            <div className="absolute right-6 top-6 rounded-lg bg-white/65 px-3 py-2 text-sm font-black text-merca-green">
              Club de beneficios
            </div>
            <div className="mt-20 grid gap-4">
              {[
                { icon: MessageCircle, title: "Promos por WhatsApp", text: "Ofertas simples, directas y cerca de tu sucursal." },
                { icon: MapPin, title: `Sucursal ${branch.name}`, text: "El QR identifica el local automáticamente." },
                { icon: ShieldCheck, title: "Sin spam", text: "El cliente acepta recibir mensajes y puede darse de baja." }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-lg bg-white/80 p-4 shadow-sm">
                    <Icon className="mb-3 h-6 w-6 text-merca-orange" />
                    <h2 className="text-lg font-black text-merca-ink">{item.title}</h2>
                    <p className="mt-1 text-sm font-semibold leading-6 text-merca-muted">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="order-1 mx-auto w-full max-w-md lg:order-1">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Brand href={`/club?local=${branch.slug}`} />
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-merca-green shadow-sm">
              <Sparkles className="h-4 w-4 text-merca-orange" />
              {branch.name}
            </span>
          </div>
          <div className="mb-6">
            <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-merca-ink sm:text-6xl">
              Sumate al Club Mercalito
            </h1>
            <p className="mt-5 text-lg font-semibold leading-8 text-merca-muted">
              Recibí ofertas, beneficios y promos exclusivas por WhatsApp.
            </p>
          </div>
          <ClubForm branchSlug={branch.slug} />
        </div>
      </section>
    </main>
  );
}
