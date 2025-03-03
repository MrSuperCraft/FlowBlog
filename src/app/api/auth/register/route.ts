import { createClient } from "@/shared/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const provider = formData.get("provider")?.toString();

  const supabase = createClient(cookies());
  try {
    if (provider === "google") {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error || !data.url) {
        return NextResponse.json(
          { error: error?.message || "OAuth failed" },
          { status: 500 }
        );
      }

      return NextResponse.json({ url: data.url });
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.redirect(new URL("/sign-in"));
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
