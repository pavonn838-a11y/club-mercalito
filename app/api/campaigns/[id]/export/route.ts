import { NextResponse } from "next/server";
import { getCampaignRecipients } from "@/lib/campaigns";
import { toCsv } from "@/lib/csv";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

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

  const recipients = await getCampaignRecipients(supabase, campaign);

  const rows = recipients.map((recipient) => ({
    nombre: recipient.name,
    whatsapp: recipient.phone,
    mensaje: recipient.personalizedMessage
  }));

  if (rows.length) {
    await supabase.from("campaign_recipients").insert(
      recipients.map((recipient) => ({
        campaign_id: campaign.id,
        customer_id: recipient.customerId,
        personalized_message: recipient.personalizedMessage
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
