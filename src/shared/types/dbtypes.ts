export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            comments: {
                Row: {
                    created_at: string
                    id: string
                    parent_id: string | null
                    post_id: string
                    profile_id: string
                    text: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string
                    id?: string
                    parent_id?: string | null
                    post_id: string
                    profile_id: string
                    text: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string
                    id?: string
                    parent_id?: string | null
                    post_id?: string
                    profile_id?: string
                    text?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "fk_comments_parent"
                        columns: ["parent_id"]
                        isOneToOne: false
                        referencedRelation: "comments"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "fk_comments_post"
                        columns: ["post_id"]
                        isOneToOne: false
                        referencedRelation: "posts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "fk_comments_profile"
                        columns: ["profile_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            posts: {
                Row: {
                    author_id: string
                    comments: number
                    content: string
                    cover_image: string | null
                    created_at: string
                    excerpt: string | null
                    id: string
                    language: string
                    likes: number
                    published_at: string | null
                    search_vector: unknown | null
                    slug: string
                    status: Database["public"]["Enums"]["post_status"]
                    tags: string[] | null
                    title: string
                    updated_at: string
                    views: number
                }
                Insert: {
                    author_id: string
                    comments?: number
                    content: string
                    cover_image?: string | null
                    created_at?: string
                    excerpt?: string | null
                    id?: string
                    language?: string
                    likes?: number
                    published_at?: string | null
                    search_vector?: unknown | null
                    slug: string
                    status?: Database["public"]["Enums"]["post_status"]
                    tags?: string[] | null
                    title: string
                    updated_at?: string
                    views?: number
                }
                Update: {
                    author_id?: string
                    comments?: number
                    content?: string
                    cover_image?: string | null
                    created_at?: string
                    excerpt?: string | null
                    id?: string
                    language?: string
                    likes?: number
                    published_at?: string | null
                    search_vector?: unknown | null
                    slug?: string
                    status?: Database["public"]["Enums"]["post_status"]
                    tags?: string[] | null
                    title?: string
                    updated_at?: string
                    views?: number
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    full_name: string | null
                    github: string | null
                    id: string
                    location: string | null
                    updated_at: string | null
                    username: string | null
                    website: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    full_name?: string | null
                    github?: string | null
                    id: string
                    location?: string | null
                    updated_at?: string | null
                    username?: string | null
                    website?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    full_name?: string | null
                    github?: string | null
                    id?: string
                    location?: string | null
                    updated_at?: string | null
                    username?: string | null
                    website?: string | null
                }
                Relationships: []
            }
            reactions: {
                Row: {
                    created_at: string
                    id: string
                    post_id: string
                    profile_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    post_id: string
                    profile_id: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    post_id?: string
                    profile_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "fk_post"
                        columns: ["post_id"]
                        isOneToOne: false
                        referencedRelation: "posts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "fk_user"
                        columns: ["profile_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            views: {
                Row: {
                    country: string | null
                    created_at: string | null
                    id: string
                    post_id: string | null
                    read_percentage: number | null
                    referrer: string
                    session_id: string | null
                    user_agent: Json | null
                    user_id: string | null
                    view_time: number | null
                }
                Insert: {
                    country?: string | null
                    created_at?: string | null
                    id?: string
                    post_id?: string | null
                    read_percentage?: number | null
                    referrer?: string
                    session_id?: string | null
                    user_agent?: Json | null
                    user_id?: string | null
                    view_time?: number | null
                }
                Update: {
                    country?: string | null
                    created_at?: string | null
                    id?: string
                    post_id?: string | null
                    read_percentage?: number | null
                    referrer?: string
                    session_id?: string | null
                    user_agent?: Json | null
                    user_id?: string | null
                    view_time?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "views_post_id_fkey"
                        columns: ["post_id"]
                        isOneToOne: false
                        referencedRelation: "posts"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            adjust_comment_count: {
                Args: {
                    post_id: string
                    increment: boolean
                }
                Returns: undefined
            }
            get_country_views: {
                Args: {
                    post_id?: string
                }
                Returns: {
                    country: string
                    views: number
                    code: string
                }[]
            }
            get_discovery_posts: {
                Args: {
                    page?: number
                    post_limit?: number
                    filter_tag?: string
                }
                Returns: {
                    id: string
                    title: string
                    slug: string
                    excerpt: string
                    published_at: string
                    views: number
                    likes: number
                    comments: number
                    author_full_name: string
                    author_avatar_url: string
                    tags: string[]
                    cover_image: string
                    score: number
                }[]
            }
            get_trending_topics: {
                Args: {
                    tag_limit: number
                }
                Returns: {
                    topic_name: string
                    posts_count: number
                    score: number
                }[]
            }
            get_views_by_country: {
                Args: Record<PropertyKey, never>
                Returns: {
                    country: string
                    count: number
                }[]
            }
            get_views_over_time: {
                Args: {
                    article_id_param: string
                    time_interval: string
                }
                Returns: {
                    time_period: string
                    views_count: number
                }[]
            }
            increment_post_views: {
                Args: {
                    post_id: string
                }
                Returns: undefined
            }
            search_posts: {
                Args: {
                    query: string
                }
                Returns: {
                    id: string
                    title: string
                    slug: string
                    excerpt: string
                    content: string
                    status: Database["public"]["Enums"]["post_status"]
                    published_at: string
                    created_at: string
                    updated_at: string
                    author_id: string
                    views: number
                    likes: number
                    comments: number
                    language: string
                    cover_image: string
                    full_name: string
                }[]
            }
            sum_user_activity: {
                Args: {
                    user_id: string
                }
                Returns: {
                    views: number
                    reactions: number
                    comments: number
                }[]
            }
            toggle_post_like: {
                Args: {
                    post_id: string
                }
                Returns: boolean
            }
        }
        Enums: {
            post_status: "draft" | "published" | "archived"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
