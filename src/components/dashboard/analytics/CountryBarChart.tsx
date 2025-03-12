"use client";

import { useEffect, useState, useMemo } from "react";
// import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
// import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { getCountryViews } from "@/actions/analytics";
import { ViewTimeRangeOptions } from "@/shared/types";
import ReactCountryFlag from "react-country-flag";
import { Flag } from "lucide-react";
import WorldMap from "@/components/ui/world-map";
import countryData from "@/shared/lib/countryMap.json"; // Assume JSON file is stored in /data

export interface CountryViewsData {
    country: string;
    views: number;
    code: string;
}

// const chartConfig: ChartConfig = {
//     views: {
//         label: "Views",
//         theme: {
//             light: "#2563eb",
//             dark: "#dc2626",
//         },
//     },
// };

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
                const countryViews = await getCountryViews(post_id, timeRange);
                setData(countryViews);
            } catch (err) {
                if (err instanceof Error) setError(err.message || "Error fetching data");
                setError("Error Fetching Data");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [timeRange]);

    const { sortedData, displayData, totalViews } = useMemo(() => {
        const sortedData = [...data].sort((a, b) => b.views - a.views);
        const displayData = sortedData.slice(0, maxCountries);
        const totalViews = sortedData.reduce((sum, item) => sum + item.views, 0);
        return { sortedData, displayData, totalViews };
    }, [data, maxCountries]);

    const countryMap = useMemo(() => new Map(Object.entries(countryData)), []);

    const mapDots = useMemo(() => {
        return displayData
            .map(({ code, views }) => {
                const coords = countryMap.get(code);
                return coords ? {
                    start: { lat: coords[0], lng: coords[1], label: `${views} views` },
                    end: { lat: coords[0], lng: coords[1], label: `${views} views` }
                } : null;
            })
            .filter(Boolean) as { start: { lat: number; lng: number; label?: string }; end: { lat: number; lng: number; label?: string } }[];
    }, [displayData, countryMap]);

    const formatNumber = useMemo(() =>
        (value: number) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString()
        , []);
    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            <span className="ml-2">Loading...</span>
        </div>
    )
    if (error) return <div>Error: {error}</div>;


    return (
        <div className="w-full space-y-2">
            {title && <h2 className="text-lg font-bold">{title}</h2>}
            <WorldMap dots={mapDots} />
            {/* <ChartContainer config={chartConfig} className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataWithPercentage} layout="vertical">
                        <CartesianGrid horizontal strokeDasharray="5 5" />
                        <YAxis dataKey="country" type="category" width={100} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                        <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={formatNumber} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey="views" fill="var(--color-views)" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer> */}
            {showTopCountries && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
                    {sortedData.slice(0, 5).map(country => (
                        <div key={country.code} className="flex flex-col p-3 rounded-lg bg-muted/30 hover:bg-muted/50">
                            <div className="flex items-center gap-1.5 mb-1">
                                {country.code === "Unknown" ? (
                                    <Flag className="h-3.5 w-3.5 text-muted-foreground" />
                                ) : (
                                    <ReactCountryFlag countryCode={country.code} className="h-3.5 w-3.5 text-muted-foreground" svg />
                                )}
                                <div className="text-sm font-medium truncate">{country.country}</div>
                            </div>
                            <div className="text-2xl font-bold">{formatNumber(country.views)}</div>
                            <div className="text-xs text-muted-foreground">{Math.round((country.views / totalViews) * 100)}% of total views</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
