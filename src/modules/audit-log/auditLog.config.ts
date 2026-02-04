import { IFranchise } from "../franchise";

export const AUDIT_FIELDS = {
  FRANCHISE: [
    "code",
    "name",
    "opened_at",
    "closed_at",
    "hotline",
    "logo_url",
    "address",
    "is_active",
  ] as readonly (keyof IFranchise)[],
  PRODUCT: ["name", "price", "status"],
};
