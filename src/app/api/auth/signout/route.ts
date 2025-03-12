import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();

  // Delete authentication cookies
  (await cookieStore).delete("sb-access-token");
  (await cookieStore).delete("sb-refresh-token");

  return NextResponse.redirect(new URL("/sign-in", req.url));
}