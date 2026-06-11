// Strip the "www.kombuchaparty.store " marketing prefix from the raw product
// names in data so the UI shows a clean title.
export function productTitle(name) {
  return name.replace(/^www\.kombuchaparty\.store\s+/i, '').trim()
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}
