import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/sitemap.xml" || pathname.startsWith("/sitemap-")) {
    const response = NextResponse.next();

    response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    response.headers.delete("Pragma");
    response.headers.delete("Expires");
    response.headers.delete("cache-control");

    console.log("✅ Middleware aktif untuk:", pathname);

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sitemap.xml", "/sitemap-:path*", "/robots.txt"],
};
