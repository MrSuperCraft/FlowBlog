'use client'



import { Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { SidebarProvider } from "@/shared/context/SidebarContext"
import ViewsOverTime from "@/components/dashboard/analytics/ViewsOverTime"
import ReferrersCard from "@/components/dashboard/analytics/ReferrersCard"
import CountryViewsChart from "@/components/dashboard/analytics/CountryBarChart"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { ViewTimeRangeOptions } from "@/shared/types"
import ActivityLog from "@/components/dashboard/analytics/ActivityLog"
import { supabaseClient } from "@/shared/lib/supabase/client"


function ArticleAnalytics() {
    const [timeRange, setTimeRange] = useState<ViewTimeRangeOptions>("7d");
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        async function getName() {
            const post_id = window.location.pathname.split('/').pop()!;
            const { data, error } = await supabaseClient.from('posts').select('title').eq('id', post_id).single();
            if (error) {
                console.error("Failed to fetch post title:", error);
                return;
            }
            setName(data?.title ?? "Untitled");
        }

        getName();
    }, []);



    return (
        <div className="py-6 space-y-8">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Article Analytics</h1>
                <p className="text-muted-foreground">
                    Detailed performance metrics for &quot;{name}&quot;
                </p>
            </div>
            <div className="flex items-center justify-end gap-4">
                <div className="flex gap-4 bg-neutral-100 dark:bg-neutral-900/90 px-2 lg:px-4 py-2 rounded-xl shadow-xs">
                    <Button variant={timeRange === "24h" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("24h")}>
                        24h
                    </Button>
                    <Button variant={timeRange === "7d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("7d")}>
                        7d
                    </Button>
                    <Button variant={timeRange === "30d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("30d")}>
                        30d
                    </Button>
                    <Button variant={timeRange === "90d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("90d")}>
                        90d
                    </Button>
                </div>

            </div>
            <div className="grid gap-6">
                {/* Views Chart */}
                <ViewsOverTime timeRange={timeRange} />

                {/* Referrers and Activity Log */}
                <div className="grid md:grid-cols-2 gap-6">
                    <ReferrersCard />

                    {/* Activity Log */}
                    <ActivityLog />
                </div>

                {/* World Map */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Geographic Distribution
                        </CardTitle>
                        <CardDescription>Views by country</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="">
                            {/* World Map Visualization */}
                            <div className="flex items-center justify-center">
                                <div className="w-full">
                                    <CountryViewsChart timeRange={timeRange} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}



export default function Page() {
    return (
        <>
            <SidebarProvider>
                <DashboardLayout>
                    <ArticleAnalytics />
                </DashboardLayout>
            </SidebarProvider>
        </>
    )
}