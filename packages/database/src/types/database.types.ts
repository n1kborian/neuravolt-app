export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_requests: {
        Row: {
          branche: string | null
          company: string | null
          consent_privacy: boolean
          created_at: string
          desired_timeframe: string | null
          device_count_range: string | null
          email: string
          first_name: string
          id: string
          ip_hash: string | null
          last_name: string
          message: string | null
          status: string
          user_agent: string | null
        }
        Insert: {
          branche?: string | null
          company?: string | null
          consent_privacy: boolean
          created_at?: string
          desired_timeframe?: string | null
          device_count_range?: string | null
          email: string
          first_name: string
          id?: string
          ip_hash?: string | null
          last_name: string
          message?: string | null
          status?: string
          user_agent?: string | null
        }
        Update: {
          branche?: string | null
          company?: string | null
          consent_privacy?: boolean
          created_at?: string
          desired_timeframe?: string | null
          device_count_range?: string | null
          email?: string
          first_name?: string
          id?: string
          ip_hash?: string | null
          last_name?: string
          message?: string | null
          status?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      fristencheck_signups: {
        Row: {
          branche: string | null
          company: string | null
          consent_privacy: boolean
          created_at: string
          email: string
          id: string
          ip_hash: string | null
          user_agent: string | null
        }
        Insert: {
          branche?: string | null
          company?: string | null
          consent_privacy: boolean
          created_at?: string
          email: string
          id?: string
          ip_hash?: string | null
          user_agent?: string | null
        }
        Update: {
          branche?: string | null
          company?: string | null
          consent_privacy?: boolean
          created_at?: string
          email?: string
          id?: string
          ip_hash?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      newsletter_signups: {
        Row: {
          confirm_token: string
          confirm_token_expires_at: string
          confirmed_at: string | null
          consent_privacy: boolean
          created_at: string
          email: string
          id: string
          ip_hash: string | null
          source: string | null
          status: Database["public"]["Enums"]["newsletter_status"]
          unsubscribed_at: string | null
          user_agent: string | null
        }
        Insert: {
          confirm_token: string
          confirm_token_expires_at: string
          confirmed_at?: string | null
          consent_privacy: boolean
          created_at?: string
          email: string
          id?: string
          ip_hash?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["newsletter_status"]
          unsubscribed_at?: string | null
          user_agent?: string | null
        }
        Update: {
          confirm_token?: string
          confirm_token_expires_at?: string
          confirmed_at?: string | null
          consent_privacy?: boolean
          created_at?: string
          email?: string
          id?: string
          ip_hash?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["newsletter_status"]
          unsubscribed_at?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: string | null
          booked_at: string | null
          booked_by: string | null
          branche: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          city: string
          completed_at: string | null
          created_at: string
          customer_company: string
          customer_contact: string | null
          customer_email: string | null
          customer_phone: string | null
          desired_date: string | null
          desired_timeframe: string | null
          device_count: number
          id: string
          is_first_inspection: boolean
          notes: string | null
          postal_code: string | null
          price_per_device_cents: number
          protocol_path: string | null
          protocol_uploaded_at: string | null
          quote_request_id: string | null
          setup_fee_cents: number
          status: Database["public"]["Enums"]["order_status"]
          total_net_cents: number
          travel_fee_cents: number
          updated_at: string
        }
        Insert: {
          address?: string | null
          booked_at?: string | null
          booked_by?: string | null
          branche?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          city: string
          completed_at?: string | null
          created_at?: string
          customer_company: string
          customer_contact?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          desired_date?: string | null
          desired_timeframe?: string | null
          device_count: number
          id?: string
          is_first_inspection?: boolean
          notes?: string | null
          postal_code?: string | null
          price_per_device_cents: number
          protocol_path?: string | null
          protocol_uploaded_at?: string | null
          quote_request_id?: string | null
          setup_fee_cents?: number
          status?: Database["public"]["Enums"]["order_status"]
          total_net_cents: number
          travel_fee_cents?: number
          updated_at?: string
        }
        Update: {
          address?: string | null
          booked_at?: string | null
          booked_by?: string | null
          branche?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          city?: string
          completed_at?: string | null
          created_at?: string
          customer_company?: string
          customer_contact?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          desired_date?: string | null
          desired_timeframe?: string | null
          device_count?: number
          id?: string
          is_first_inspection?: boolean
          notes?: string | null
          postal_code?: string | null
          price_per_device_cents?: number
          protocol_path?: string | null
          protocol_uploaded_at?: string | null
          quote_request_id?: string | null
          setup_fee_cents?: number
          status?: Database["public"]["Enums"]["order_status"]
          total_net_cents?: number
          travel_fee_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_booked_by_fkey"
            columns: ["booked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          branche: string | null
          city: string | null
          company: string | null
          consent_given_at: string
          consent_privacy: boolean
          created_at: string
          desired_timeframe: string | null
          device_count: number
          devices_subtotal_cents: number
          email: string
          first_name: string
          gross_total_cents: number
          id: string
          ip_hash: string | null
          is_first_inspection: boolean
          last_name: string
          minimum_adjustment_cents: number
          net_total_cents: number
          notes: string | null
          phone: string | null
          postal_code: string | null
          price_per_device_cents: number
          setup_fee_cents: number
          status: string
          travel_fee_cents: number
          user_agent: string | null
          vat_cents: number
        }
        Insert: {
          branche?: string | null
          city?: string | null
          company?: string | null
          consent_given_at?: string
          consent_privacy: boolean
          created_at?: string
          desired_timeframe?: string | null
          device_count: number
          devices_subtotal_cents: number
          email: string
          first_name: string
          gross_total_cents: number
          id?: string
          ip_hash?: string | null
          is_first_inspection: boolean
          last_name: string
          minimum_adjustment_cents: number
          net_total_cents: number
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          price_per_device_cents: number
          setup_fee_cents: number
          status?: string
          travel_fee_cents: number
          user_agent?: string | null
          vat_cents: number
        }
        Update: {
          branche?: string | null
          city?: string | null
          company?: string | null
          consent_given_at?: string
          consent_privacy?: boolean
          created_at?: string
          desired_timeframe?: string | null
          device_count?: number
          devices_subtotal_cents?: number
          email?: string
          first_name?: string
          gross_total_cents?: number
          id?: string
          ip_hash?: string | null
          is_first_inspection?: boolean
          last_name?: string
          minimum_adjustment_cents?: number
          net_total_cents?: number
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          price_per_device_cents?: number
          setup_fee_cents?: number
          status?: string
          travel_fee_cents?: number
          user_agent?: string | null
          vat_cents?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      newsletter_status: "pending" | "confirmed" | "unsubscribed"
      order_status:
        | "open"
        | "booked"
        | "in_progress"
        | "completed"
        | "cancelled"
      user_role: "company" | "customer" | "admin" | "partner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      newsletter_status: ["pending", "confirmed", "unsubscribed"],
      order_status: ["open", "booked", "in_progress", "completed", "cancelled"],
      user_role: ["company", "customer", "admin", "partner"],
    },
  },
} as const
