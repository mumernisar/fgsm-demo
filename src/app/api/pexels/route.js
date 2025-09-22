export async function GET(request) {
  const API_KEY =
    process.env.PEXELS_API_KEY || process.env.NEXT_PEXELS_API_KEY || "";

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || 1);
  const perPage = Math.min(Number(searchParams.get("per_page") || 80), 80);
  const query = (searchParams.get("query") || "").trim();
  const max = Math.max(
    1,
    Math.min(Number(searchParams.get("max") || perPage), 80)
  );

  if (!API_KEY) {
    return new Response(
      JSON.stringify({ error: "Missing PEXELS_API_KEY on server" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const upstream = query
    ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=${perPage}&page=${page}&orientation=square`
    : `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${page}`;
  const res = await fetch(upstream, {
    headers: { Authorization: API_KEY },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    return new Response(
      JSON.stringify({ error: `Pexels error ${res.status}: ${txt}` }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  const data = await res.json();

  const items = (data.photos || [])
    .filter((p) => p && p.width === p.height)
    .map((p) => ({
      id: String(p.id),
      src: p.src?.medium || p.src?.original || p.src?.large || p.src?.large2x,
      alt: p.alt || `Photo ${p.id}`,
      width: p.width,
      height: p.height,
      photographer: p.photographer,
      url: p.url,
    }))
    .slice(0, max);

  return new Response(
    JSON.stringify({ items, page, total: data.total_results ?? null }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
