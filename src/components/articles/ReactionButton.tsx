"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HeartIcon, LogInIcon, UserPlusIcon } from "lucide-react";
import { useStore } from "@nanostores/react";
import { supabaseClient } from "@/shared/lib/supabase/client";
import { userStore } from "@/shared/context/UserContext";

type ReactionButtonProps = {
  postId: string;
  initialLikes: number;
  initiallyLiked: boolean;
};

const ReactionButton: React.FC<ReactionButtonProps> = ({
  postId,
  initialLikes,
  initiallyLiked,
}) => {
  const user = useStore(userStore).session?.user;
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initiallyLiked);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleReaction = async () => {
    if (!user) {
      setShowDropdown(true);
      return;
    }

    setLoading(true);
    try {
      if (!liked) {
        const { error } = await supabaseClient
          .from("reactions")
          .insert([{ post_id: postId, profile_id: user.id }]);
        if (error) throw error;
        setLikes((prev) => prev + 1);
        setLiked(true);
      } else {
        const { error } = await supabaseClient
          .from("reactions")
          .delete()
          .eq("post_id", postId)
          .eq("profile_id", user.id);
        if (error) throw error;
        setLikes((prev) => prev - 1);
        setLiked(false);
      }
    } catch (error) {
      console.error("Reaction error:", error);
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 hover:bg-muted/60 transition-colors"
            onClick={() => setShowDropdown(true)}
          >
            <HeartIcon className="h-4 w-4 text-muted-foreground" />
            <span>{likes}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64 p-2">
          <div className="px-2 py-3 text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-muted/30 p-2 rounded-full">
                <HeartIcon className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <h4 className="font-medium text-sm mb-1">Join the conversation</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Sign in to like posts and support the creators & authors you love
            </p>

            <div className="flex flex-col gap-2">
              <a href="/sign-in" className="w-full">
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  iconBefore={<LogInIcon className="h-4 w-4" />}
                >
                  Sign in
                </Button>
              </a>

              <a href="/sign-up" className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  iconBefore={<UserPlusIcon className="h-4 w-4" />}
                >
                  Create account
                </Button>
              </a>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center space-x-1"
      onClick={handleReaction}
      disabled={loading}
    >
      <HeartIcon
        className={`h-4 w-4 ${liked ? "text-red-500 fill-red-500" : ""}`}
      />
      <span>{likes}</span>
    </Button>
  );
};

export default ReactionButton;
