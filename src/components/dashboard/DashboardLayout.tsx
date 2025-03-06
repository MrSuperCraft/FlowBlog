"use client"

import type React from "react"
import { SidebarProvider, useSidebar } from "@/shared/context/SidebarContext"
import AppHeader from "./AppHeader"
import AppSidebar from "./AppSidebar"

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { isExpanded, isMobileOpen } = useSidebar()

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <AppSidebar />

            {/* Main Content Area */}
            <div
                className={`
          flex-1 transition-all duration-300 ease-in-out
          ${isMobileOpen ? "ml-0" : ""}
          ${isExpanded ? "md:pl-64" : "md:pl-20"}
        `}
            >
                {/* Header */}
                <AppHeader />
                {/* Page Content */}
                <div className="p-4 mx-auto max-w-screen-2xl md:p-6">{children}</div>
            </div>
        </div>
    )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <DashboardContent>{children}</DashboardContent>
        </SidebarProvider>
    )
}

