export type Branch = {
  id: string;
  name: string;
  slug: string;
  address: string;
  active: boolean;
  created_at: string;
};

export type BranchMini = { name: string; slug?: string };
export type BranchRelation = BranchMini | BranchMini[] | null;

export type CustomerStatus = "active" | "unsubscribed";

export type Customer = {
  id: string;
  name: string;
  phone: string;
  branch_id: string;
  status: CustomerStatus;
  opt_in: boolean;
  source: string;
  created_at: string;
  unsubscribed_at: string | null;
  branches?: BranchRelation;
};

export type CampaignStatus = "draft" | "sent";

export type Campaign = {
  id: string;
  name: string;
  message: string;
  branch_id: string | null;
  status: CampaignStatus;
  created_at: string;
  sent_at: string | null;
  branches?: BranchRelation;
};

export function getBranchName(branches?: BranchRelation) {
  if (!branches) return "";
  return Array.isArray(branches) ? branches[0]?.name ?? "" : branches.name;
}
