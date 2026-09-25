import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Fast path for React Server Component (RSC) payload fetches
  if (
    request.headers.get("rsc") === "1" ||
    request.headers.get("accept")?.includes("text/x-component") ||
    request.nextUrl.searchParams.has("_rsc")
  ) {
    return NextResponse.next();
  }

  try {
    const { supabaseResponse } = await updateSession(request);
    return supabaseResponse;
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
