/**
 * TODO: Improve responsiveness breakpoints for the profile header.
 * - Refer to the issue.
 * - Set to complete when done.
 */


import { Button } from "@/components/ui/button"
import { AvatarWrapper, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Calendar, LinkIcon, Github } from "lucide-react"

interface ProfileHeaderProps {
    user: {
        username: string
        name: string
        bio: string
        avatar: string
        location: string
        joinedDate: string
        website: string
        github: string
        pronouns: string
        stats: {
            posts: number
            comments: number
            followers: number
        }
    }
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
    return (
        <div className="relative">
            {/* Background banner */}
            <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/30" />
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="relative -mt-16 md:-mt-20 pb-6 grid gap-6">
                    {/* Header: AvatarWrapper, user info and follow button */}
                    <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left sm:pt-16">
                            <AvatarWrapper className="w-20 h-20 md:w-24 md:h-24 border-4 border-background">
                                <AvatarImage src={user.avatar} alt={user.username} />
                                <AvatarFallback>{user.username[0]}</AvatarFallback>
                            </AvatarWrapper>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold">{user.username}</h1>
                                <p className="text-sm md:text-base text-muted-foreground">{user.pronouns}</p>
                            </div>
                        </div>
                        <div className="mx-auto sm:mx-0">
                            <Button className="sm:mt-12">Follow</Button>
                        </div>
                    </div>

                    {/* Body: Bio, social links, and stats */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Left column: Bio and details */}
                        <div>
                            <p className="text-base md:text-lg">{user.bio}</p>
                            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                {user.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{user.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Joined {user.joinedDate}</span>
                                </div>
                                {user.website && (
                                    <a
                                        href={user.website}
                                        className="flex items-center gap-1 hover:text-primary"
                                    >
                                        <LinkIcon className="w-4 h-4" />
                                        <span>{user.website}</span>
                                    </a>
                                )}
                                {user.github && (
                                    <a
                                        href={user.github}
                                        className="flex items-center gap-1 hover:text-primary"
                                    >
                                        <Github className="w-4 h-4" />
                                        <span>GitHub</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Right column: Stats */}
                        <div className="flex items-center md:justify-end gap-6 text-sm">
                            <div className="flex flex-col items-center">
                                <span className="font-bold">{user.stats.posts}</span>
                                <span className="text-muted-foreground">Posts</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-bold">{user.stats.comments}</span>
                                <span className="text-muted-foreground">Comments</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-bold">{user.stats.followers}</span>
                                <span className="text-muted-foreground">Followers</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
