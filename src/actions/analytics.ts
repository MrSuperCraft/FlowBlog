


// Function to group data by interval (hour, day)
export const groupDataByInterval = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[],
    interval: '24h' | '7d' | '30d' | '90d'
): { time_period: string; views_count: number }[] => {
    const grouped: Record<string, number> = {};

    data.forEach((view) => {
        let timePeriod: string;
        const date = new Date(view.created_at);
        if (interval === '24h') {
            // Group by hour (e.g., "2025-03-06T18")
            timePeriod = date.toISOString().slice(0, 13);
        } else {
            // Group by day (e.g., "2025-03-06")
            timePeriod = date.toISOString().slice(0, 10);
        }

        grouped[timePeriod] = (grouped[timePeriod] || 0) + 1;
    });

    // Return the grouped data sorted by time_period ascending
    return Object.keys(grouped)
        .sort()
        .map((timePeriod) => ({
            time_period: timePeriod,
            views_count: grouped[timePeriod],
        }));
};
