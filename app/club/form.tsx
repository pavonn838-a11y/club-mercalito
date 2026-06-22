"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
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
      <div className="rounded-lg border border-merca-green/20 bg-white p-6 text-center shadow-warm">
        <CheckCircle2 className="mx-auto h-14 w-14 text-merca-green" />
        <h1 className="mt-5 text-3xl font-black text-merca-ink">
          ¡Listo! Ya sos parte del Club Mercalito.
        </h1>
        <p className="mt-3 text-lg leading-7 text-merca-muted">
          Muy pronto vas a recibir ofertas y beneficios en tu WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-orange-200 bg-white p-5 shadow-warm sm:p-6">
      <input type="hidden" name="branchSlug" value={branchSlug} />
      <label className="block">
        <span className="mb-2 block text-sm font-black text-merca-ink">Tu nombre</span>
        <Input name="name" autoComplete="given-name" required placeholder="Tu nombre" />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-black text-merca-ink">Tu WhatsApp</span>
        <Input
          name="phone"
          autoComplete="tel"
          inputMode="tel"
          required
          placeholder="223 555 1234"
        />
      </label>
      <label className="flex items-start gap-3 rounded-lg bg-merca-cream px-3 py-3 text-sm font-semibold leading-5 text-merca-ink">
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
      <p className="text-center text-sm font-bold text-merca-green">
        Sin spam. Solo beneficios de Mercalito.
      </p>
    </form>
  );
}
