import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown, MessageSquarePlus } from "lucide-react"
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table"
import type { Post } from "@/shared/types"
import Link from "next/link"

const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date)

interface PostsTableProps {
    data: Post[] | null
}

export function PostsTable({ data }: PostsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])

    // Action handlers (replace these with your actual logic)
    const handleDelete = (postId: string) => {
        console.log("Deleting post:", postId)
        // e.g. call your API, update state, etc.
    }

    const handleRename = (postId: string) => {
        console.log("Renaming post:", postId)
        // e.g. open a modal to enter a new title
    }

    // Define columns including an "Actions" column.
    const columns: ColumnDef<Post>[] = [
        {
            accessorKey: "title",
            header: "Title",
        },
        {
            accessorKey: "publishedAt",
            header: "Published",
            cell: ({ row }) => {
                const date = row.getValue("publishedAt") as Date | null
                return date ? formatDate(date) : "Draft"
            },
        },
        {
            accessorKey: "views",
            header: "Views",
        },
        {
            accessorKey: "likes",
            header: "Likes",
        },
        {
            accessorKey: "comments",
            header: "Comments",
        },
        {
            id: "actions",
            header: "Actions",
            // Prevent the actions column from being hidden
            enableHiding: false,
            cell: ({ row }) => {
                const post = row.original
                return (
                    <div className="flex space-x-2">
                        <Link href={`/dashboard/edit/${post.id}`}>
                            <Button variant="outline" size="sm">Edit</Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRename(post.id)}
                        >
                            Rename
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(post.id)}
                        >
                            Delete
                        </Button>
                    </div>
                )
            },
        },
    ]

    const table = useReactTable({
        data: data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    })

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <div>
                    <h3 className="text-2xl font-medium">Posts</h3>
                </div>
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard/new">
                        <Button variant="default" iconBefore={<MessageSquarePlus />}>
                            Create Post
                        </Button>
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronsUpDown className="ml-2 h-4 w-4" />
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
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <p className="text-lg font-medium">No posts available</p>
                                        <p className="text-sm text-gray-500">
                                            Create a new post to get started.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
