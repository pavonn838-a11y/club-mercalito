"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isValidWhatsApp, normalizePhone } from "@/lib/phone";

export type ClubFormState = {
  ok: boolean;
  message: string;
};

export async function registerCustomer(
  _prevState: ClubFormState,
  formData: FormData
): Promise<ClubFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const phoneInput = String(formData.get("phone") ?? "").trim();
  const branchSlug = String(formData.get("branchSlug") ?? "").trim();
  const optIn = formData.get("optIn") === "on";

  if (!name || !phoneInput || !optIn) {
    return {
      ok: false,
      message: "Completá tu nombre, WhatsApp y aceptación para sumarte."
    };
  }

  if (!isValidWhatsApp(phoneInput)) {
    return {
      ok: false,
      message: "Revisá el número de WhatsApp. Usá solo números, con código de área."
    };
  }

  const supabase = createAdminClient();
  const phone = normalizePhone(phoneInput);

  const { data: branch } = await supabase
    .from("branches")
    .select("id")
    .eq("slug", branchSlug)
    .eq("active", true)
    .single();

  if (!branch) {
    return {
      ok: false,
      message: "Este link de sucursal no está disponible. Pedile ayuda al local."
    };
  }

  const { data: existing } = await supabase
    .from("customers")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();

  if (existing) {
    return {
      ok: false,
      message: "Este número ya está registrado en el Club Mercalito."
    };
  }

  const { error } = await supabase.from("customers").insert({
    name,
    phone,
    branch_id: branch.id,
    status: "active",
    opt_in: true,
    source: "QR sucursal"
  });

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        message: "Este número ya está registrado en el Club Mercalito."
      };
    }

    return {
      ok: false,
      message: "No pudimos registrarte en este momento. Probá de nuevo."
    };
  }

  return {
    ok: true,
    message: "¡Listo! Ya sos parte del Club Mercalito."
  };
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  }

  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function unsubscribeCustomer(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = createAdminClient();

  await supabase
    .from("customers")
    .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin/customers");
  revalidatePath("/admin");
}

export async function createBranch(formData: FormData) {
  const supabase = createAdminClient();
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const address = String(formData.get("address") ?? "").trim();
  const active = formData.get("active") === "on";

  if (name && slug && address) {
    await supabase.from("branches").insert({ name, slug, address, active });
  }

  revalidatePath("/admin/branches");
}

export async function updateBranchStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const active = formData.get("active") === "true";
  const supabase = createAdminClient();

  await supabase.from("branches").update({ active }).eq("id", id);
  revalidatePath("/admin/branches");
}

export async function createCampaign(formData: FormData) {
  const supabase = createAdminClient();
  const name = String(formData.get("name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const branchId = String(formData.get("branchId") ?? "");

  if (name && message) {
    await supabase.from("campaigns").insert({
      name,
      message,
      branch_id: branchId === "all" ? null : branchId,
      status: "draft"
    });
  }

  revalidatePath("/admin/campaigns");
}

export async function markCampaignSent(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = createAdminClient();

  await supabase
    .from("campaigns")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin/campaigns");
}
