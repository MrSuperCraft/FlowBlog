import { ProtectedRoute } from "@/shared/providers/ProtectedRoute";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { Toaster } from "sonner";
export const dynamic = "force-dynamic";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ProtectedRoute>
            <section>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                    themes={["light", "dark"]}
                >
                    <div className="flex min-h-screen flex-col">
                        <main className="flex-1">{children}</main>
                    </div>
                    <Toaster />
                </ThemeProvider>
            </section>
        </ProtectedRoute>
    );
}
