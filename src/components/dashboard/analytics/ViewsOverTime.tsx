'use client';

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
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
            dark: "#509ce7",
        },
    }
} satisfies ChartConfig

const ViewsOverTime = ({ timeRange = "7d" }: { timeRange: ViewTimeRangeOptions }) => {
    const [viewsData, setViewsData] = useState<{ time_period: string; views_count: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const articleId = window.location.pathname.split("/").pop()!;
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
                setViewsData(grouped);
            } catch (error) {
                console.error("Error fetching views data:", error);
            }
        };

        fetchData();
    }, [timeRange]);

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
            <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 pb-2">
                <div className="space-y-0.5">
                    <CardTitle className="text-base sm:text-lg">Views Over Time</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        Total views: {viewsData.reduce((sum, item) => sum + item.views_count, 0)}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="pt-2 sm:pt-4">
                <ChartContainer
                    config={chartConfig}
                    className="h-[200px] sm:h-[250px] lg:h-[300px] w-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={filteredData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="time_period"
                                tickFormatter={formatDate}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                fontSize={12}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                width={30}
                                fontSize={12}
                                tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar
                                dataKey="views_count"
                                fill="var(--color-views)"
                                radius={[4, 4, 0, 0]}
                                barSize={timeRange === "24h" ? 20 : timeRange === "7d" ? 15 : 8}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-1 text-xs sm:text-sm p-3 sm:p-4">
                <div className="flex gap-1.5 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-3.5 w-3.5" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total visitors for the selected period
                </div>
            </CardFooter>
        </Card>
    );
};

export default ViewsOverTime;
