import { NextResponse } from "next/server";
import { toCsv } from "@/lib/csv";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getBranchName } from "@/lib/types";

function personalize(message: string, name: string, branch: string) {
  return message.replaceAll("{nombre}", name).replaceAll("{sucursal}", branch);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await createClient();
  const {
    data: { user }
  } = await auth.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, name, message, branch_id")
    .eq("id", id)
    .single();

  if (!campaign) {
    return NextResponse.json({ error: "Campaña no encontrada" }, { status: 404 });
  }

  let customersQuery = supabase
    .from("customers")
    .select("id, name, phone, branches(name)")
    .eq("status", "active")
    .eq("opt_in", true)
    .order("name");

  if (campaign.branch_id) {
    customersQuery = customersQuery.eq("branch_id", campaign.branch_id);
  }

  const { data: customers } = await customersQuery;

  const rows = (customers ?? []).map((customer) => {
    const branchName = getBranchName(customer.branches);
    return {
      nombre: customer.name,
      whatsapp: customer.phone,
      mensaje: personalize(campaign.message, customer.name, branchName)
    };
  });

  if (rows.length) {
    await supabase.from("campaign_recipients").insert(
      (customers ?? []).map((customer) => ({
        campaign_id: campaign.id,
        customer_id: customer.id,
        personalized_message: personalize(
          campaign.message,
          customer.name,
          getBranchName(customer.branches)
        )
      }))
    );
  }

  const csv = toCsv(rows);

  return new Response(`\ufeff${csv}`, {
    headers: {
      "Content-Type": "text/csv;charset=utf-8",
      "Content-Disposition": `attachment; filename="campania-${campaign.name.toLowerCase().replace(/\s+/g, "-")}.csv"`
    }
  });
}
