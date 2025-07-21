import { NextResponse } from "next/server";

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/sitemap.xml" || pathname === "/sitemap-0.xml") {
    const response = NextResponse.next();

    response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    response.headers.delete("Pragma");
    response.headers.delete("Expires");
    response.headers.delete("cache-control");

    return response;
  }

  return NextResponse.next();
}
