"use client"

import { useEffect, useState, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    ArrowUpDown,
    ChevronsUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Filter,
    MessageSquarePlus,
    MoreHorizontal,
    Pencil,
    Search,
    Trash2,
    Eye,
    AlertCircle,
    PencilLine,
} from "lucide-react"
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
    type ColumnFiltersState,
} from "@tanstack/react-table"
import type { Post } from "@/shared/types"
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { deletePost, updatePost } from "@/actions/post"
import { Skeleton } from "@/components/ui/skeleton"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Missing imports
import { Check } from "lucide-react"
import { useUser } from "@/shared/context/UserContext"

// Format date helper
const formatDate = (date: Date | string | null) => {
    if (!date) return "—"
    const dateObj = typeof date === "string" ? new Date(date) : date
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(dateObj)
}

// Truncate text helper
const truncateText = (text: string, maxLength: number) => {
    if (!text) return "—"
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}

// Status badge helper
const getStatusBadge = (status: string) => {
    switch (status) {
        case "published":
            return (
                <Badge variant="default" className="bg-emerald-600 dark:bg-emerald-500">
                    Published
                </Badge>
            )
        case "draft":
            return <Badge variant="outline">Draft</Badge>
        case "archived":
            return <Badge variant="secondary">Archived</Badge>
        default:
            return <Badge variant="outline">{status}</Badge>
    }
}

interface PostsTableProps {
    initialData: Post[] | []
    isLoading?: boolean
    onRefresh?: () => void
}

