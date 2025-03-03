'use client';


import type React from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Home, PenTool, BarChart, Settings, X } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function Sidebar({ className, open, onOpenChange }: SidebarProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-[240px] p-0">
                <div className="flex h-full flex-col">
                    <div className="flex h-14 items-center border-b px-2 lg:h-[60px]">
                        <a href="/" className="flex items-center gap-2 font-semibold">
                            <PenTool className="h-6 w-6" />
                            <span>BlogFlow</span>
                        </a>
                        <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={() => onOpenChange(false)}>
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close sidebar</span>
                        </Button>
                    </div>
                    <ScrollArea className="flex-1">
                        <nav className="grid gap-1 p-2">
                            <a
                                href="#"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                            >
                                <Home className="h-4 w-4" />
                                Dashboard
                            </a>
                            <a
                                href="#"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                            >
                                <PenTool className="h-4 w-4" />
                                Write
                            </a>
                            <a
                                href="#"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                            >
                                <BarChart className="h-4 w-4" />
                                Analytics
                            </a>
                            <a
                                href="#"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                            >
                                <Settings className="h-4 w-4" />
                                Settings
                            </a>
                        </nav>
                    </ScrollArea>
                </div>
            </SheetContent>
        </Sheet>
    )
}

