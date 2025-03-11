import { EditPostPage } from "@/components/dashboard/posts/EditPostPage"
import { getPost } from "@/actions/post"
import { SidebarProvider } from "@/shared/context/SidebarContext"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { PostType } from "@/shared/types"

interface EditPostProps {
    params: Promise<{ id: string }>
}

export default async function EditPost({ params }: EditPostProps) {
    const { id } = await params
    const post = await getPost(id)

    if (!post) {
        return <p>Post not found</p> // Handle empty post case
    }

    return (
        <SidebarProvider>
            <DashboardLayout>
                <EditPostPage postData={post as PostType} />
            </DashboardLayout>
        </SidebarProvider>
    )
}
