export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          email: string | null;
          avatar_url: string | null;
          plan: "free" | "pro" | "enterprise";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      x_accounts: {
        Row: {
          id: string;
          profile_id: string;
          platform: "x" | "threads";
          username: string;
          access_token: string | null;
          refresh_token: string | null;
          token_expires_at: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["x_accounts"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["x_accounts"]["Insert"]>;
      };
      post_personas: {
        Row: {
          id: string;
          profile_id: string;
          name: string;
          first_person: string;
          writing_style: string;
          endings: string[];
          ng_expressions: string[];
          values: string;
          target_audience: string;
          expert_topics: string[];
          cta_style: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["post_personas"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["post_personas"]["Insert"]>;
      };
      post_ideas: {
        Row: {
          id: string;
          profile_id: string;
          theme: string;
          memo: string | null;
          is_used: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["post_ideas"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["post_ideas"]["Insert"]>;
      };
      generated_posts: {
        Row: {
          id: string;
          profile_id: string;
          persona_id: string | null;
          platform: "x" | "threads";
          theme: string;
          target: string | null;
          goal: string | null;
          tone: string;
          title: string;
          hook: string;
          body: string;
          cta: string | null;
          hashtags: string[];
          char_count: number;
          is_saved: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["generated_posts"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["generated_posts"]["Insert"]>;
      };
      scheduled_posts: {
        Row: {
          id: string;
          profile_id: string;
          account_id: string | null;
          platform: "x" | "threads";
          content: string;
          hashtags: string[];
          scheduled_at: string;
          posted_at: string | null;
          status: "draft" | "scheduled" | "posting" | "posted" | "failed";
          error_message: string | null;
          auto_rule_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["scheduled_posts"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["scheduled_posts"]["Insert"]>;
      };
      post_metrics: {
        Row: {
          id: string;
          profile_id: string;
          scheduled_post_id: string | null;
          platform: "x" | "threads";
          content: string;
          impressions: number;
          likes: number;
          retweets: number;
          replies: number;
          theme: string | null;
          tone: string | null;
          posted_at: string;
          hook_strength: number | null;
          empathy: number | null;
          shareability: number | null;
          self_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["post_metrics"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["post_metrics"]["Insert"]>;
      };
      auto_post_rules: {
        Row: {
          id: string;
          profile_id: string;
          persona_id: string | null;
          platform: "x" | "threads";
          name: string;
          frequency: string;
          time_slots: string[];
          themes: string[];
          is_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["auto_post_rules"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["auto_post_rules"]["Insert"]>;
      };
    };
  };
}
