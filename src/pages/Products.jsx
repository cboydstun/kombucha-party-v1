import { useMemo, useState } from 'react'
import ProductGrid from '../components/ProductGrid.jsx'
import products from '../data/products.json'
import { productTitle } from '../lib/format.js'

function Products() {
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('featured')

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    const min = minPrice === '' ? -Infinity : Number(minPrice)
    const max = maxPrice === '' ? Infinity : Number(maxPrice)

    const filtered = products.filter((p) => {
      const matchesText =
        !q ||
        productTitle(p.name).toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      return matchesText && p.price >= min && p.price <= max
    })

    return sort === 'price-asc'
      ? [...filtered].sort((a, b) => a.price - b.price)
      : filtered
  }, [search, minPrice, maxPrice, sort])

  function clearFilters() {
    setSearch('')
    setMinPrice('')
    setMaxPrice('')
    setSort('featured')
  }

  const hasFilters =
    search !== '' || minPrice !== '' || maxPrice !== '' || sort !== 'featured'

  return (
    <section>
      <h1 className="text-3xl font-bold text-gray-900">Shop all products</h1>

      <div className="mt-6 flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-gray-700">
          Search
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="rounded-md border border-gray-300 px-3 py-2 font-normal"
          />
        </label>

        <div className="flex items-end gap-2">
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Min $
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-24 rounded-md border border-gray-300 px-3 py-2 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Max $
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Any"
              className="w-24 rounded-md border border-gray-300 px-3 py-2 font-normal"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 font-normal"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low → high</option>
          </select>
        </label>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {visible.length} {visible.length === 1 ? 'product' : 'products'}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-purple-700 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-gray-600">No products match your filters.</p>
      ) : (
        <div className="mt-4">
          <ProductGrid products={visible} />
        </div>
      )}
    </section>
  )
}

export default Products
