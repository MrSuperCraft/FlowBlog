import BlogFeed from "@/components/BlogFeed";
import { Header } from "@/components/Header";
import LandingSidebar from "@/components/LandingSidebar";
import RightContent from "@/components/RightContent";
import { ModeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <Header>
            <ModeToggle />
          </Header>
        </div>
      </header>
      <main className="flex-grow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        <div className="hidden md:flex md:col-span-1">
          <LandingSidebar />
        </div>
        <div className="md:col-span-2">
          <BlogFeed />
        </div>
        <div className="hidden lg:flex lg:col-span-1">
          <RightContent />
        </div>
      </main>
    </div>
  );
}
