export interface FranchiseItemDto {
  id: string;
  code: string;
  name: string;
  hotline: string;
  logo_url: string;
  address: string;
  opened_at: string;
  closed_at: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface FranchiseSelectDto {
  value: string;
  code: string;
  name: string;
}
