import { Link } from "react-router";
import { useCart } from "../context/CartContext.jsx";
import { productTitle, formatPrice } from "../lib/format.js";

function ProductCard({ product }) {
  const { addItem } = useCart();
  const title = productTitle(product.name);

  return (
    <article className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <Link to={`/product/${product.slug}`} className="group">
        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700">
          {title}
        </h2>
      </Link>
      <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-3">
        {product.description}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900">
          {formatPrice(product.price)}
        </span>
        <button
          type="button"
          onClick={() => addItem(product)}
          className="rounded-md bg-purple-700 px-3 py-2 text-sm font-medium text-white hover:bg-purple-800"
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
