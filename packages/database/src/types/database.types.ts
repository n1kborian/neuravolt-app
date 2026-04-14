// Dieser File wird automatisch generiert via:
// pnpm --filter=@neuravolt/database generate-types
//
// Manuell ausführen nach Supabase-Schema-Änderungen.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "company" | "customer" | "admin" | "partner";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string | null;
          company_name: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name?: string | null;
          company_name?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          company_id: string;
          customer_id: string | null;
          status: "pending" | "scheduled" | "completed" | "cancelled";
          geraete_count: number;
          scheduled_at: string | null;
          completed_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["orders"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      devices: {
        Row: {
          id: string;
          order_id: string;
          company_id: string;
          name: string;
          serial_number: string | null;
          last_checked: string | null;
          next_due: string | null;
          status: "pending" | "passed" | "failed";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["devices"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["devices"]["Insert"]>;
      };
    };
    Enums: {
      user_role: UserRole;
    };
  };
}
