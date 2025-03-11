"use client";


import { useSidebar } from "@/shared/context/SidebarContext";
import React, { useEffect, useRef } from "react";
import { LogOutIcon, SettingsIcon, User2Icon } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AvatarWrapper, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { logOut } from "@/shared/lib/supabase/helpers";
import { useUser } from "@/shared/context/UserContext";
import { useRouter } from "next/navigation";
import { ModeToggle } from "../ThemeToggle";

const AppHeader: React.FC = () => {
    const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { user, profile } = useUser();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "b") {
                event.preventDefault();
                inputRef.current?.focus();
            }
        };


        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleToggle = () => {
        if (window.innerWidth >= 768) {
            toggleSidebar();
        } else {
            toggleMobileSidebar();
        }
    };

    return (
        <header className="sticky top-0 flex w-full bg-white border-b border-neutral-200 z-10 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between flex-grow px-3 py-3 lg:px-6 lg:py-4">
                <button
                    className="flex items-center justify-center w-10 h-10 text-neutral-500 border border-neutral-200 rounded-lg dark:border-neutral-800 dark:text-neutral-400 lg:w-11 lg:h-11"
                    onClick={handleToggle}
                    aria-label="Toggle Sidebar"
                >
                    {/* Toggle icon changes based on isMobileOpen */}
                    {isMobileOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                                fill="currentColor"
                            />
                        </svg>
                    ) : (
                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                                fill="currentColor"
                            />
                        </svg>
                    )}
                </button>
                <div className="flex space-x-4 items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center justify-center w-10 h-10 cursor-pointer text-neutral-700 rounded-lg hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800">
                            <AvatarWrapper>
                                <AvatarImage height={40} width={40} src={profile ? profile.avatar_url : user?.user_metadata.avatar_url} />
                                <AvatarFallback>
                                    {(profile?.full_name as string)
                                        .split(' ')
                                        .map((n: string) => n[0])
                                        .join('')
                                        .substring(0, 2)}
                                </AvatarFallback>
                            </AvatarWrapper>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="max-w-lg bg-white dark:bg-neutral-800 shadow-lg rounded-lg">
                            <DropdownMenuItem className="flex flex-col items-start cursor-default">
                                <span className="font-semibold text-neutral-900 dark:text-neutral-200">{profile?.full_name}</span>
                                <span className="text-sm text-neutral-500 dark:text-neutral-400">{user?.email}</span>
                            </DropdownMenuItem>
                            <Separator className="my-1 h-0.5 rounded-full w-full bg-neutral-200 dark:bg-neutral-700" />
                            <DropdownMenuItem onClick={() => router.push(`/${profile?.full_name}`)} className="cursor-pointer flex items-center gap-2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                                <User2Icon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")} className="cursor-pointer flex items-center gap-2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                                <SettingsIcon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                                Settings
                            </DropdownMenuItem>
                            <Separator className="my-1 h-0.5 rounded-full w-full bg-neutral-200 dark:bg-neutral-700" />
                            <DropdownMenuItem
                                onClick={async () => await logOut()}
                                className="group p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                            >
                                <span className="flex items-center gap-2">
                                    <LogOutIcon className="w-4 h-4 text-neutral-500 dark:text-neutral-400 group-hover:text-red-600 transition-colors duration-200" />
                                    <span className="group-hover:text-red-600 transition-colors duration-200">Log Out</span>
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <ModeToggle />
                </div>

            </div>
        </header>
    );
};

export default AppHeader;
