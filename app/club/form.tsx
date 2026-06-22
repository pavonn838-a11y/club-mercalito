"use client";

import { useActionState } from "react";
import { CheckCircle2, Gift, LockKeyhole, Phone, UserRound } from "lucide-react";
import { registerCustomer, type ClubFormState } from "@/app/actions";
import { Button, Input } from "@/components/ui";

const initialState: ClubFormState = {
  ok: false,
  message: ""
};

export function ClubForm({ branchSlug }: { branchSlug: string }) {
  const [state, formAction, pending] = useActionState(registerCustomer, initialState);

  if (state.ok) {
    return (
      <div className="shell-panel p-7 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-lg bg-merca-green text-white shadow-warm">
          <CheckCircle2 className="h-11 w-11" />
        </div>
        <h1 className="mt-6 text-3xl font-black leading-tight text-merca-ink">
          ¡Listo! Ya sos parte del Club Mercalito.
        </h1>
        <p className="mt-4 text-lg font-semibold leading-7 text-merca-muted">
          Muy pronto vas a recibir ofertas y beneficios en tu WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="shell-panel space-y-4 p-5 sm:p-6">
      <input type="hidden" name="branchSlug" value={branchSlug} />
      <div className="flex items-center gap-3 rounded-lg bg-merca-cream px-4 py-3">
        <Gift className="h-5 w-5 shrink-0 text-merca-orange" />
        <p className="text-sm font-black text-merca-ink">
          Tardás menos de 20 segundos.
        </p>
      </div>
      <label className="block">
        <span className="mb-2 flex items-center gap-2 text-sm font-black text-merca-ink">
          <UserRound className="h-4 w-4 text-merca-green" />
          Tu nombre
        </span>
        <Input name="name" autoComplete="given-name" required placeholder="Tu nombre" />
      </label>
      <label className="block">
        <span className="mb-2 flex items-center gap-2 text-sm font-black text-merca-ink">
          <Phone className="h-4 w-4 text-merca-green" />
          Tu WhatsApp
        </span>
        <Input
          name="phone"
          autoComplete="tel"
          inputMode="tel"
          required
          placeholder="223 555 1234"
        />
      </label>
      <label className="flex items-start gap-3 rounded-lg bg-merca-cream px-3 py-3 text-sm font-bold leading-5 text-merca-ink">
        <input
          name="optIn"
          type="checkbox"
          required
          className="mt-1 h-5 w-5 rounded border-orange-300 accent-merca-orange"
        />
        <span>
          Acepto recibir ofertas, novedades y beneficios de Mercalito por WhatsApp.
          Puedo darme de baja cuando quiera.
        </span>
      </label>
      {state.message ? (
        <p className="rounded-lg bg-orange-50 px-3 py-2 text-sm font-bold text-merca-orangeDark">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full text-base">
        {pending ? "Registrando..." : "Quiero recibir ofertas"}
      </Button>
      <p className="flex items-center justify-center gap-2 text-center text-sm font-black text-merca-green">
        <LockKeyhole className="h-4 w-4" />
        Sin spam. Solo beneficios de Mercalito.
      </p>
    </form>
  );
}