export function PostsTable({ initialData, isLoading = false, onRefresh }: PostsTableProps) {
    const [data, setData] = useState<Post[]>(initialData)
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [postToDelete, setPostToDelete] = useState<string | null>(null)
    const [quickEditPost, setQuickEditPost] = useState<Post | null>(null)
    const [quickEditTitle, setQuickEditTitle] = useState("")
    const [quickEditStatus, setQuickEditStatus] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { profile } = useUser();

    // Function to update local data
    const updateLocalData = useCallback((updatedPost: Post) => {
        setData((currentData) =>
            currentData.map((post) => (post.id === updatedPost.id ? { ...post, ...updatedPost } : post)),
        )
    }, [])

    // Update data when initialData changes
    useEffect(() => {
        setData(initialData)
    }, [initialData])

    // Reset quick edit form when post changes
    useEffect(() => {
        if (quickEditPost) {
            setQuickEditTitle(quickEditPost.title)
            setQuickEditStatus(quickEditPost.status)
        }
    }, [quickEditPost])

    // Handle delete post
    const handleDeletePost = async () => {
        if (!postToDelete) return

        try {
            setIsSubmitting(true)
            await deletePost(postToDelete)
            setData((currentData) => currentData.filter((post) => post.id !== postToDelete))
            setDeleteDialogOpen(false)
            setPostToDelete(null)
            if (onRefresh) onRefresh()
        } catch (error) {
            console.error("Error deleting post:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Handle quick edit save
    const handleQuickEditSave = async () => {
        if (!quickEditPost) return

        try {
            setIsSubmitting(true)

            // Ensure quickEditPost is valid before accessing id
            if (!quickEditPost.id) {
                throw new Error("quickEditPost has no ID")
            }

            const updatedPost = await updatePost(quickEditPost.id, {
                title: quickEditTitle,
                status: quickEditStatus as "published" | "draft" | "archived",
            })

            updateLocalData(updatedPost)
            setQuickEditPost(null)
            if (onRefresh) onRefresh()
        } catch (error) {
            console.error("Error updating post:", error)
        } finally {
            setIsSubmitting(false)
        }
    }


    // Define columns
    const columns: ColumnDef<Post>[] = [
        {
            accessorKey: "title",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent"
                    >
                        Title
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const title = row.getValue("title") as string
                const excerpt = row.original.excerpt || row.original.content

                return (
                    <div className="flex flex-col max-w-[300px]">
                        <span className="font-medium truncate">{title}</span>
                        {excerpt && <span className="text-xs text-muted-foreground line-clamp-1">{truncateText(excerpt, 60)}</span>}
                    </div>
                )
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => getStatusBadge(row.getValue("status") as string),
            enableHiding: true,
            filterFn: "equals",
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent whitespace-nowrap"
                    >
                        Created
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => formatDate(row.getValue("created_at") as string),
            enableHiding: true,
        },
        {
            accessorKey: "published_at",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent whitespace-nowrap"
                    >
                        Published
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => formatDate(row.getValue("published_at") as string),
            enableHiding: true,
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const post = row.original

                return (
                    <div className="flex items-center justify-end">
                        {/* Desktop view - show quick action buttons */}
                        <div className="hidden md:flex items-center gap-1">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={`/dashboard/edit/${post.id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>Edit</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={`/${profile?.full_name}/${post.slug}`} target="_blank">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only">View</span>
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>View</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        {/* Always show the dropdown menu for all actions */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                                <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/edit/${post.id}`} className="flex items-center px-3 py-2 cursor-pointer hover:bg-muted rounded-md transition-colors">
                                        <PencilLine className="mr-2 h-4 w-4 transition-transform group-hover:scale-105" />
                                        <span>Edit</span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => {
                                        setQuickEditPost(post);
                                    }}
                                    className="flex items-center px-3 py-2 cursor-pointer hover:bg-muted rounded-md transition-colors"
                                >
                                    <Pencil className="mr-2 h-4 w-4 transition-transform group-hover:scale-105" />
                                    <span>Quick Edit</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <Link href={`/${profile?.full_name}/${post.slug}`} target="_blank" className="flex items-center px-3 py-2 cursor-pointer hover:bg-muted rounded-md transition-colors">
                                        <Eye className="mr-2 h-4 w-4 transition-transform group-hover:scale-105" />
                                        <span>View</span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={() => {
                                        setPostToDelete(post.id);
                                        setDeleteDialogOpen(true);
                                    }}
                                    className="flex items-center px-3 py-2 cursor-pointer text-destructive hover:bg-destructive/10 rounded-md"
                                >
                                    <Trash2 className="mr-2 h-4 w-4 transition-transform text-destructive group-hover:scale-105" />
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        },
    ]

    // Create table instance
    const table = useReactTable({
        data: data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
    })

    // Get unique statuses for filter
    const statuses = data ? Array.from(new Set(data.map((post) => post.status))) : []

    return (
        <div className="space-y-4">
            {/* Header with title and add button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Posts</h2>
                    <p className="text-sm text-muted-foreground">Manage and organize your blog posts</p>
                </div>
                <Link href="/dashboard/new" className="sm:self-end">
                    <Button>
                        <MessageSquarePlus className="mr-2 h-4 w-4" />
                        Create Post
                    </Button>
                </Link>
            </div>

            {/* Filters and search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search posts..."
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-8 w-full"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {/* Status filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9">
                                <Filter className="mr-2 h-4 w-4" />
                                Status
                                <ChevronLeft className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuItem
                                onClick={() => table.getColumn("status")?.setFilterValue("")}
                                className="justify-between"
                            >
                                All Statuses
                                {!table.getColumn("status")?.getFilterValue() && <Check className="h-4 w-4" />}
                            </DropdownMenuItem>
                            {statuses.map((status) => (
                                <DropdownMenuItem
                                    key={status}
                                    onClick={() => table.getColumn("status")?.setFilterValue(status)}
                                    className="justify-between"
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                    {table.getColumn("status")?.getFilterValue() === status && <Check className="h-4 w-4" />}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Column visibility */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 ml-auto">
                                <ChevronsUpDown className="mr-2 h-4 w-4" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-accent">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="whitespace-nowrap">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Loading state
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={`loading-${index}`}>
                                    {columns.map((column, colIndex) => (
                                        <TableCell key={`loading-cell-${colIndex}`}>
                                            <Skeleton className="h-6 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : data === null || data.length === 0 ? (
                            // Empty state
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <div className="rounded-full bg-muted p-3">
                                            <AlertCircle className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-lg font-medium">No posts found</p>
                                        <p className="text-sm text-muted-foreground max-w-md">
                                            {globalFilter || Object.keys(columnFilters).length > 0
                                                ? "Try adjusting your search or filters"
                                                : "Create a new post to get started"}
                                        </p>
                                        {(globalFilter || Object.keys(columnFilters).length > 0) && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setGlobalFilter("")
                                                    setColumnFilters([])
                                                }}
                                            >
                                                Clear filters
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            // Data rows
                            table
                                .getRowModel()
                                .rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="group">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} post{table.getFilteredRowModel().rows.length !== 1 ? "s" : ""} total
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to last page</span>
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the post and remove it from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeletePost}
                            disabled={isSubmitting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isSubmitting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Quick Edit Dialog */}
            <Dialog open={!!quickEditPost} onOpenChange={(open) => !open && setQuickEditPost(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Quick Edit Post</DialogTitle>
                        <DialogDescription>
                            Make quick changes to your post. For full editing, use the Edit button.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="title" className="text-right text-sm font-medium">
                                Title
                            </label>
                            <div className="col-span-3 w-full">
                                <Input
                                    id="title"
                                    value={quickEditTitle}
                                    onChange={(e) => setQuickEditTitle(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="status" className="text-right text-sm font-medium">
                                Status
                            </label>
                            <Select value={quickEditStatus} onValueChange={setQuickEditStatus}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setQuickEditPost(null)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" onClick={handleQuickEditSave} disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

