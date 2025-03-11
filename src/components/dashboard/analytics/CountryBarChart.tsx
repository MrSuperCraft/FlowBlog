"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { getCountryViews } from "@/actions/analytics"; // Import your Supabase fetching function
import { ViewTimeRangeOptions } from "@/shared/types";
import ReactCountryFlag from "react-country-flag"
import { Flag } from "lucide-react";

export interface CountryViewsData {
    country: string;
    views: number;
    code: string;
}

const chartConfig: ChartConfig = {
    views: {
        label: "Views",
        theme: {
            light: "#2563eb",
            dark: "#dc2626",
        },
    },
};

interface CountryViewsChartProps {
    title?: string;
    showTopCountries?: boolean;
    maxCountries?: number;
    timeRange?: ViewTimeRangeOptions;
}

export default function CountryViewsChart({
    title,
    showTopCountries = true,
    maxCountries = 10,
    timeRange = "24h",
}: CountryViewsChartProps) {
    const [data, setData] = useState<CountryViewsData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            const post_id = window.location.pathname.split('/').pop()!;
            try {
                setLoading(true);
                // Call the Supabase function using the provided timeRange.
                const countryViews = await getCountryViews(post_id, timeRange);
                setData(countryViews);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                setError(err.message || "Error fetching data");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [timeRange]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Sort data by views in descending order
    const sortedData = [...data].sort((a, b) => b.views - a.views);

    // Limit the number of countries to display in the chart
    const displayData = sortedData.slice(0, maxCountries);

    // Calculate the total views for percentage calculation
    const totalViews = sortedData.reduce((sum, item) => sum + item.views, 0);

    // Add percentage to each country for additional info (if needed)
    const dataWithPercentage = displayData.map(item => ({
        ...item,
        percentage: Math.round((item.views / totalViews) * 100),
    }));

    // Format large numbers with a "k" suffix when needed
    const formatNumber = (value: number) => {
        return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
    };

    return (
        <div className="w-full space-y-2">
            {title && <h2 className="text-lg font-bold">{title}</h2>}
            <ChartContainer config={chartConfig} className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={dataWithPercentage}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid horizontal strokeDasharray={"5 5"} />
                        <YAxis
                            dataKey="country"
                            type="category"
                            width={100}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                        />
                        <XAxis
                            type="number"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                            tickFormatter={formatNumber}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey="views" fill="var(--color-views)" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>

            {showTopCountries && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
                    {sortedData.slice(0, 5).map((country) => (
                        <div
                            key={country.code}
                            className="flex flex-col p-3 rounded-lg bg-muted/30 transition-colors hover:bg-muted/50"
                        >
                            <div className="flex items-center gap-1.5 mb-1">
                                {country.code === "Unknown" ? (
                                    <Flag className="h-3.5 w-3.5 text-muted-foreground" />
                                ) : (
                                    <ReactCountryFlag
                                        countryCode={country.code}
                                        className="h-3.5 w-3.5 text-muted-foreground"
                                        svg
                                    />
                                )}
                                <div className="text-sm font-medium truncate">{country.country}</div>
                            </div>
                            <div className="text-2xl font-bold">{formatNumber(country.views)}</div>
                            <div className="text-xs text-muted-foreground">
                                {Math.round((country.views / totalViews) * 100)}% of total views
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
