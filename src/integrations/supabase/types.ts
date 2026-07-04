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
      bookings: {
        Row: {
          client_id: string | null
          created_at: string
          deposit_gbp: number
          deposit_paid: boolean
          ends_at: string
          id: string
          notes: string | null
          price_gbp: number
          service_id: string
          starts_at: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          deposit_gbp?: number
          deposit_paid?: boolean
          ends_at: string
          id?: string
          notes?: string | null
          price_gbp: number
          service_id: string
          starts_at: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          deposit_gbp?: number
          deposit_paid?: boolean
          ends_at?: string
          id?: string
          notes?: string | null
          price_gbp?: number
          service_id?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      client_tags: {
        Row: {
          added_at: string
          client_id: string
          tag_id: string
        }
        Insert: {
          added_at?: string
          client_id: string
          tag_id: string
        }
        Update: {
          added_at?: string
          client_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_tags_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address_line: string | null
          contraindications: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          first_booked_at: string | null
          first_name: string | null
          id: string
          is_favourite: boolean
          last_booked_at: string | null
          last_name: string | null
          lifetime_spend_gbp: number
          marketing_consent: boolean
          marketing_consent_at: string | null
          notes: string | null
          phone: string | null
          postcode: string | null
          tier: Database["public"]["Enums"]["client_tier"]
          updated_at: string
          user_id: string | null
          visits_count: number
        }
        Insert: {
          address_line?: string | null
          contraindications?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_booked_at?: string | null
          first_name?: string | null
          id?: string
          is_favourite?: boolean
          last_booked_at?: string | null
          last_name?: string | null
          lifetime_spend_gbp?: number
          marketing_consent?: boolean
          marketing_consent_at?: string | null
          notes?: string | null
          phone?: string | null
          postcode?: string | null
          tier?: Database["public"]["Enums"]["client_tier"]
          updated_at?: string
          user_id?: string | null
          visits_count?: number
        }
        Update: {
          address_line?: string | null
          contraindications?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_booked_at?: string | null
          first_name?: string | null
          id?: string
          is_favourite?: boolean
          last_booked_at?: string | null
          last_name?: string | null
          lifetime_spend_gbp?: number
          marketing_consent?: boolean
          marketing_consent_at?: string | null
          notes?: string | null
          phone?: string | null
          postcode?: string | null
          tier?: Database["public"]["Enums"]["client_tier"]
          updated_at?: string
          user_id?: string | null
          visits_count?: number
        }
        Relationships: []
      }
      segment_members: {
        Row: {
          client_id: string
          joined_at: string
          segment_id: string
        }
        Insert: {
          client_id: string
          joined_at?: string
          segment_id: string
        }
        Update: {
          client_id?: string
          joined_at?: string
          segment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "segment_members_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "segment_members_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "segments"
            referencedColumns: ["id"]
          },
        ]
      }
      segments: {
        Row: {
          colour: string
          created_at: string
          description: string | null
          id: string
          is_pinned: boolean
          is_system: boolean
          name: string
          rule_json: Json | null
          slug: string
        }
        Insert: {
          colour?: string
          created_at?: string
          description?: string | null
          id?: string
          is_pinned?: boolean
          is_system?: boolean
          name: string
          rule_json?: Json | null
          slug: string
        }
        Update: {
          colour?: string
          created_at?: string
          description?: string | null
          id?: string
          is_pinned?: boolean
          is_system?: boolean
          name?: string
          rule_json?: Json | null
          slug?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          buffer_minutes: number
          category: string
          created_at: string
          deposit_gbp: number
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean
          name: string
          patch_test_lead_hours: number
          price_gbp: number
          requires_consultation: boolean
          requires_patch_test: boolean
          slug: string
          sort_order: number
          tagline: string | null
          updated_at: string
        }
        Insert: {
          buffer_minutes?: number
          category: string
          created_at?: string
          deposit_gbp?: number
          description?: string | null
          duration_minutes: number
          id?: string
          is_active?: boolean
          name: string
          patch_test_lead_hours?: number
          price_gbp: number
          requires_consultation?: boolean
          requires_patch_test?: boolean
          slug: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          buffer_minutes?: number
          category?: string
          created_at?: string
          deposit_gbp?: number
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          name?: string
          patch_test_lead_hours?: number
          price_gbp?: number
          requires_consultation?: boolean
          requires_patch_test?: boolean
          slug?: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          colour: string
          created_at: string
          description: string | null
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          colour?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          colour?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "admin"
      booking_status:
        | "pending_payment"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "no_show"
      client_tier:
        | "vip"
        | "favourite"
        | "regular"
        | "casual"
        | "new"
        | "seasonal"
        | "lapsed"
        | "blocked"
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
      app_role: ["owner", "admin"],
      booking_status: [
        "pending_payment",
        "confirmed",
        "completed",
        "cancelled",
        "no_show",
      ],
      client_tier: [
        "vip",
        "favourite",
        "regular",
        "casual",
        "new",
        "seasonal",
        "lapsed",
        "blocked",
      ],
    },
  },
} as const
