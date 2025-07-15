import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export function middleware(request) {
  const response = NextResponse.next();
  const hasAnonId = request.cookies.get("anon_id");

  if (!hasAnonId) {
    const newId = uuidv4();
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
