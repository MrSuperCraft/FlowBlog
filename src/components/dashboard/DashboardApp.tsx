"use client";

import { SidebarProvider } from "@/shared/context/SidebarContext";
import DashboardLayout from "./DashboardLayout";
import { Input } from "@/components/ui/input";
import type { Post, PostSummaryMetrics } from "@/shared/types";
import { useEffect, useState } from "react";
import { MetricsCards } from "./MetricsCards";
import { PostsTable } from "./PostsTable";
import { Search } from "lucide-react";
import { getPosts } from "@/actions/post";
// This would normally come from your database
const metrics: PostSummaryMetrics = {
  totalReactions: 165,
  totalComments: 53,
  totalViews: 23241,
};

const DashboardApp = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      const fetchedPosts = await getPosts();
      setPosts(
        fetchedPosts.map((post) => ({
          ...post,
          publishedAt: post.published_at ? new Date(post.published_at) : null,
          createdAt: new Date(post.created_at),
          updatedAt: new Date(post.updated_at),
          authorId: post.author_id,
        }))
      );
    }

    fetchPosts();
  }, []);

  const filteredPosts =
    posts &&
    posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <SidebarProvider>
      <DashboardLayout>
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl flex-1">
              Dashboard
            </h2>
            <Input
              iconBefore={<Search />}
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs hidden sm:block rounded-full overflow-hidden"
            />
          </div>
          <MetricsCards metrics={metrics} />
          <div className="space-y-4">
            <PostsTable data={filteredPosts} />
          </div>
        </div>
      </DashboardLayout>
    </SidebarProvider>
  );
};

export default DashboardApp;
