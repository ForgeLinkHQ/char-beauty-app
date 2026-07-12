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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      blackout_periods: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          reason: string | null
          starts_at: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          reason?: string | null
          starts_at: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          reason?: string | null
          starts_at?: string
        }
        Relationships: []
      }
      booking_settings: {
        Row: {
          hold_minutes: number
          id: number
          max_advance_days: number
          min_notice_hours: number
          slot_granularity_minutes: number
          timezone: string
          updated_at: string
        }
        Insert: {
          hold_minutes?: number
          id?: number
          max_advance_days?: number
          min_notice_hours?: number
          slot_granularity_minutes?: number
          timezone?: string
          updated_at?: string
        }
        Update: {
          hold_minutes?: number
          id?: number
          max_advance_days?: number
          min_notice_hours?: number
          slot_granularity_minutes?: number
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          blocked_until: string
          buffer_minutes: number
          client_id: string | null
          created_at: string
          deposit_gbp: number
          deposit_paid: boolean
          ends_at: string
          hold_expires_at: string | null
          id: string
          notes: string | null
          price_gbp: number
          service_id: string
          source: string
          starts_at: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
        }
        Insert: {
          blocked_until: string
          buffer_minutes?: number
          client_id?: string | null
          created_at?: string
          deposit_gbp?: number
          deposit_paid?: boolean
          ends_at: string
          hold_expires_at?: string | null
          id?: string
          notes?: string | null
          price_gbp: number
          service_id: string
          source?: string
          starts_at: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Update: {
          blocked_until?: string
          buffer_minutes?: number
          client_id?: string | null
          created_at?: string
          deposit_gbp?: number
          deposit_paid?: boolean
          ends_at?: string
          hold_expires_at?: string | null
          id?: string
          notes?: string | null
          price_gbp?: number
          service_id?: string
          source?: string
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
      business_hours: {
        Row: {
          closes_at: string
          created_at: string
          day_of_week: number
          id: string
          opens_at: string
        }
        Insert: {
          closes_at: string
          created_at?: string
          day_of_week: number
          id?: string
          opens_at: string
        }
        Update: {
          closes_at?: string
          created_at?: string
          day_of_week?: number
          id?: string
          opens_at?: string
        }
        Relationships: []
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
      payments: {
        Row: {
          amount_gbp: number
          booking_id: string
          created_at: string
          currency: string
          id: string
          kind: Database["public"]["Enums"]["payment_kind"]
          status: Database["public"]["Enums"]["payment_status"]
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
        }
        Insert: {
          amount_gbp: number
          booking_id: string
          created_at?: string
          currency?: string
          id?: string
          kind?: Database["public"]["Enums"]["payment_kind"]
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_gbp?: number
          booking_id?: string
          created_at?: string
          currency?: string
          id?: string
          kind?: Database["public"]["Enums"]["payment_kind"]
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
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
      stripe_events: {
        Row: {
          event_id: string
          payload: Json
          received_at: string
          type: string
        }
        Insert: {
          event_id: string
          payload: Json
          received_at?: string
          type: string
        }
        Update: {
          event_id?: string
          payload?: Json
          received_at?: string
          type?: string
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
      cancel_expired_holds: { Args: never; Returns: number }
      get_available_slots: {
        Args: { _day: string; _service_slug: string }
        Returns: {
          slot_starts_at: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      reserve_slot: {
        Args: {
          _email: string
          _first_name: string
          _last_name: string
          _marketing_consent?: boolean
          _notes?: string
          _phone?: string
          _service_slug: string
          _starts_at: string
        }
        Returns: Json
      }
      slot_unavailable_reason: {
        Args: {
          _service: Database["public"]["Tables"]["services"]["Row"]
          _skip_patch_lead?: boolean
          _starts_at: string
        }
        Returns: string
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
      payment_kind: "deposit" | "balance" | "refund"
      payment_status:
        | "requires_payment"
        | "processing"
        | "succeeded"
        | "failed"
        | "refunded"
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
  graphql_public: {
    Enums: {},
  },
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
      payment_kind: ["deposit", "balance", "refund"],
      payment_status: [
        "requires_payment",
        "processing",
        "succeeded",
        "failed",
        "refunded",
      ],
    },
  },
} as const
