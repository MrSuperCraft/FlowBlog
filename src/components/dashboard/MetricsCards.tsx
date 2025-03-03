import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp, MessageSquare, Eye } from "lucide-react"
import type { PostSummaryMetrics } from "@/types"

const formatNumber = (num: number) => new Intl.NumberFormat("en-US", { notation: "compact" }).format(num)

interface MetricsCardProps {
    title: string
    value: number
    icon: React.ComponentType<{ className?: string }>
}

function MetricsCard({ title, value, icon: Icon }: MetricsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-4">
                <div className="text-2xl font-bold">{formatNumber(value)}</div>
            </CardContent>
        </Card>
    )
}

export function MetricsCards({ metrics }: { metrics: PostSummaryMetrics }) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <MetricsCard title="Total Reactions" value={metrics.totalReactions} icon={ThumbsUp} />
            <MetricsCard title="Total Comments" value={metrics.totalComments} icon={MessageSquare} />
            <MetricsCard title="Total Views" value={metrics.totalViews} icon={Eye} />
        </div>
    )
}

