import { getBranchName } from "@/lib/types";

type CampaignForRecipients = {
  id: string;
  message: string;
  branch_id: string | null;
};

type CustomerForCampaign = {
  id: string;
  name: string;
  phone: string;
  branches: { name: string } | { name: string }[] | null;
};

export function personalizeCampaignMessage(message: string, name: string, branch: string) {
  return message.replaceAll("{nombre}", name).replaceAll("{sucursal}", branch);
}

export async function getCampaignRecipients(
  supabase: any,
  campaign: CampaignForRecipients
) {
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

  return ((customers ?? []) as CustomerForCampaign[]).map((customer) => {
    const branchName = getBranchName(customer.branches);

    return {
      customerId: customer.id,
      name: customer.name,
      phone: customer.phone,
      branchName,
      personalizedMessage: personalizeCampaignMessage(
        campaign.message,
        customer.name,
        branchName
      )
    };
  });
}
