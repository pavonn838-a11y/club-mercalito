import { Brand } from "@/components/brand";
import { Button, Input } from "@/components/ui";
import { signIn } from "@/app/actions";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/admin";

  return (
    <main className="grid min-h-screen place-items-center px-4 py-8">
      <section className="w-full max-w-sm">
        <div className="mb-8">
          <Brand href="/login" />
        </div>
        <form action={signIn} className="space-y-4 rounded-lg border border-orange-200 bg-white p-6 shadow-warm">
          <input type="hidden" name="next" value={next} />
          <div>
            <h1 className="text-2xl font-black text-merca-ink">Panel Mercalito</h1>
            <p className="mt-2 text-sm font-semibold leading-6 text-merca-muted">
              Ingresá con el usuario de administración u oficina.
            </p>
          </div>
          <label className="block">
            <span className="mb-2 block text-sm font-black text-merca-ink">Email</span>
            <Input name="email" type="email" required autoComplete="email" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-black text-merca-ink">Contraseña</span>
            <Input name="password" type="password" required autoComplete="current-password" />
          </label>
          {params.error ? (
            <p className="rounded-lg bg-orange-50 px-3 py-2 text-sm font-bold text-merca-orangeDark">
              No pudimos iniciar sesión con esos datos.
            </p>
          ) : null}
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
      </section>
    </main>
  );
}
