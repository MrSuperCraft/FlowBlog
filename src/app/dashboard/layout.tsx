import { ProtectedRoute } from "@/shared/providers/ProtectedRoute";
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
                <div className="flex min-h-screen flex-col">
                    <main className="flex-1">{children}</main>
                </div>
                <Toaster />
            </section>
        </ProtectedRoute>
    );
}
