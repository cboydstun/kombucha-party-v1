import { Link } from "react-router";
import { useCart } from '../context/CartContext.jsx'

export default function Navigation() {
  const { count } = useCart()

  return (
 <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
    <Link to="/" className="text-xl font-semibold text-purple-700">
    Kombucha Party
    </Link>
    <div className="flex items-center gap-6">
        <Link 
        to="/contact"
        className="text-sm font-medium text-gray-700 hover:text-purple-700"
    >
        Contact
    </Link>
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
  )
}


