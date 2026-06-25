import { Link } from "react-router";
import Hero from "../components/home/Hero.jsx";
import HowItWorks from "../components/home/HowItWorks.jsx";
import SocialProof from "../components/home/SocialProof.jsx";
import Newsletter from "../components/home/Newsletter.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import products from "../data/products.json";

function Home() {
  const featured = products.slice(0, 3);

  return (
    <div className="space-y-20">
      <Hero />

      <section>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              Fan favorites
            </h2>
            <p className="mt-2 text-gray-600">
              Our most-loved kits to get you brewing.
            </p>
          </div>
          <Link
            to="/products"
            className="hidden shrink-0 font-medium text-purple-700 hover:underline sm:block"
          >
            View all products →
          </Link>
        </div>
        <div className="mt-8">
          <ProductGrid products={featured} />
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Link
            to="/products"
            className="font-medium text-purple-700 hover:underline"
          >
            View all products →
          </Link>
        </div>
      </section>

      <HowItWorks />
      <SocialProof />
      <Newsletter />
    </div>
  );
}

export default Home;
