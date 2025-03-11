"use client"

import { useEffect, useState } from "react"
import ProfileForm from "@/components/dashboard/settings/ProfileForm"
import { getProfileFromId } from "@/actions/user"
import type { Profile } from "@/shared/types"
import { useUser } from "@/shared/context/UserContext"
import { SidebarProvider } from "@/shared/context/SidebarContext"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function SettingsPage() {
    const { user } = useUser()!
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) return
            try {
                setIsLoading(true)
                const data = (await getProfileFromId(user.id)) as Profile
                setProfile(data)
            } catch (error) {
                console.error("Error fetching profile:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [user?.id])

    return (
        <SidebarProvider>
            <DashboardLayout>
                <div className="container max-w-4xl py-10">
                    {isLoading ? (
                        <ProfileSkeleton />
                    ) : profile ? (
                        <ProfileForm initialProfile={profile} userEmail={user?.email || ""} />
                    ) : (
                        <div className="text-center p-8 bg-muted/30 rounded-lg">
                            <h3 className="text-lg font-medium">Profile Not Found</h3>
                            <p className="text-muted-foreground mt-2">
                                We couldn&apos;t load your profile information. Please try again later.
                            </p>
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </SidebarProvider>
    )
}

function ProfileSkeleton() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
            </div>

            <Card className="border-none shadow-md">
                <div className="p-6 space-y-8">
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                        <Skeleton className="h-32 w-32 rounded-full" />
                        <div className="space-y-2 w-full max-w-xs">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>

                    <Skeleton className="h-px w-full" />

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-3 w-40" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-3 w-40" />
                        </div>
                    </div>
                </div>
            </Card>

            <div className="flex justify-end gap-3">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    )
}