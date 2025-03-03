"use client"

import type React from "react"
import { useSidebar } from "@/shared/context/SidebarContext"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { ChevronDown, Home, User, List, Settings, PieChart, Box } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { usePathname } from "next/navigation"

type NavItem = {
    name: string
    icon: React.ReactNode
    path?: string
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[]
}

const navItems: NavItem[] = [
    { icon: <Home className="h-5 w-5" />, name: "Home", path: "/dashboard" },
    { icon: <User className="h-5 w-5" />, name: "Profile", path: "/profile" },
    {
        icon: <List className="h-5 w-5" />,
        name: "Posts",
        subItems: [
            { name: "All Posts", path: "/dashboard" },
            { name: "New Post", path: "/dashboard/new" },
            { name: "Categories", path: "/dashboard/categories" },
        ],
    },
    { icon: <Settings className="h-5 w-5" />, name: "Settings", path: "/settings" },
]

const othersItems: NavItem[] = [
    { icon: <PieChart className="h-5 w-5" />, name: "Analytics", path: "/analytics" },
    { icon: <Box className="h-5 w-5" />, name: "Media", path: "/media" },
]

const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, openSubmenu, toggleMobileSidebar, toggleSubmenu } =
        useSidebar()
    const pathname = usePathname();



    const renderMenuItems = (items: NavItem[]) => (
        <ul className="flex flex-col gap-1">
            {items.map((item) => (
                <li key={item.name}>
                    {item.subItems ? (
                        <>
                            <button
                                onClick={() => toggleSubmenu(item.name)}
                                className={cn(
                                    "flex items-center w-full p-2 rounded-md transition-colors",
                                    pathname === item.path ? "text-blue-500" : "hover:bg-muted",
                                    !isExpanded && "h-10 w-full justify-center px-auto p-0",
                                )}
                            >
                                {item.icon}
                                {isExpanded && (
                                    <>
                                        <span className="ml-3 flex-grow text-left">{item.name}</span>
                                        <ChevronDown
                                            className={cn("transition-transform", openSubmenu === item.name ? "rotate-180" : "")}
                                        />
                                    </>
                                )}
                            </button>
                            {openSubmenu === item.name && isExpanded && (
                                <ul className="mt-1 ml-4 space-y-1">
                                    {item.subItems.map((subItem) => (
                                        <li key={subItem.name}>
                                            <a
                                                href={subItem.path}
                                                className={cn(
                                                    "block p-2 rounded-md transition-colors",
                                                    pathname === subItem.path ? "text-blue-500" : "hover:bg-muted",
                                                )}
                                            >
                                                {subItem.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    ) : (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a
                                        href={item.path}
                                        className={cn(
                                            "flex items-center p-2 rounded-md transition-colors",
                                            pathname === item.path ? "bg-primary/5 text-blue-500" : "hover:bg-muted",
                                            !isExpanded && "h-10 w-full px-auto justify-center p-0",
                                        )}
                                    >
                                        {item.icon}
                                        {isExpanded && <span className="ml-3">{item.name}</span>}
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent side="right">{item.name}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </li>
            ))}
        </ul>
    )

    const sidebarContent = (
        <>
            <div className={cn("p-4 py-8", !isExpanded && "p-2")}>
                <h1 className={cn("font-bold", isExpanded ? "text-2xl" : "text-center text-xl")}>
                    {isExpanded ? "BlogFlow" : "B"}
                </h1>
            </div>
            <ScrollArea className="flex-1 py-4">
                <nav className={cn("px-2", !isExpanded && "px-0")}>
                    {renderMenuItems(navItems)}
                    <div className="my-4 h-px bg-border" />
                    {renderMenuItems(othersItems)}
                </nav>
            </ScrollArea>
        </>
    )

    if (typeof window !== "undefined" && window.innerWidth < 768) {
        return (
            <Sheet open={isMobileOpen} onOpenChange={toggleMobileSidebar}>
                <SheetContent side="left" className="p-0 w-64">
                    {sidebarContent}
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <aside
            className={cn(
                "fixed top-0 left-0 z-30 h-screen",
                "transition-all duration-300 ease-in-out",
                isExpanded ? "w-64" : "w-16 pt-4",
                "bg-background border-r",
            )}
        >
            {sidebarContent}
        </aside>
    )
}

export default AppSidebar

