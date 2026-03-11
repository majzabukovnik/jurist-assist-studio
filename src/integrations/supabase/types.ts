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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      compliance: {
        Row: {
          aml_kyc_label: string | null
          aml_kyc_level: string | null
          case_id: string | null
          created_at: string
          id: string
          kompleksnost: number | null
          kompleksnost_label: string | null
          konflikt_interesov_label: string | null
          konflikt_interesov_level: string | null
          odvetniki: Json | null
          panoge: string[] | null
          povzetek: string[] | null
          povzetek_primera: string | null
          pravna_podrocja: string[] | null
          priporocilo: string | null
          roki: Json | null
        }
        Insert: {
          aml_kyc_label?: string | null
          aml_kyc_level?: string | null
          case_id?: string | null
          created_at?: string
          id?: string
          kompleksnost?: number | null
          kompleksnost_label?: string | null
          konflikt_interesov_label?: string | null
          konflikt_interesov_level?: string | null
          odvetniki?: Json | null
          panoge?: string[] | null
          povzetek?: string[] | null
          povzetek_primera?: string | null
          pravna_podrocja?: string[] | null
          priporocilo?: string | null
          roki?: Json | null
        }
        Update: {
          aml_kyc_label?: string | null
          aml_kyc_level?: string | null
          case_id?: string | null
          created_at?: string
          id?: string
          kompleksnost?: number | null
          kompleksnost_label?: string | null
          konflikt_interesov_label?: string | null
          konflikt_interesov_level?: string | null
          odvetniki?: Json | null
          panoge?: string[] | null
          povzetek?: string[] | null
          povzetek_primera?: string | null
          pravna_podrocja?: string[] | null
          priporocilo?: string | null
          roki?: Json | null
        }
        Relationships: []
      }
      email_queue: {
        Row: {
          created_at: string
          id: string
          sent_at: string | null
          status: string
          subject: string
          summary_id: string | null
          to_email: string
          to_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          sent_at?: string | null
          status?: string
          subject: string
          summary_id?: string | null
          to_email: string
          to_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          sent_at?: string | null
          status?: string
          subject?: string
          summary_id?: string | null
          to_email?: string
          to_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_queue_summary_id_fkey"
            columns: ["summary_id"]
            isOneToOne: false
            referencedRelation: "summaries"
            referencedColumns: ["id"]
          },
        ]
      }
      summaries: {
        Row: {
          created_at: string
          id: string
          naslednji_koraki: string[] | null
          od_email: string | null
          od_ime: string | null
          opis_problema: string | null
          povzetek: string[] | null
          pozdrav: string | null
          uvod: string | null
          vprasanja: string[] | null
          za_email: string | null
          za_ime: string | null
          zadeva: string | null
          zakljucek: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          naslednji_koraki?: string[] | null
          od_email?: string | null
          od_ime?: string | null
          opis_problema?: string | null
          povzetek?: string[] | null
          pozdrav?: string | null
          uvod?: string | null
          vprasanja?: string[] | null
          za_email?: string | null
          za_ime?: string | null
          zadeva?: string | null
          zakljucek?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          naslednji_koraki?: string[] | null
          od_email?: string | null
          od_ime?: string | null
          opis_problema?: string | null
          povzetek?: string[] | null
          pozdrav?: string | null
          uvod?: string | null
          vprasanja?: string[] | null
          za_email?: string | null
          za_ime?: string | null
          zadeva?: string | null
          zakljucek?: string | null
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
