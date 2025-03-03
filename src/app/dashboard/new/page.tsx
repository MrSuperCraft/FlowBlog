import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { CreateNewPostPage } from '@/components/dashboard/posts/CreateNewPostPage'
import { SidebarProvider } from '@/shared/context/SidebarContext'
import React from 'react'

const page = () => {
    return (
        <SidebarProvider>
            <DashboardLayout>
                <CreateNewPostPage />
            </DashboardLayout>
        </SidebarProvider>
    )
}

export default page
