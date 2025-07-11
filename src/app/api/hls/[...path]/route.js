import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.REDIS_REST_URL,
  token: process.env.REDIS_REST_TOKEN,
});

const BACKEND_URL = process.env.API_BASE_URL;
const CDN_WORKER_URL = process.env.CDN_WORKER_URL;
const REDIS_KEY = "hls:cdn-token";
const TTL = 120;
const REFRESH_BEFORE = 30;
const CACHE_DURATION = TTL - 5;

export async function GET(req, context) {
  console.log("API_BASE_URL:", process.env.API_BASE_URL);
  console.log("REDIS_REST_URL:", process.env.REDIS_REST_URL);
  console.log("REDIS_REST_TOKEN:", process.env.REDIS_REST_TOKEN);
  console.log("CDN_WORKER_URL:", process.env.CDN_WORKER_URL);

  try {
    const path = context.params?.path || [];
    if (path.length === 0) {
      return new Response("Missing HLS path", { status: 400 });
    }

    // ✅ Ambil token valid dari Redis / backend
    const token = await getValidToken(req);

    // ✅ Bangun URL ke Worker dengan token
    const fullPath = path.join("/");
    const workerUrl = `${CDN_WORKER_URL}/${fullPath}?token=${token}`;

    // ✅ Forward header penting untuk validasi di Worker
    const cdnRes = await fetch(workerUrl, {
      headers: {
        "User-Agent": req.headers.get("user-agent") || "",
        Referer: req.headers.get("referer") || "",
      },
    });

    console.log(workerUrl, 'fullPath');
    

    // ✅ Debug respon dari Worker
    console.log("[CDN Response Status]:", cdnRes.status);
    console.log("[CDN Content-Type]:", cdnRes.headers.get("content-type"));
    console.log("[CDN Content-Length]:", cdnRes.headers.get("content-length"));

    // ✅ Forward headers penting ke client
    const headers = new Headers();
    const contentType = cdnRes.headers.get("content-type");
    const contentLength = cdnRes.headers.get("content-length");
    const contentDisposition = cdnRes.headers.get("content-disposition");

    if (contentType) headers.set("Content-Type", contentType);
    if (contentLength) headers.set("Content-Length", contentLength);
    if (contentDisposition)
      headers.set("Content-Disposition", contentDisposition);

    // Tambahan agar tidak cache di browser (jika memang perlu)
    headers.set("Cache-Control", "no-store");

    // ✅ Return stream response dari CDN worker ke client
    return new Response(cdnRes.body, {
      status: cdnRes.status,
      headers,
    });
  } catch (err) {
    console.error("[HLS Proxy Error]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function getValidToken(req) {
  try {
    const cachedToken = await redis.get(REDIS_KEY);
    const ttl = await redis.ttl(REDIS_KEY);

    if (cachedToken && ttl >= REFRESH_BEFORE) {
      return cachedToken;
    }

    // ✅ Ambil origin dari header dan normalisasi
    const rawOrigin =
      req.headers.get("origin") ||
      req.headers.get("referer") ||
      "http://localhost:4000";

    let origin;
    try {
      origin = new URL(rawOrigin).origin; // Normalize jadi hanya origin
    } catch (e) {
      console.warn("[Token] Gagal parsing origin:", rawOrigin);
      origin = "http://localhost:4000";
    }

    const userAgent = req.headers.get("user-agent") || "nextjs-proxy";

    // ✅ Fetch token dari backend
    const res = await fetch(`${BACKEND_URL}/hls-videos/token`, {
      method: "GET",
      headers: {
        Origin: origin,
        Referer: origin,
        "User-Agent": userAgent,
      },
    });

    console.log("[Token] Status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[Token] Fetch error:", errorText);
      throw new Error(`Token fetch failed: ${res.status}`);
    }

    const json = await res.json();
    const token = json?.token || json?.data?.token;

    if (!token) {
      throw new Error("No token returned from backend");
    }

    await redis.set(REDIS_KEY, token, { ex: CACHE_DURATION });

    console.log(token, "token");

    return token;
  } catch (err) {
    console.error("[Token] Error:", err);
    throw err;
  }
}
