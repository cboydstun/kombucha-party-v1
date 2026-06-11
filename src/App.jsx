import { Link, Outlet } from 'react-router'

function App() {
  return (
    <div className="min-h-svh flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-semibold text-purple-700">
            Kombucha Party
          </Link>
          <Link to="/cart" className="text-sm font-medium text-gray-700 hover:text-purple-700">
            Cart
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default App
