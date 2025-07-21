import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/sitemap") && pathname.endsWith(".xml")) {
    const response = NextResponse.next();

    // Hapus semua header yang mengganggu indexing
    response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    response.headers.delete("Pragma");
    response.headers.delete("Expires");
    response.headers.delete("cache-control");

    return response;
  }

  return NextResponse.next();
}
