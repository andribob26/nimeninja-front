import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  if (pathname === "/sitemap.xml" || pathname.startsWith("/sitemap-")) {
    response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    response.headers.delete("Pragma");
    response.headers.delete("Expires");
    response.headers.delete("cache-control");
    return response;
  }

  return response;
}

export const config = {
  matcher: ["/sitemap.xml", "/sitemap-:path*"],
};
