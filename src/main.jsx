import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";
import { CartProvider } from "./context/CartContext.jsx";
import { router } from "./router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
      <Analytics />
    </CartProvider>
  </StrictMode>,
);
