'use client';

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { groupDataByInterval } from "@/actions/analytics";
import { ViewTimeRangeOptions } from "@/shared/types";
import { supabaseClient } from "@/shared/lib/supabase/client";
import { parseISO, format } from "date-fns";
import { EyeIcon, TrendingUp } from "lucide-react";

const chartConfig = {
    views: {
        label: "Views",
        icon: EyeIcon,
        // OR a theme object with 'light' and 'dark' keys
        theme: {
            light: "#2563eb",
            dark: "#dc2626",
        },
    }
} satisfies ChartConfig

const ViewsOverTime = () => {
    const [timeRange, setTimeRange] = useState<ViewTimeRangeOptions>("7d");
    const [viewsData, setViewsData] = useState<{ time_period: string; views_count: number }[]>([]);
    const articleId = window.location.pathname.split("/").pop()!;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Calculate milliseconds to subtract based on time range
                let millisecondsToSubtract: number;
                switch (timeRange) {
                    case "24h":
                        millisecondsToSubtract = 24 * 60 * 60 * 1000;
                        break;
                    case "7d":
                        millisecondsToSubtract = 7 * 24 * 60 * 60 * 1000;
                        break;
                    case "30d":
                        millisecondsToSubtract = 30 * 24 * 60 * 60 * 1000;
                        break;
                    case "90d":
                        millisecondsToSubtract = 90 * 24 * 60 * 60 * 1000;
                        break;
                    default:
                        millisecondsToSubtract = 7 * 24 * 60 * 60 * 1000;
                }

                const cutoff = new Date(Date.now() - millisecondsToSubtract).toISOString();

                const { data, error } = await supabaseClient
                    .from("views")
                    .select("created_at")
                    .eq("post_id", articleId)
                    .gte("created_at", cutoff)
                    .order("created_at", { ascending: true });

                if (error) {
                    throw new Error(error.message);
                }

                // Group the raw data based on the selected timeRange
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const grouped = groupDataByInterval(data as any[], timeRange);
                console.log("Grouped data:", grouped);
                setViewsData(grouped);
            } catch (error) {
                console.error("Error fetching views data:", error);
            }
        };

        fetchData();
    }, [articleId, timeRange]);

    // Use date-fns to format the date.
    const formatDate = (dateString: string) => {
        try {
            const date = parseISO(dateString);
            // For 24h, show hour format (e.g., "6PM"), else show "Mar 6"
            return timeRange === "24h" ? format(date, "ha") : format(date, "MMM d");
        } catch (error) {
            console.error("Invalid date:", dateString, error);
            return "Invalid Date";
        }
    };

    // Optionally, further filter the grouped data based on timeRange.
    // In this example, grouping already respects the cutoff.
    const filteredData = viewsData;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle>Views Over Time</CardTitle>
                    <CardDescription>
                        Total views: {viewsData.reduce((sum, item) => sum + item.views_count, 0)}
                    </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
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
            </CardHeader>
            <CardContent className="pt-4">
                <ChartContainer
                    config={chartConfig}
                    className="h-[300px] w-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={filteredData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="time_period"
                                tickFormatter={formatDate}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                            />
                            <YAxis tickLine={false} axisLine={false} width={40} />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar
                                dataKey="views_count"
                                fill="var(--color-views)"
                                radius={[4, 4, 0, 0]}
                                barSize={timeRange === "24h" ? 30 : timeRange === "7d" ? 20 : 10}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total visitors for the selected period
                </div>
            </CardFooter>
        </Card>
    );
};

export default ViewsOverTime;
