const BASE_URL = process.env.API_BASE_URL;

/**
 * @param {string} path - Path endpoint dari API backend kamu
 * @param {object} params - Query params yang ingin dikirim (opsional)
 * @param {object} options - { revalidateInSeconds: number } atau { tags: string[] }
 */
export async function fetchWithRevalidate(path, params = {}, options = {}) {
  const searchParams = new URLSearchParams();

  for (const key in params) {
    const value = params[key];
    if (value === undefined || value === null || value === "") continue;

    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, v));
    } else {
      searchParams.append(key, String(value));
    }
  }

  const fullUrl = `${BASE_URL}${path}?${searchParams.toString()}`;
  console.log("▶️ fetch:", fullUrl);

  const fetchOptions = {
    next: {},
  };

  if (
    "revalidateInSeconds" in options &&
    typeof options.revalidateInSeconds === "number"
  ) {
    fetchOptions.next.revalidate = options.revalidateInSeconds;
  } else if ("tags" in options && Array.isArray(options.tags)) {
    fetchOptions.next.tags = options.tags;
  }

  try {
    const res = await fetch(fullUrl, fetchOptions);

    if (!res.ok) {
      console.error(`❌ Fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("🔥 Error fetchWithRevalidate:", err?.message || err);
    return null;
  }
}
