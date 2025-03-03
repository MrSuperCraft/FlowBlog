import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { Toaster } from "sonner";
import { UserProvider } from "@/shared/context/UserContext";

export const dynamic = "force-dynamic";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                themes={["light", "dark"]}
            >
                <UserProvider>
                    <div className="flex min-h-screen flex-col">
                        <main className="flex-1">{children}</main>
                    </div>
                    <Toaster />
                </UserProvider>
            </ThemeProvider>
        </section>
    );
}
