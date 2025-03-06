import { Database as DB, Tables, TablesInsert, TablesUpdate } from "./dbtypes";

export type Database = DB;
export type BlogPost = Tables<"posts">;
export type BlogPostFromFeed = Pick<BlogPost, "id" | "title" | "slug" | "excerpt" | "published_at" | "views" | "likes" | "tags"> & {
    author_full_name: string;
    author_avatar_url: string;
    comments: number;
    score: number;
};
export type Profile = Tables<"profiles">;


export type PostType = Tables<"posts">;
export type PostStatus = 'draft' | 'published' | 'archived';
export type PostInsert = TablesInsert<"posts">;
export type PostUpdate = TablesUpdate<"posts">;
export type ProfileUpdate = TablesUpdate<"profiles">;
export type Reaction = Tables<"reactions">;
export type ReactionInsert = TablesInsert<"reactions">;
export type Comment = Tables<"comments">;
export type CommentInsert = TablesInsert<"comments">;
export type View = Tables<"views">;
export type ViewTimeRangeOptions = '24h' | '7d' | '30d' | '90d'

export interface Post {
    id: string
    title: string
    slug: string
    excerpt: string | null
    content: string
    status: PostStatus
    publishedAt: Date | null
    createdAt: Date
    updatedAt: Date
    authorId: string
    views: number
    likes: number
    comments: number
    language: string
}

export type PostSummaryMetrics = {
    totalReactions: number
    totalComments: number
    totalViews: number
}


