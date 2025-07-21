import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/sitemap-") ||
    pathname === "/robots.txt"
  ) {
    const response = NextResponse.next();

    // ❗️Hapus dulu header yang tidak diinginkan
    response.headers.delete("Cache-Control");
    response.headers.delete("cache-control");
    response.headers.delete("Pragma");
    response.headers.delete("Expires");

    // ✅ Baru set ulang
    response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");

    console.log("✅ Middleware aktif untuk:", pathname);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sitemap.xml", "/sitemap-:path*", "/robots.txt"],
};
