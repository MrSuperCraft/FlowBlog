"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export function DashboardContent() {
    const [blogs, setBlogs] = useState([
        { id: 1, title: "My First Blog Post", content: "This is the content of my first blog post." },
        { id: 2, title: "Another Great Post", content: "Here's another amazing blog post." },
    ])

    const [newBlog, setNewBlog] = useState({ title: "", content: "" })
    const [editingBlog, setEditingBlog] = useState<{ id: number; title: string; content: string } | null>(null)

    const handleCreateBlog = () => {
        setBlogs([...blogs, { id: blogs.length + 1, ...newBlog }])
        setNewBlog({ title: "", content: "" })
    }

    const handleUpdateBlog = () => {
        if (editingBlog) {
            setBlogs(blogs.map((blog) => (blog.id === editingBlog.id ? editingBlog : blog)))
            setEditingBlog(null)
        }
    }

    const handleDeleteBlog = (id: number) => {
        setBlogs(blogs.filter((blog) => blog.id !== id))
    }

    return (
        <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4 w-full">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{blogs.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,234</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Comments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">56</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">123</div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {blogs.map((blog) => (
                        <Card key={blog.id}>
                            <CardHeader>
                                <CardTitle>{blog.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="line-clamp-3">{blog.content}</p>
                                <div className="mt-4 flex justify-end space-x-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" onClick={() => setEditingBlog(blog)}>
                                                Edit
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Edit Blog Post</DialogTitle>
                                                <DialogDescription>Make changes to your blog post here.</DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="title">Title</Label>
                                                    <Input
                                                        id="title"
                                                        value={editingBlog?.title || ""}
                                                        onChange={(e) =>
                                                            setEditingBlog((prev) => (prev ? { ...prev, title: e.target.value } : null))
                                                        }
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="content">Content</Label>
                                                    <Textarea
                                                        id="content"
                                                        value={editingBlog?.content || ""}
                                                        onChange={(e) =>
                                                            setEditingBlog((prev) => (prev ? { ...prev, content: e.target.value } : null))
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <Button onClick={handleUpdateBlog}>Save Changes</Button>
                                        </DialogContent>
                                    </Dialog>
                                    <Button variant="destructive" onClick={() => handleDeleteBlog(blog.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
                <h2 className="text-2xl font-bold">Analytics</h2>
                <p>Analytics content goes here.</p>
            </TabsContent>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Create New Blog</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Blog Post</DialogTitle>
                        <DialogDescription>Create a new blog post here.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="new-title">Title</Label>
                            <Input
                                id="new-title"
                                value={newBlog.title}
                                onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="new-content">Content</Label>
                            <Textarea
                                id="new-content"
                                value={newBlog.content}
                                onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                            />
                        </div>
                    </div>
                    <Button onClick={handleCreateBlog}>Create Blog</Button>
                </DialogContent>
            </Dialog>
        </Tabs>
    )
}

