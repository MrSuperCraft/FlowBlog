import BlogFeed from "@/components/BlogFeed";
import { Header } from "@/components/Header";
import LandingSidebar from "@/components/LandingSidebar";
import RightContent from "@/components/RightContent";
import { ModeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";

export default async function Page({ params }: { params: Promise<{ tag: string }> }) {
    const { tag } = await params;
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="container z-40 bg-background">
                <div className="flex h-20 items-center justify-between py-6">
                    <Header>
                        <ModeToggle />
                    </Header>
                </div>
            </header>
            <main className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                <div className="hidden md:flex md:col-span-2 lg:col-span-1">
                    <LandingSidebar />
                </div>
                <div className="md:col-span-2">
                    {/* Tag Header Container */}
                    <div className="bg-muted border border-border rounded-lg shadow-sm p-6 relative">
                        {/* Accent Line */}
                        <div className="absolute top-0 left-0 w-full h-3 bg-primary rounded-t-lg" />

                        {/* Tag Title */}
                        <h1 className="text-lg md:text-xl lg:text-3xl font-semibold text-foreground">
                            Content Tagged With <span className="text-primary">#{tag}</span>
                        </h1>

                        <Separator className="w-full h-0.5 rounded-full my-4" />
                    </div>

                    <Separator className="w-full h-0.5 rounded-full my-4" />
                    <BlogFeed tag={tag} />
                </div>
                <div className="hidden lg:flex lg:col-span-1">
                    <RightContent />
                </div>
            </main>
        </div>
    );
}
