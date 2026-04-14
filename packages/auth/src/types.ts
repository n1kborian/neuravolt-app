export type UserRole = "company" | "customer" | "admin" | "partner";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  profile: Profile;
}
