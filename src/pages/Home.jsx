import ProductGrid from '../components/ProductGrid.jsx'
import products from '../data/products.json'

function Home() {
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Brew your own kombucha</h1>
        <p className="mt-2 text-gray-600">
          Everything you need to start fermenting at home.
        </p>
      </div>
      <ProductGrid products={products} />
    </section>
  )
}

export default Home
