import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.REDIS_REST_URL,
  token: process.env.REDIS_REST_TOKEN,
});

const BACKEND_URL = process.env.API_BASE_URL;
const CDN_WORKER_URL = process.env.CDN_WORKER_URL;
const TTL = 120;
const REFRESH_BEFORE = 30;
const CACHE_DURATION = TTL - 5;

export async function GET(req, context) {
  try {
    const path = context.params?.path || [];
    if (path.length === 0) {
      return new Response("Missing HLS path", { status: 400 });
    }

    // ✅ Tambahkan validasi IP & User-Agent
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const userAgent = req.headers.get("user-agent") || "";
    const referer = req.headers.get("referer") || "";

    const suspiciousAgents = [
      "curl",
      "Postman",
      "Insomnia",
      "HttpClient",
      "python",
      "axios",
      "node-fetch",
      "Go-http-client",
      "okhttp",
      "Wget",
      "Java",
      "Fiddler",
      "Proxyman",
    ];
    const isBadUA = suspiciousAgents.some((bad) =>
      userAgent.toLowerCase().includes(bad.toLowerCase())
    );

    const blockedIps = ["1.2.3.4", "5.6.7.8"]; // Ganti dengan IP yang mau kamu tolak
    const isBlockedIp = blockedIps.includes(ip);

    if (isBadUA || isBlockedIp) {
      console.warn("❌ Blocked by IP/UA filter:", { ip, userAgent });
      return new Response("Forbidden: Client not allowed", { status: 403 });
    }

    // ✅ Ambil anon_id dari cookie
    const cookieHeader = req.headers.get("cookie") || "";
    const anonId = getCookie(cookieHeader, "anon_id");

    if (!anonId || !isValidUUID(anonId)) {
      return new Response("Invalid or missing anon_id cookie", { status: 400 });
    }

    const token = await getValidToken(req, anonId);

    const fullPath = path.join("/");
    const workerUrl = `${CDN_WORKER_URL}/${fullPath}?token=${token}`;

    const cdnRes = await fetch(workerUrl, {
      headers: {
        "User-Agent": userAgent,
        Referer: referer,
      },
    });

    const headers = new Headers();
    const contentType = cdnRes.headers.get("content-type");
    const contentLength = cdnRes.headers.get("content-length");
    const contentDisposition = cdnRes.headers.get("content-disposition");

    if (contentType) headers.set("Content-Type", contentType);
    if (contentLength) headers.set("Content-Length", contentLength);
    if (contentDisposition)
      headers.set("Content-Disposition", contentDisposition);
    headers.set("Cache-Control", "no-store");

    return new Response(cdnRes.body, {
      status: cdnRes.status,
      headers,
    });
  } catch (err) {
    console.error("[HLS Proxy Error]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

async function getValidToken(req, anonId) {
  const redisKey = `hls:cdn-token:${anonId}`;
  const cachedToken = await redis.get(redisKey);
  const ttl = await redis.ttl(redisKey);

  if (cachedToken && ttl >= REFRESH_BEFORE) {
    return cachedToken;
  }

  const rawOrigin =
    req.headers.get("origin") ||
    req.headers.get("referer") ||
    "http://localhost:4000";

  let origin = "http://localhost:4000";

  try {
    origin = new URL(rawOrigin).origin;
  } catch {}

  const userAgent = req.headers.get("user-agent") || "nextjs-proxy";

  const res = await fetch(`${BACKEND_URL}/hls-videos/token`, {
    method: "GET",
    headers: {
      Origin: origin,
      Referer: origin,
      "User-Agent": userAgent,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Token fetch failed: ${res.status} - ${errorText}`);
  }

  const json = await res.json();
  const token = json?.token || json?.data?.token;

  if (!token) {
    throw new Error("No token returned from backend");
  }

  await redis.set(redisKey, token, { ex: CACHE_DURATION });
  return token;
}

function getCookie(cookieHeader, name) {
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return value;
  }
  return null;
}

function isValidUUID(uuid) {
  const uuidV4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Regex.test(uuid);
}
