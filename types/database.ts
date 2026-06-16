// Raw database types — mirrors the schema in supabase/migrations/001_initial_schema.sql exactly.
//
// When you add the Supabase CLI, replace this file with the generated output:
//   npx supabase gen types typescript --project-id your-ref > types/database.ts
//
// Note: Supabase v2 requires Relationships: [] on every table definition even when there are
// no TypeScript-level FK relationships to express. Without it the query builder returns never.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          locale: string
          timezone: string
          current_streak: number
          longest_streak: number
          last_checkin_date: string | null
          onboarded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          locale?: string
          timezone?: string
          current_streak?: number
          longest_streak?: number
          last_checkin_date?: string | null
          onboarded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          display_name?: string | null
          locale?: string
          timezone?: string
          current_streak?: number
          longest_streak?: number
          last_checkin_date?: string | null
          onboarded_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }

      card_categories: {
        Row: {
          id: string
          slug: string
          name_th: string
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name_th: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          slug?: string
          name_th?: string
          sort_order?: number
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }

      ritual_cards: {
        Row: {
          id: string
          category_id: string
          title_th: string
          body_th: string
          reflection_prompt_th: string | null
          image_url: string | null
          tags: string[]
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          title_th: string
          body_th: string
          reflection_prompt_th?: string | null
          image_url?: string | null
          tags?: string[]
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          title_th?: string
          body_th?: string
          reflection_prompt_th?: string | null
          image_url?: string | null
          tags?: string[]
          sort_order?: number
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }

      daily_checkins: {
        Row: {
          id: string
          user_id: string
          mood_key: string
          note: string | null
          checked_in_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mood_key: string
          note?: string | null
          checked_in_at?: string
          created_at?: string
        }
        Update: never
        Relationships: []
      }

      journal_entries: {
        Row: {
          id: string
          user_id: string
          checkin_id: string | null
          body: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          checkin_id?: string | null
          body: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          body?: string
          deleted_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }

      reading_history: {
        Row: {
          id: string
          user_id: string
          card_id: string
          checkin_id: string | null
          read_at: string
        }
        Insert: {
          id?: string
          user_id: string
          card_id: string
          checkin_id?: string | null
          read_at?: string
        }
        Update: never
        Relationships: []
      }

      user_memories: {
        Row: {
          id: string
          user_id: string
          content: string
          source_type: 'checkin' | 'journal' | 'synthesis'
          source_ids: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          source_type: 'checkin' | 'journal' | 'synthesis'
          source_ids?: string[]
          created_at?: string
        }
        Update: never
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Convenience row aliases — use these in application code
export type DbProfile        = Database['public']['Tables']['profiles']['Row']
export type DbCardCategory   = Database['public']['Tables']['card_categories']['Row']
export type DbRitualCard     = Database['public']['Tables']['ritual_cards']['Row']
export type DbDailyCheckin   = Database['public']['Tables']['daily_checkins']['Row']
export type DbJournalEntry   = Database['public']['Tables']['journal_entries']['Row']
export type DbReadingHistory = Database['public']['Tables']['reading_history']['Row']
export type DbUserMemory     = Database['public']['Tables']['user_memories']['Row']
