import { Link, useParams } from "react-router";
import products from "../data/products.json";
import { useCart } from "../context/CartContext.jsx";
import { productTitle, formatPrice } from "../lib/format.js";

function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <section>
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <Link
          to="/"
          className="mt-4 inline-block text-purple-700 hover:underline"
        >
          ← Back to products
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-2xl">
      <Link to="/" className="text-sm text-purple-700 hover:underline">
        ← Back to products
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">
        {productTitle(product.name)}
      </h1>
      <p className="mt-4 text-gray-700">{product.description}</p>
      <div className="mt-6 flex items-center gap-4">
        <span className="text-2xl font-bold text-gray-900">
          {formatPrice(product.price)}
        </span>
        <button
          type="button"
          onClick={() => addItem(product)}
          className="rounded-md bg-purple-700 px-4 py-2 font-medium text-white hover:bg-purple-800"
        >
          Add to cart
        </button>
      </div>
    </section>
  );
}

export default ProductDetail;
