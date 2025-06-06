"use client";

import { useEffect, useState } from "react";
import { Calendar, MessageSquare, ThumbsUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getActivityLog, ActivityItem } from "@/actions/analytics"; // Adjust import
import { getUserProfiles } from '@/actions/user';


export default function ActivityLog() {
    const [activityData, setActivityData] = useState<ActivityItem[]>([]);
    const [userProfiles, setUserProfiles] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Format timestamp for activity log
    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.round(diffMs / 60000);
        const diffHours = Math.round(diffMs / 3600000);
        const diffDays = Math.round(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
        return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    };

    useEffect(() => {
        async function fetchActivity() {
            try {
                const postId = window.location.pathname.split('/').pop()!;
                setLoading(true);
                const data = await getActivityLog(postId);
                setActivityData(data);

                const uniqueProfileIds = [...new Set(data.map((item) => item.profile_id))];

                // Fetch user profiles in one request
                const profiles: { id: string, full_name: string | null }[] = await getUserProfiles(uniqueProfileIds);

                // Map profile ID to full_name
                const profileMap = profiles.reduce((acc, profile) => {
                    acc[profile.id] = profile.full_name ?? "Unknown User";
                    return acc;
                }, {} as Record<string, string>);

                setUserProfiles(profileMap);
            } catch {
                setError("Failed to fetch activity log.");
            } finally {
                setLoading(false);
            }
        }
        fetchActivity();
    }, []);


    return (
        <Card className="h-full">
            <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                    Recent Activity
                </CardTitle>
                <CardDescription className="text-sm">Latest comments and reactions</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p className="text-muted-foreground text-sm">Loading activity...</p>
                ) : error ? (
                    <p className="text-red-500 text-sm">{error}</p>
                ) : activityData.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No recent activity.</p>
                ) : (
                    <div className="space-y-3 max-h-[300px] md:max-h-[400px] overflow-auto pr-2 scrollbar-thin">
                        {activityData.map((activity, index) => (
                            <div key={index} className="flex items-start gap-2 md:gap-3 pb-3 border-b last:border-0">
                                <div className="mt-1">
                                    {activity.type === "comment" ? (
                                        <MessageSquare className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-500" />
                                    ) : (
                                        <ThumbsUp className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-500" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-start gap-2">
                                        <p className="font-medium text-xs md:text-sm truncate">
                                            {userProfiles[activity.profile_id] || "Unknown User"}
                                        </p>
                                        <span className="text-[10px] md:text-xs text-muted-foreground whitespace-nowrap">
                                            {formatTimestamp(activity.created_at)}
                                        </span>
                                    </div>
                                    {activity.type === "comment" && "text" in activity && (
                                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                                            Commented: {activity.text}
                                        </p>
                                    )}
                                    {activity.type === "like" && (
                                        <p className="text-xs md:text-sm text-muted-foreground">
                                            Liked this article
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
