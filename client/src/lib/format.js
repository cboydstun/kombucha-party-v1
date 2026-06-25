// Strip the "www.kombuchaparty.store " marketing prefix from the raw product
// names in data so the UI shows a clean title.
export function productTitle(name) {
  return name.replace(/^www\.kombuchaparty\.store\s+/i, "").trim();
}

export function formatPrice(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// Render an ISO date string (e.g. "2024-06-01") as "Jun 1, 2024".
export function formatDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
