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
    const [timeRange, setTimeRange] = useState<ViewTimeRangeOptions>("7d")
    const [name, setName] = useState<string | null>(null)

    useEffect(() => {
        async function getName() {
            const post_id = window.location.pathname.split('/').pop()!
            const { data, error } = await supabaseClient
                .from('posts')
                .select('title')
                .eq('id', post_id)
                .single()
            if (error) {
                console.error("Failed to fetch post title:", error)
                return
            }
            setName(data?.title ?? "Untitled")
        }
        getName()
    }, [])

    return (
        <div className={`p-4 space-y-6 max-w-6xl mx-auto`}>
            {/* Header */}
            <div className="flex flex-col space-y-2">
                <h1 className="text-xl lg:text-3xl font-bold tracking-tight">Article Analytics</h1>
                <p className="text-sm lg:text-base text-muted-foreground">
                    Detailed performance metrics for &quot;{name}&quot;
                </p>
            </div>

            {/* Time Range Buttons */}
            <div className="flex items-center justify-end w-full">
                <div className="flex gap-2 bg-neutral-100 dark:bg-neutral-900/90 p-1 sm:p-1.5 rounded-lg shadow-xs overflow-x-auto">
                    <Button
                        className="text-xs md:text-base"
                        variant={timeRange === "24h" ? "default" : "outline"}
                        onClick={() => setTimeRange("24h")}
                    >
                        24h
                    </Button>
                    <Button
                        className="text-xs md:text-base"
                        variant={timeRange === "7d" ? "default" : "outline"}
                        onClick={() => setTimeRange("7d")}
                    >
                        7d
                    </Button>
                    <Button
                        className="text-xs md:text-base"
                        variant={timeRange === "30d" ? "default" : "outline"}
                        onClick={() => setTimeRange("30d")}
                    >
                        30d
                    </Button>
                    <Button
                        className="text-xs md:text-base"
                        variant={timeRange === "90d" ? "default" : "outline"}
                        onClick={() => setTimeRange("90d")}
                    >
                        90d
                    </Button>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 gap-6">
                {/* Row 1: Views Over Time (full width) */}
                <div>
                    <ViewsOverTime timeRange={timeRange} />
                </div>

                {/* Row 2: Referrers Card and Activity Log */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ReferrersCard />
                    <ActivityLog />
                </div>

                {/* Row 3: Country Views Chart */}
                <Card>
                    <CardHeader className="space-y-1 p-3 sm:p-4">
                        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                            <Globe className="h-4 w-4" />
                            Geographic Distribution
                        </CardTitle>
                        <CardDescription className="text-xs">Views by country</CardDescription>
                    </CardHeader>
                    <CardContent className="p-2 sm:p-4">
                        <div className="w-full min-h-[250px] md:min-h-[300px]">
                            <CountryViewsChart timeRange={timeRange} />
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div >
    )
}

export default function Page() {
    return (
        <SidebarProvider>
            <DashboardLayout>
                <ArticleAnalytics />
            </DashboardLayout>
        </SidebarProvider>
    )
}
