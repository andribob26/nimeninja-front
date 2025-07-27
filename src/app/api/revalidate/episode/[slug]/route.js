import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const slug = params.slug;

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  revalidateTag(`episode-${slug}`);
  return NextResponse.json({ revalidated: true, tag: `episode-${slug}` });
}
