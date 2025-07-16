import { NextResponse } from "next/server";

export function middleware(request) {
  const response = NextResponse.next();
  const hasAnonId = request.cookies.get("anon_id");

  if (!hasAnonId) {
    const newId = crypto.randomUUID(); // ganti uuidv4() dari uuid
    response.cookies.set("anon_id", newId, {
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      httpOnly: true,
    });
  }

  return response;
}

export const config = {
  matcher: ["/watch/:slug*/episode/:episodeNumber*"],
};
