import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req) {
  // Tidak ada otentikasi — siapa saja bisa memanggil endpoint ini
  revalidateTag("media");
  return NextResponse.json({ revalidated: true, tag: "media" });
}
