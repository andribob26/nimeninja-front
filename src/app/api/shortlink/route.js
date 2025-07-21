import { NextResponse } from "next/server";

const SHORT_LINK_API_KEY = "305e9b7913e19a6d90b127483fbf9e4f68fb06d6";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const alias = searchParams.get("alias");

  if (!url) {
    return NextResponse.json(
      { error: "Missing `url` parameter." },
      { status: 400 }
    );
  }

  const apiURL = `https://shrinkme.io/api?api=${SHORT_LINK_API_KEY}&url=${encodeURIComponent(
    url
  )}${alias ? `&alias=${encodeURIComponent(alias)}` : ""}`;

  try {
    const res = await fetch(apiURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch from exe.io" },
      { status: 500 }
    );
  }
}
