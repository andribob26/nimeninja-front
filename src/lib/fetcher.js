const BASE_URL = process.env.API_BASE_URL;
// const revalidate = 1800; 30 menit
export async function fetchWithRevalidate(
  path,
  params = {},
  revalidateInSeconds = null // default null
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
    next: revalidateInSeconds ? { revalidate: revalidateInSeconds } : undefined,
    cache: revalidateInSeconds ? undefined : "no-store",
  };

  console.log(BASE_URL);

  const res = await fetch(fullUrl, fetchOptions);

  if (!res.ok) throw new Error(`❌ Failed to fetch ${fullUrl}`);
  const json = await res.json();
  return json;
}
