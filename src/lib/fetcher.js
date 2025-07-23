const BASE_URL = process.env.API_BASE_URL;

export async function fetchWithRevalidate(
  path,
  params = {},
  revalidateInSeconds = false // ⏱️ selamanya
) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else {
        searchParams.append(key, value);
      }
    }
  }

  const fullUrl = `${BASE_URL}${path}?${searchParams.toString()}`;
  console.log("▶️ fetch:", fullUrl);

  const fetchOptions = {
    next: { revalidate: revalidateInSeconds },
  };

  try {
    const res = await fetch(fullUrl, fetchOptions);

    if (!res.ok) {
      console.error(`❌ Fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }

    const json = await res.json();
    return json;
  } catch (err) {
    console.error("🔥 Error fetchWithRevalidate:", err?.message || err);
    return null;
  }
}
