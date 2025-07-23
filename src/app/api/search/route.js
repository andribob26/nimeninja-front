export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  const res = await fetch(
    `https://api.nimeninja.win/media?search=${encodeURIComponent(
      query
    )}&page=1&limit=5&orderDirection=DESC`
  );
  const data = await res.json();

  return Response.json(data);
}
