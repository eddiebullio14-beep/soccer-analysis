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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      events: {
        Row: {
          auto_flag: Database["public"]["Enums"]["auto_flag"] | null
          clip_path: string | null
          coach_note: string | null
          confidence: number | null
          created_at: string
          end_position_x: number | null
          end_position_y: number | null
          game_id: string
          id: string
          outcome: Database["public"]["Enums"]["event_outcome"]
          player_id: string | null
          player_name: string | null
          start_position_x: number | null
          start_position_y: number | null
          team: string
          timestamp_seconds: number
          type: Database["public"]["Enums"]["event_type"]
          user_id: string
        }
        Insert: {
          auto_flag?: Database["public"]["Enums"]["auto_flag"] | null
          clip_path?: string | null
          coach_note?: string | null
          confidence?: number | null
          created_at?: string
          end_position_x?: number | null
          end_position_y?: number | null
          game_id: string
          id?: string
          outcome: Database["public"]["Enums"]["event_outcome"]
          player_id?: string | null
          player_name?: string | null
          start_position_x?: number | null
          start_position_y?: number | null
          team: string
          timestamp_seconds: number
          type: Database["public"]["Enums"]["event_type"]
          user_id: string
        }
        Update: {
          auto_flag?: Database["public"]["Enums"]["auto_flag"] | null
          clip_path?: string | null
          coach_note?: string | null
          confidence?: number | null
          created_at?: string
          end_position_x?: number | null
          end_position_y?: number | null
          game_id?: string
          id?: string
          outcome?: Database["public"]["Enums"]["event_outcome"]
          player_id?: string | null
          player_name?: string | null
          start_position_x?: number | null
          start_position_y?: number | null
          team?: string
          timestamp_seconds?: number
          type?: Database["public"]["Enums"]["event_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      formation_players: {
        Row: {
          formation_id: string
          id: string
          player_id: string | null
          player_name: string
          position_x: number
          position_y: number
          role: string
        }
        Insert: {
          formation_id: string
          id?: string
          player_id?: string | null
          player_name: string
          position_x: number
          position_y: number
          role: string
        }
        Update: {
          formation_id?: string
          id?: string
          player_id?: string | null
          player_name?: string
          position_x?: number
          position_y?: number
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "formation_players_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "formation_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      formations: {
        Row: {
          confidence: number | null
          created_at: string
          formation: string
          game_id: string
          id: string
          timestamp_seconds: number
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          formation: string
          game_id: string
          id?: string
          timestamp_seconds: number
          user_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          formation?: string
          game_id?: string
          id?: string
          timestamp_seconds?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "formations_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          away_team: string
          created_at: string
          date: string
          duration: number | null
          home_team: string
          id: string
          processed_at: string | null
          status: Database["public"]["Enums"]["game_status"]
          thumbnail: string | null
          updated_at: string
          user_id: string
          video_file: string | null
          video_url: string | null
        }
        Insert: {
          away_team: string
          created_at?: string
          date: string
          duration?: number | null
          home_team: string
          id?: string
          processed_at?: string | null
          status?: Database["public"]["Enums"]["game_status"]
          thumbnail?: string | null
          updated_at?: string
          user_id: string
          video_file?: string | null
          video_url?: string | null
        }
        Update: {
          away_team?: string
          created_at?: string
          date?: string
          duration?: number | null
          home_team?: string
          id?: string
          processed_at?: string | null
          status?: Database["public"]["Enums"]["game_status"]
          thumbnail?: string | null
          updated_at?: string
          user_id?: string
          video_file?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      player_stats: {
        Row: {
          assists: number | null
          cards: number | null
          created_at: string
          dribbles: number | null
          dribbles_successful: number | null
          fouls: number | null
          game_id: string
          goals: number | null
          id: string
          key_passes: number | null
          minutes_played: number | null
          passes: number | null
          passes_completed: number | null
          player_id: string
          player_name: string
          recoveries: number | null
          shots: number | null
          shots_on_target: number | null
          touches: number | null
          turnovers: number | null
          user_id: string
          xg: number | null
        }
        Insert: {
          assists?: number | null
          cards?: number | null
          created_at?: string
          dribbles?: number | null
          dribbles_successful?: number | null
          fouls?: number | null
          game_id: string
          goals?: number | null
          id?: string
          key_passes?: number | null
          minutes_played?: number | null
          passes?: number | null
          passes_completed?: number | null
          player_id: string
          player_name: string
          recoveries?: number | null
          shots?: number | null
          shots_on_target?: number | null
          touches?: number | null
          turnovers?: number | null
          user_id: string
          xg?: number | null
        }
        Update: {
          assists?: number | null
          cards?: number | null
          created_at?: string
          dribbles?: number | null
          dribbles_successful?: number | null
          fouls?: number | null
          game_id?: string
          goals?: number | null
          id?: string
          key_passes?: number | null
          minutes_played?: number | null
          passes?: number | null
          passes_completed?: number | null
          player_id?: string
          player_name?: string
          recoveries?: number | null
          shots?: number | null
          shots_on_target?: number | null
          touches?: number | null
          turnovers?: number | null
          user_id?: string
          xg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_stats_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          created_at: string
          id: string
          jersey_number: number
          name: string
          position: Database["public"]["Enums"]["player_position"]
          team: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          jersey_number: number
          name: string
          position: Database["public"]["Enums"]["player_position"]
          team: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          jersey_number?: number
          name?: string
          position?: Database["public"]["Enums"]["player_position"]
          team?: string
          user_id?: string
        }
        Relationships: []
      }
      processing_jobs: {
        Row: {
          created_at: string
          error_message: string | null
          game_id: string
          id: string
          progress: number | null
          stage: Database["public"]["Enums"]["processing_stage"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          game_id: string
          id?: string
          progress?: number | null
          stage?: Database["public"]["Enums"]["processing_stage"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          game_id?: string
          id?: string
          progress?: number | null
          stage?: Database["public"]["Enums"]["processing_stage"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "processing_jobs_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          coach_recommendation: string | null
          created_at: string
          event_id: string | null
          game_id: string
          id: string
          notes: string | null
          rating: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          coach_recommendation?: string | null
          created_at?: string
          event_id?: string | null
          game_id: string
          id?: string
          notes?: string | null
          rating?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          coach_recommendation?: string | null
          created_at?: string
          event_id?: string | null
          game_id?: string
          id?: string
          notes?: string | null
          rating?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      team_stats: {
        Row: {
          corners: number | null
          created_at: string
          formation: string | null
          fouls: number | null
          game_id: string
          id: string
          pass_accuracy: number | null
          passes: number | null
          possession: number | null
          red_cards: number | null
          shots: number | null
          shots_on_target: number | null
          team: string
          user_id: string
          yellow_cards: number | null
        }
        Insert: {
          corners?: number | null
          created_at?: string
          formation?: string | null
          fouls?: number | null
          game_id: string
          id?: string
          pass_accuracy?: number | null
          passes?: number | null
          possession?: number | null
          red_cards?: number | null
          shots?: number | null
          shots_on_target?: number | null
          team: string
          user_id: string
          yellow_cards?: number | null
        }
        Update: {
          corners?: number | null
          created_at?: string
          formation?: string | null
          fouls?: number | null
          game_id?: string
          id?: string
          pass_accuracy?: number | null
          passes?: number | null
          possession?: number | null
          red_cards?: number | null
          shots?: number | null
          shots_on_target?: number | null
          team?: string
          user_id?: string
          yellow_cards?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "team_stats_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
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
      auto_flag: "good" | "bad"
      event_outcome: "successful" | "failed"
      event_type:
        | "pass"
        | "shot"
        | "dribble"
        | "tackle"
        | "foul"
        | "goal"
        | "card"
      game_status: "uploaded" | "processing" | "completed" | "failed"
      player_position:
        | "GK"
        | "CB"
        | "LB"
        | "RB"
        | "CDM"
        | "CM"
        | "CAM"
        | "LW"
        | "RW"
        | "ST"
      processing_stage:
        | "uploading"
        | "processing"
        | "analyzing"
        | "complete"
        | "failed"
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
      auto_flag: ["good", "bad"],
      event_outcome: ["successful", "failed"],
      event_type: ["pass", "shot", "dribble", "tackle", "foul", "goal", "card"],
      game_status: ["uploaded", "processing", "completed", "failed"],
      player_position: [
        "GK",
        "CB",
        "LB",
        "RB",
        "CDM",
        "CM",
        "CAM",
        "LW",
        "RW",
        "ST",
      ],
      processing_stage: [
        "uploading",
        "processing",
        "analyzing",
        "complete",
        "failed",
      ],
    },
  },
} as const
