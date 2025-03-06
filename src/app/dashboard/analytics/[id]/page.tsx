import { Calendar, Globe, Link, MessageSquare, ThumbsUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { SidebarProvider } from "@/shared/context/SidebarContext"
import ViewsOverTime from "@/components/dashboard/analytics/ViewsOverTime"

const referrersData = [
    { source: "Google", count: 523, percentage: 42 },
    { source: "Twitter", count: 210, percentage: 17 },
    { source: "Direct", count: 185, percentage: 15 },
    { source: "Facebook", count: 147, percentage: 12 },
    { source: "LinkedIn", count: 98, percentage: 8 },
    { source: "Other", count: 76, percentage: 6 },
]

const activityData = [
    {
        type: "comment",
        user: "Sarah Johnson",
        content: "Great article! Very insightful.",
        timestamp: "2023-05-14T14:32:00Z",
    },
    { type: "like", user: "Michael Chen", timestamp: "2023-05-14T13:45:00Z" },
    {
        type: "comment",
        user: "Emma Williams",
        content: "I have a question about the third point...",
        timestamp: "2023-05-14T11:20:00Z",
    },
    { type: "like", user: "David Rodriguez", timestamp: "2023-05-14T10:15:00Z" },
    { type: "like", user: "Lisa Thompson", timestamp: "2023-05-14T09:30:00Z" },
    {
        type: "comment",
        user: "James Wilson",
        content: "This changed my perspective completely.",
        timestamp: "2023-05-13T22:10:00Z",
    },
    { type: "like", user: "Olivia Martinez", timestamp: "2023-05-13T20:45:00Z" },
    {
        type: "comment",
        user: "Robert Brown",
        content: "Could you elaborate more on this topic in a future article?",
        timestamp: "2023-05-13T18:22:00Z",
    },
]

const countryViewsData = [
    { country: "United States", views: 425, code: "US" },
    { country: "United Kingdom", views: 185, code: "GB" },
    { country: "Canada", views: 156, code: "CA" },
    { country: "Germany", views: 132, code: "DE" },
    { country: "France", views: 98, code: "FR" },
    { country: "Australia", views: 87, code: "AU" },
    { country: "Japan", views: 76, code: "JP" },
    { country: "India", views: 65, code: "IN" },
    { country: "Brazil", views: 54, code: "BR" },
    { country: "Mexico", views: 43, code: "MX" },
]

function ArticleAnalytics() {


    // Format timestamp for activity log
    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.round(diffMs / 60000)
        const diffHours = Math.round(diffMs / 3600000)
        const diffDays = Math.round(diffMs / 86400000)

        if (diffMins < 60) {
            return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
        } else {
            return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
        }
    }

    return (
        <div className="py-6 space-y-8">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Article Analytics</h1>
                <p className="text-muted-foreground">
                    Detailed performance metrics for &quot;How to Build Scalable Web Applications&quot;
                </p>
            </div>

            <div className="grid gap-6">
                {/* Views Chart */}
                <ViewsOverTime />

                {/* Referrers and Activity Log */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Referrers */}
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
                                {referrersData.map((referrer) => (
                                    <div key={referrer.source} className="flex items-center">
                                        <div className="w-1/3 font-medium">{referrer.source}</div>
                                        <div className="w-2/3 flex items-center gap-2">
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div className="bg-primary h-2 rounded-full" style={{ width: `${referrer.percentage}%` }} />
                                            </div>
                                            <span className="text-sm text-muted-foreground w-12">{referrer.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Log */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Recent Activity
                            </CardTitle>
                            <CardDescription>Latest comments and reactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 max-h-[300px] overflow-auto pr-2">
                                {activityData.map((activity, index) => (
                                    <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                                        <div className="mt-1">
                                            {activity.type === "comment" ? (
                                                <MessageSquare className="h-4 w-4 text-blue-500" />
                                            ) : (
                                                <ThumbsUp className="h-4 w-4 text-green-500" />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <p className="font-medium text-sm">{activity.user}</p>
                                                <span className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</span>
                                            </div>
                                            {activity.type === "comment" && activity.content && (
                                                <p className="text-sm text-muted-foreground">{activity.content}</p>
                                            )}
                                            {activity.type === "like" && <p className="text-sm text-muted-foreground">Liked this article</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
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
                        <div className="h-[400px] relative">
                            {/* World Map Visualization */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full max-w-3xl">
                                    <WorldMap countryData={countryViewsData} />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                            {countryViewsData.slice(0, 5).map((country) => (
                                <div key={country.code} className="flex flex-col">
                                    <div className="text-sm font-medium">{country.country}</div>
                                    <div className="text-2xl font-bold">{country.views}</div>
                                    <div className="text-xs text-muted-foreground">views</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// Simple World Map Component
function WorldMap({ countryData }: { countryData: { country: string; views: number; code: string }[] }) {
    return (
        <div className="relative w-full h-full bg-muted/20 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                    <p className="text-sm">World map visualization would render here with</p>
                    <p className="text-sm">markers for each country showing view counts</p>
                    <p className="mt-4 text-xs">
                        In a production environment, this would use a mapping library like react-simple-maps, mapbox-gl, or leaflet
                        to render an interactive world map with data points.
                        {countryData.toString()}
                    </p>
                </div>
            </div>

            {/* This is a placeholder. In a real implementation, you would use a proper mapping library */}
            <div className="absolute bottom-4 left-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-xs">High traffic</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary/60"></div>
                    <span className="text-xs">Medium traffic</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary/30"></div>
                    <span className="text-xs">Low traffic</span>
                </div>
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