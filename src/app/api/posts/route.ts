import { NextResponse, NextRequest } from "next/server";
import { supabaseClient } from "@/shared/lib/supabase/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const post_limit = parseInt(searchParams.get("post_limit") || "10", 10);
    const tag = searchParams.get('tag')!

    const { data, error } = await supabaseClient.rpc("get_discovery_posts", {
      page,
      post_limit,
      filter_tag: tag
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
