import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { CartProvider } from "../context/CartContext.jsx";
import ProductCard from "./ProductCard.jsx";

test("renders the product title with the marketing prefix stripped", () => {
  const product = {
    id: 1,
    slug: "ginger-fizz",
    name: "www.kombuchaparty.store Ginger Fizz",
    description: "Zingy.",
    price: 4.5,
  };

  render(
    <MemoryRouter>
      <CartProvider>
        <ProductCard product={product} />
      </CartProvider>
    </MemoryRouter>,
  );

  expect(screen.getByText("Ginger Fizz")).toBeInTheDocument();
});
