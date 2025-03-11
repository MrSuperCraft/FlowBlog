"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogIn } from "lucide-react"
import Link from "next/link"

interface LoginCTADropdownProps {
    children: React.ReactNode
    className?: string
}

export function LoginCTADropdown({ children, className }: LoginCTADropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className={className}>{children}</div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuItem asChild>
                    <Link href="/sign-in" className="w-full">
                        <Button variant="ghost" className="w-full justify-start">
                            <LogIn className="mr-2 h-4 w-4" />
                            Log in to comment
                        </Button>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

