import { Link, Outlet } from 'react-router'
import { useCart } from './context/CartContext.jsx'

function App() {
  const { count } = useCart()

  return (
    <div className="min-h-svh flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-semibold text-purple-700">
            Kombucha Party
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/products"
              className="text-sm font-medium text-gray-700 hover:text-purple-700"
            >
              Shop all
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-purple-700"
            >
              Cart
              {count > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-700 px-1.5 text-xs font-semibold text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default App
