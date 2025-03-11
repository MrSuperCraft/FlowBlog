import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserX } from "lucide-react"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                <UserX className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">User Not Found</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                We couldn&apos;t find the user you&apos;re looking for. The username may be misspelled or the user may have deleted their
                account.
            </p>
            <div className="flex gap-4">
                <Button asChild variant="outline">
                    <Link href="/">Go Home</Link>
                </Button>
                <Button asChild>
                    <Link href="/search">Search Users</Link>
                </Button>
            </div>
        </div>
    )
}

