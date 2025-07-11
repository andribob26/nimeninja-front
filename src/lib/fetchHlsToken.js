const BASE_URL = process.env.API_BASE_URL;

export async function fetchHlsToken() {
  const res = await fetch(`${BASE_URL}/hls-videos/token`);
  const data = await res.json();

  return data.data.token;
}
