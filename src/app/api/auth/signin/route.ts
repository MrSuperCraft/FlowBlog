import { createClient } from "@/shared/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    let email: string | undefined;
    let password: string | undefined;
    let provider: string | undefined;

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      email = body.email;
      password = body.password;
      provider = body.provider;
    } else {
      const formData = await request.formData();
      email = formData.get("email")?.toString();
      password = formData.get("password")?.toString();
      provider = formData.get("provider")?.toString();
    }

    // Handle Google OAuth sign-in
    if (provider === "google") {
      const supabase = createClient(cookies());
      const redirectTo =
        process.env.NODE_ENV === "production"
          ? "https://your-production-domain.com/api/auth/callback"
          : "http://localhost:3000/api/auth/callback";

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error || !data.url) {
        return NextResponse.json(
          { error: error?.message || "OAuth failed" },
          { status: 500 }
        );
      }

      return NextResponse.redirect(data.url, { status: 302 });
    }

    // Validate required fields for email/password sign-in
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = createClient(cookies());
    // Note: signInWithPassword returns an object with both data and error.
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data) {
      console.log("Sign-in failed:", error?.message || "No session returned");
      return NextResponse.json(
        { error: error?.message || "Invalid credentials" },
        { status: 401 }
      );
    }


    // Create a response that redirects the user to the dashboard.
    const response = NextResponse.redirect(new URL("/dashboard", request.url));

    return response;
  } catch (err) {
    console.error("Internal server error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
