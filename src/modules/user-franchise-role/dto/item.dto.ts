export interface UserFranchiseRoleResponseDto {
  id: string;
  note: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;

  franchise_id: string;
  franchise_code: string;
  franchise_name: string;

  role_id: string;
  role_code: string;
  role_name: string;

  user_id: string;
  user_name: string;
  user_email: string;
}
