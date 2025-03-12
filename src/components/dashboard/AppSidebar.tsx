"use client";

import React from "react";
import { useSidebar } from "@/shared/context/SidebarContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ChevronDown, Home, User, List, Settings, PieChart } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/shared/context/UserContext";

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};


const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, openSubmenu, toggleMobileSidebar, toggleSubmenu } =
        useSidebar();
    const pathname = usePathname();
    const { profile } = useUser()
    const fullName = profile?.full_name as string;


    const navItems: NavItem[] = [
        { icon: <Home className="h-5 w-5" />, name: "Home", path: "/dashboard" },
        { icon: <User className="h-5 w-5" />, name: "Profile", path: `${fullName}` },
        {
            icon: <List className="h-5 w-5" />,
            name: "Posts",
            subItems: [
                { name: "All Posts", path: "/dashboard" },
                { name: "New Post", path: "/dashboard/new" },
            ],
        },
        { icon: <PieChart className="h-5 w-5" />, name: "Analytics", path: "/dashboard/analytics" },
        { icon: <Settings className="h-5 w-5" />, name: "Settings", path: "/dashboard/settings" },
    ];




    // Render menu items
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
                                    !isExpanded && "h-10 w-full justify-center p-0"
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
                                            <Link
                                                href={subItem.path}
                                                className={cn(
                                                    "block p-2 rounded-md transition-colors",
                                                    pathname === subItem.path ? "text-blue-500" : "hover:bg-muted"
                                                )}
                                            >
                                                {subItem.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    ) : (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.path!}
                                        className={cn(
                                            "flex items-center p-2 rounded-md transition-colors",
                                            pathname === item.path ? "bg-primary/5 text-blue-500" : "hover:bg-muted",
                                            !isExpanded && "h-10 w-full justify-center p-0"
                                        )}
                                    >
                                        {item.icon}
                                        {isExpanded && <span className="ml-3">{item.name}</span>}
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">{item.name}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </li>
            ))}
        </ul>
    );

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
                </nav>
            </ScrollArea>
        </>
    );

    return (
        <>
            {/* Mobile Sidebar: visible only on small screens */}
            <div className="md:hidden">
                <Sheet open={isMobileOpen} onOpenChange={toggleMobileSidebar}>
                    <SheetContent side="left" className="p-0 w-64">
                        {sidebarContent}
                    </SheetContent>
                </Sheet>
            </div>
            {/* Desktop Sidebar: visible only on medium and larger screens */}
            <aside
                className={cn(
                    "hidden md:block md:fixed md:top-0 md:left-0 md:z-30 md:h-screen md:transition-all md:duration-300 md:ease-in-out md:bg-background md:border-r",
                    isExpanded ? "md:w-64" : "md:w-16 md:pt-4"
                )}
            >
                {sidebarContent}
            </aside>
        </>
    );
};

export default AppSidebar;
