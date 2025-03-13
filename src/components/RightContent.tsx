'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarWrapper, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabaseClient } from "@/shared/lib/supabase/client";
import Link from "next/link";
import { getSuggestedAuthors } from "@/actions/post";

interface Topic {
  topic_name: string;
  posts_count: number;
  score: number;
}

interface SuggestedAuthor {
  id: string;
  full_name: string;
  avatar_url: string;
}

export default function RightContent() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [suggestedAuthors, setSuggestedAuthors] = useState<SuggestedAuthor[]>([])

  // Logic to fetch trending topics and suggested authors from Supabase function
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabaseClient
        .rpc('get_trending_topics', { tag_limit: 5 });

      // Handle errors and data logging
      if (error) {
        console.error('Error fetching trending topics:', error);
        return;
      }

      if (data) {
        setTopics(data);
      }

      const authors = await getSuggestedAuthors();
      setSuggestedAuthors(authors);
    }

    fetchData();
  }, []); // This effect runs only once, on mount

  return (
    <div className="hidden lg:block pr-12 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Trending Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topics.length > 0 ? (
              topics.map((topic) => (
                <div
                  key={topic.topic_name}
                  className="flex items-center justify-between space-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-primary">#{topic.topic_name}</span>
                    <span className="text-xs text-gray-500 dark:text-neutral-300/80">({topic.posts_count.toLocaleString()} posts)</span>
                  </div>
                  <Link href={`/t/${topic.topic_name}`}>
                    <Button variant="outline" size="sm" className="text-gray-700 dark:text-primary">
                      View More
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Loading trending topics...</p>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Suggested Authors</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {suggestedAuthors.map((author) => (
              <li key={author.id}>
                <Link href={`/${author.full_name}`} className="flex items-center space-x-2">
                  <AvatarWrapper>
                    <AvatarImage src={author.avatar_url} alt={author.full_name} />
                    <AvatarFallback>{author.full_name[0]}</AvatarFallback>
                  </AvatarWrapper>
                  <span className="text-sm font-medium">{author.full_name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
