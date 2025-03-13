import { createClient } from "@/shared/lib/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const provider = formData.get("provider")?.toString();

  console.log("Received form data:", { email, password, provider });

  const supabase = createClient(cookies());
  try {
    if (provider === "google") {
      console.log("Attempting to sign in with Google OAuth...");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error || !data.url) {
        console.error("OAuth failed:", error?.message || "No URL returned");
        return NextResponse.json(
          { error: error?.message || "OAuth failed" },
          { status: 500 }
        );
      }

      console.log("OAuth success. Redirect URL:", data.url);
      return NextResponse.json({ url: data.url });
    }

    if (!email || !password) {
      console.error("Missing email or password");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("Attempting to sign up with email and password...");
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
    },);

    if (error) {
      console.error("Sign-up failed:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Sign-up success:", user);
    console.log("Redirecting to sign-in page");
    return NextResponse.redirect(new URL('/sign-in', request.url));
  } catch (err) {
    console.error("Internal server error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}