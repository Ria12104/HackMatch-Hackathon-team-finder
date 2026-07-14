export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      audit_log: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          actor_id: string | null
          created_at: string
          id: string
          metadata: Json
          reason: string | null
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          reason?: string | null
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          reason?: string | null
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_log: {
        Row: {
          action: Database["public"]["Enums"]["credit_action"]
          amount: number
          created_at: string
          credits_after: number
          credits_before: number
          hackathon_id: string | null
          id: string
          idempotency_key: string | null
          metadata: Json
          user_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["credit_action"]
          amount: number
          created_at?: string
          credits_after: number
          credits_before: number
          hackathon_id?: string | null
          id?: string
          idempotency_key?: string | null
          metadata?: Json
          user_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["credit_action"]
          amount?: number
          created_at?: string
          credits_after?: number
          credits_before?: number
          hackathon_id?: string | null
          id?: string
          idempotency_key?: string | null
          metadata?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_log_hackathon_id_fkey"
            columns: ["hackathon_id"]
            isOneToOne: false
            referencedRelation: "hackathons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hackathon_interests: {
        Row: {
          created_at: string
          deleted_at: string | null
          hackathon_id: string
          id: string
          match_count: number
          note: string | null
          status: Database["public"]["Enums"]["hackathon_interest_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          hackathon_id: string
          id?: string
          match_count?: number
          note?: string | null
          status?: Database["public"]["Enums"]["hackathon_interest_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          hackathon_id?: string
          id?: string
          match_count?: number
          note?: string | null
          status?: Database["public"]["Enums"]["hackathon_interest_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hackathon_interests_hackathon_id_fkey"
            columns: ["hackathon_id"]
            isOneToOne: false
            referencedRelation: "hackathons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hackathon_interests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hackathons: {
        Row: {
          city: string | null
          created_at: string
          deleted_at: string | null
          description: string
          end_date: string
          id: string
          location_type: Database["public"]["Enums"]["location_type"]
          looking_count: number
          metadata: Json
          name: string
          organizer: string
          registration_deadline: string | null
          rejection_reason: string | null
          roles_wanted: Json
          slug: string
          source_url: string
          start_date: string
          status: Database["public"]["Enums"]["hackathon_status"]
          submitted_by: string | null
          team_size_max: number | null
          team_size_min: number | null
          teams_forming_count: number
          updated_at: string
          venue: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          deleted_at?: string | null
          description: string
          end_date: string
          id?: string
          location_type: Database["public"]["Enums"]["location_type"]
          looking_count?: number
          metadata?: Json
          name: string
          organizer: string
          registration_deadline?: string | null
          rejection_reason?: string | null
          roles_wanted?: Json
          slug: string
          source_url: string
          start_date: string
          status?: Database["public"]["Enums"]["hackathon_status"]
          submitted_by?: string | null
          team_size_max?: number | null
          team_size_min?: number | null
          teams_forming_count?: number
          updated_at?: string
          venue?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string
          end_date?: string
          id?: string
          location_type?: Database["public"]["Enums"]["location_type"]
          looking_count?: number
          metadata?: Json
          name?: string
          organizer?: string
          registration_deadline?: string | null
          rejection_reason?: string | null
          roles_wanted?: Json
          slug?: string
          source_url?: string
          start_date?: string
          status?: Database["public"]["Enums"]["hackathon_status"]
          submitted_by?: string | null
          team_size_max?: number | null
          team_size_min?: number | null
          teams_forming_count?: number
          updated_at?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hackathons_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invites: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          bonus_awarded: boolean
          channel: Database["public"]["Enums"]["invite_channel"]
          code: string
          created_at: string
          hackathon_id: string | null
          id: string
          inviter_id: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          bonus_awarded?: boolean
          channel?: Database["public"]["Enums"]["invite_channel"]
          code: string
          created_at?: string
          hackathon_id?: string | null
          id?: string
          inviter_id: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          bonus_awarded?: boolean
          channel?: Database["public"]["Enums"]["invite_channel"]
          code?: string
          created_at?: string
          hackathon_id?: string | null
          id?: string
          inviter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invites_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invites_hackathon_id_fkey"
            columns: ["hackathon_id"]
            isOneToOne: false
            referencedRelation: "hackathons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invites_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          archived_at: string | null
          backed_out_by: string | null
          blocked_by: string | null
          created_at: string
          hackathon_id: string
          id: string
          status: Database["public"]["Enums"]["match_status"]
          updated_at: string
          user1_id: string
          user1_team_status:
            | Database["public"]["Enums"]["match_team_status"]
            | null
          user2_id: string
          user2_team_status:
            | Database["public"]["Enums"]["match_team_status"]
            | null
        }
        Insert: {
          archived_at?: string | null
          backed_out_by?: string | null
          blocked_by?: string | null
          created_at?: string
          hackathon_id: string
          id?: string
          status?: Database["public"]["Enums"]["match_status"]
          updated_at?: string
          user1_id: string
          user1_team_status?:
            | Database["public"]["Enums"]["match_team_status"]
            | null
          user2_id: string
          user2_team_status?:
            | Database["public"]["Enums"]["match_team_status"]
            | null
        }
        Update: {
          archived_at?: string | null
          backed_out_by?: string | null
          blocked_by?: string | null
          created_at?: string
          hackathon_id?: string
          id?: string
          status?: Database["public"]["Enums"]["match_status"]
          updated_at?: string
          user1_id?: string
          user1_team_status?:
            | Database["public"]["Enums"]["match_team_status"]
            | null
          user2_id?: string
          user2_team_status?:
            | Database["public"]["Enums"]["match_team_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_backed_out_by_fkey"
            columns: ["backed_out_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_blocked_by_fkey"
            columns: ["blocked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_hackathon_id_fkey"
            columns: ["hackathon_id"]
            isOneToOne: false
            referencedRelation: "hackathons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          deleted_at: string | null
          id: string
          match_id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          match_id: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          match_id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          achievements: Json
          availability: string | null
          avatar_url: string | null
          bio: string | null
          branch: string | null
          created_at: string
          credits_last_reset: string
          daily_credits: number
          deleted_at: string | null
          display_name: string
          email: string | null
          email_visible: boolean
          featured_project: string | null
          github_url: string | null
          hackathon_history: Json
          hackathon_summary: string | null
          id: string
          is_suspended: boolean
          last_active_date: string | null
          linkedin_url: string | null
          looking_for_roles: string[]
          notification_credit_reset_enabled: boolean
          notification_deadlines_enabled: boolean
          notification_marketing_enabled: boolean
          notification_matches_enabled: boolean
          notification_messages_enabled: boolean
          onboarding_completed: boolean
          phone: string | null
          phone_visible: boolean
          portfolio_url: string | null
          primary_role: string | null
          profile_score: number
          profile_strength: Database["public"]["Enums"]["profile_strength"]
          projects: Json
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          skills: string[]
          streak_count: number
          suspended_at: string | null
          suspended_reason: string | null
          updated_at: string
          year: Database["public"]["Enums"]["user_year"] | null
        }
        Insert: {
          achievements?: Json
          availability?: string | null
          avatar_url?: string | null
          bio?: string | null
          branch?: string | null
          created_at?: string
          credits_last_reset?: string
          daily_credits?: number
          deleted_at?: string | null
          display_name: string
          email?: string | null
          email_visible?: boolean
          featured_project?: string | null
          github_url?: string | null
          hackathon_history?: Json
          hackathon_summary?: string | null
          id: string
          is_suspended?: boolean
          last_active_date?: string | null
          linkedin_url?: string | null
          looking_for_roles?: string[]
          notification_credit_reset_enabled?: boolean
          notification_deadlines_enabled?: boolean
          notification_marketing_enabled?: boolean
          notification_matches_enabled?: boolean
          notification_messages_enabled?: boolean
          onboarding_completed?: boolean
          phone?: string | null
          phone_visible?: boolean
          portfolio_url?: string | null
          primary_role?: string | null
          profile_score?: number
          profile_strength?: Database["public"]["Enums"]["profile_strength"]
          projects?: Json
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          skills?: string[]
          streak_count?: number
          suspended_at?: string | null
          suspended_reason?: string | null
          updated_at?: string
          year?: Database["public"]["Enums"]["user_year"] | null
        }
        Update: {
          achievements?: Json
          availability?: string | null
          avatar_url?: string | null
          bio?: string | null
          branch?: string | null
          created_at?: string
          credits_last_reset?: string
          daily_credits?: number
          deleted_at?: string | null
          display_name?: string
          email?: string | null
          email_visible?: boolean
          featured_project?: string | null
          github_url?: string | null
          hackathon_history?: Json
          hackathon_summary?: string | null
          id?: string
          is_suspended?: boolean
          last_active_date?: string | null
          linkedin_url?: string | null
          looking_for_roles?: string[]
          notification_credit_reset_enabled?: boolean
          notification_deadlines_enabled?: boolean
          notification_marketing_enabled?: boolean
          notification_matches_enabled?: boolean
          notification_messages_enabled?: boolean
          onboarding_completed?: boolean
          phone?: string | null
          phone_visible?: boolean
          portfolio_url?: string | null
          primary_role?: string | null
          profile_score?: number
          profile_strength?: Database["public"]["Enums"]["profile_strength"]
          projects?: Json
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          skills?: string[]
          streak_count?: number
          suspended_at?: string | null
          suspended_reason?: string | null
          updated_at?: string
          year?: Database["public"]["Enums"]["user_year"] | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action: Database["public"]["Enums"]["rate_limit_action"]
          actor_id: string | null
          blocked_until: string | null
          created_at: string
          id: string
          ip_address: unknown
          metadata: Json
          request_count: number
          updated_at: string
          window_start: string
        }
        Insert: {
          action: Database["public"]["Enums"]["rate_limit_action"]
          actor_id?: string | null
          blocked_until?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          request_count?: number
          updated_at?: string
          window_start: string
        }
        Update: {
          action?: Database["public"]["Enums"]["rate_limit_action"]
          actor_id?: string | null
          blocked_until?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          request_count?: number
          updated_at?: string
          window_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "rate_limits_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          details: string | null
          hackathon_id: string | null
          id: string
          message_id: string | null
          reason: string
          reported_user_id: string | null
          reporter_id: string
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["report_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          hackathon_id?: string | null
          id?: string
          message_id?: string | null
          reason: string
          reported_user_id?: string | null
          reporter_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          details?: string | null
          hackathon_id?: string | null
          id?: string
          message_id?: string | null
          reason?: string
          reported_user_id?: string | null
          reporter_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_hackathon_id_fkey"
            columns: ["hackathon_id"]
            isOneToOne: false
            referencedRelation: "hackathons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      swipes: {
        Row: {
          created_at: string
          direction: Database["public"]["Enums"]["swipe_direction"]
          hackathon_id: string
          id: string
          idempotency_key: string | null
          intent: Database["public"]["Enums"]["swipe_intent"] | null
          swiped_id: string
          swiper_id: string
        }
        Insert: {
          created_at?: string
          direction: Database["public"]["Enums"]["swipe_direction"]
          hackathon_id: string
          id?: string
          idempotency_key?: string | null
          intent?: Database["public"]["Enums"]["swipe_intent"] | null
          swiped_id: string
          swiper_id: string
        }
        Update: {
          created_at?: string
          direction?: Database["public"]["Enums"]["swipe_direction"]
          hackathon_id?: string
          id?: string
          idempotency_key?: string | null
          intent?: Database["public"]["Enums"]["swipe_intent"] | null
          swiped_id?: string
          swiper_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "swipes_hackathon_id_fkey"
            columns: ["hackathon_id"]
            isOneToOne: false
            referencedRelation: "hackathons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipes_swiped_id_fkey"
            columns: ["swiped_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipes_swiper_id_fkey"
            columns: ["swiper_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          role: string | null
          status: Database["public"]["Enums"]["team_membership_status"]
          team_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string | null
          status?: Database["public"]["Enums"]["team_membership_status"]
          team_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string | null
          status?: Database["public"]["Enums"]["team_membership_status"]
          team_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          hackathon_id: string
          id: string
          idea_decided: boolean
          name: string | null
          registered_on_official_site: boolean
          roles_assigned: boolean
          status: Database["public"]["Enums"]["team_status"]
          submission_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          hackathon_id: string
          id?: string
          idea_decided?: boolean
          name?: string | null
          registered_on_official_site?: boolean
          roles_assigned?: boolean
          status?: Database["public"]["Enums"]["team_status"]
          submission_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          hackathon_id?: string
          id?: string
          idea_decided?: boolean
          name?: string | null
          registered_on_official_site?: boolean
          roles_assigned?: boolean
          status?: Database["public"]["Enums"]["team_status"]
          submission_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_hackathon_id_fkey"
            columns: ["hackathon_id"]
            isOneToOne: false
            referencedRelation: "hackathons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      audit_action:
        | "hackathon_approved"
        | "hackathon_rejected"
        | "hackathon_updated"
        | "user_suspended"
        | "user_unsuspended"
        | "report_reviewed"
        | "credits_adjusted"
        | "admin_note"
      credit_action:
        | "swipe_like"
        | "daily_reset"
        | "invite_bonus"
        | "profile_completion_bonus"
        | "team_confirmation_bonus"
        | "manual_adjustment"
      hackathon_interest_status: "looking" | "has_team" | "not_interested"
      hackathon_status:
        | "pending"
        | "verified"
        | "rejected"
        | "past"
        | "cancelled"
      invite_channel: "whatsapp" | "instagram" | "qr" | "link" | "other"
      location_type: "online" | "in_person" | "hybrid"
      match_status: "active" | "backed_out" | "blocked"
      match_team_status: "discussing" | "teamed" | "not_a_fit"
      profile_strength: "starter" | "ready" | "strong"
      rate_limit_action:
        | "auth_otp"
        | "hackathon_submission"
        | "swipe"
        | "message"
        | "invite"
        | "report"
      report_status: "open" | "reviewing" | "resolved" | "dismissed"
      swipe_direction: "pass" | "like"
      swipe_intent:
        | "strong_fit"
        | "need_this_role"
        | "similar_idea"
        | "want_to_discuss"
      team_membership_status: "invited" | "accepted" | "left" | "removed"
      team_status: "forming" | "confirmed" | "submitted" | "archived"
      user_year: "1st" | "2nd" | "3rd" | "4th" | "alumni"
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
      audit_action: [
        "hackathon_approved",
        "hackathon_rejected",
        "hackathon_updated",
        "user_suspended",
        "user_unsuspended",
        "report_reviewed",
        "credits_adjusted",
        "admin_note",
      ],
      credit_action: [
        "swipe_like",
        "daily_reset",
        "invite_bonus",
        "profile_completion_bonus",
        "team_confirmation_bonus",
        "manual_adjustment",
      ],
      hackathon_interest_status: ["looking", "has_team", "not_interested"],
      hackathon_status: [
        "pending",
        "verified",
        "rejected",
        "past",
        "cancelled",
      ],
      invite_channel: ["whatsapp", "instagram", "qr", "link", "other"],
      location_type: ["online", "in_person", "hybrid"],
      match_status: ["active", "backed_out", "blocked"],
      match_team_status: ["discussing", "teamed", "not_a_fit"],
      profile_strength: ["starter", "ready", "strong"],
      rate_limit_action: [
        "auth_otp",
        "hackathon_submission",
        "swipe",
        "message",
        "invite",
        "report",
      ],
      report_status: ["open", "reviewing", "resolved", "dismissed"],
      swipe_direction: ["pass", "like"],
      swipe_intent: [
        "strong_fit",
        "need_this_role",
        "similar_idea",
        "want_to_discuss",
      ],
      team_membership_status: ["invited", "accepted", "left", "removed"],
      team_status: ["forming", "confirmed", "submitted", "archived"],
      user_year: ["1st", "2nd", "3rd", "4th", "alumni"],
    },
  },
} as const
