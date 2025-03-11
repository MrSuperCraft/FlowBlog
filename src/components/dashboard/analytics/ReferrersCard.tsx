'use client';

import { useEffect, useState } from "react";
import { supabaseClient } from "@/shared/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "lucide-react";

type ReferrerData = {
    source: string;
    count: number;
    percentage: string;
};

export default function ReferrersCard() {
    const [referrersData, setReferrersData] = useState<ReferrerData[]>([]);

    useEffect(() => {
        const articleId = window.location.pathname.split('/').pop();
        if (!articleId) return;

        const fetchReferrers = async () => {
            const { data, error } = await supabaseClient
                .from("views")
                .select("referrer")
                .eq("post_id", articleId);

            console.log(data);

            if (error) {
                console.error("Error fetching referrers:", error);
                return;
            }

            const referrerCounts: Record<string, number> = {};
            data.forEach(({ referrer }) => {
                const key = referrer || "Direct";
                referrerCounts[key] = (referrerCounts[key] || 0) + 1;
            });

            const totalViews = Object.values(referrerCounts).reduce((sum, count) => sum + count, 0);
            const formattedData = Object.entries(referrerCounts).map(([source, count]) => ({
                source,
                count,
                percentage: ((count / totalViews) * 100).toFixed(1),
            }));

            setReferrersData(formattedData);
        };

        fetchReferrers();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    Referrers
                </CardTitle>
                <CardDescription>Traffic sources for this article</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {referrersData.map(({ source, count, percentage }) => (
                        <div key={source} className="flex items-center">
                            <div className="w-1/3 font-medium">{source}</div>
                            <div className="w-2/3 flex items-center gap-2">
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: `${percentage}%` }} />
                                </div>
                                <span className="text-sm text-muted-foreground w-12">{count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
