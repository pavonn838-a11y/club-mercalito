import { notFound } from "next/navigation";
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
    <main className="min-h-screen px-4 py-6 sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col justify-center">
        <div className="mb-8">
          <Brand href={`/club?local=${branch.slug}`} />
        </div>
        <div className="mb-6">
          <p className="mb-3 inline-flex rounded-full bg-merca-green px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white">
            {branch.name}
          </p>
          <h1 className="text-4xl font-black leading-tight text-merca-ink">
            Sumate al Club Mercalito
          </h1>
          <p className="mt-3 text-lg leading-7 text-merca-muted">
            Recibí ofertas, beneficios y promos exclusivas por WhatsApp.
          </p>
        </div>
        <ClubForm branchSlug={branch.slug} />
      </section>
    </main>
  );
}
