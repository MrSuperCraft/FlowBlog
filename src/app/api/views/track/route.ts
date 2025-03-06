import { NextRequest, NextResponse, userAgent } from "next/server";
import { createClient } from "@/shared/lib/supabase/server";
import { cookies } from "next/headers";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { postId, userId, sessionId, viewTime, readPercentage, referrer } = body;

        if (!postId || !userId || !sessionId || viewTime === undefined || readPercentage === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Extract User-Agent data
        const { device, browser, os } = userAgent(req);

        const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0]
        const res = await fetch(`https://ip-api.com/json/${ip}`);
        const data = await res.json();
        const country = data.countryCode;
        console.log(data)

        // Create Supabase instance
        const supabase = createClient(cookies());

        // Insert into Supabase
        const { error } = await supabase.from("views").insert({
            post_id: postId,
            user_id: userId,
            session_id: sessionId,
            view_time: Math.round(viewTime),
            read_percentage: Math.round(readPercentage),
            referrer,
            user_agent: { device, browser, os },
            country
        });

        if (error) {
            console.error("Supabase insert error:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "View tracked successfully" }, { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
