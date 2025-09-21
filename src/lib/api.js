export async function postAttack({ file, epsilon }) {
  // Determine API base URL. Prefer env, else default to local FastAPI dev server.
  const base = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  ).replace(/\/$/, "");
  const url = `${base}/attack`;

  const form = new FormData();
  form.append("file", file);
  form.append("epsilon", String(epsilon));

  const res = await fetch(url, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`Server error ${res.status}: ${msg}`);
  }
  return res.json();
}

// Fetch gallery items from the Next.js Pexels API route
export async function getGalleryItems({
  page = 1,
  perPage = 20,
  query = "",
  orientation = "square",
  max,
}) {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
    orientation,
  });
  if (query) params.set("query", query);
  if (max != null) params.set("max", String(max));

  const res = await fetch(`/api/pexels?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}
