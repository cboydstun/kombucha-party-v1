import { createBrowserRouter } from "react-router";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Success from "./pages/Success.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import FAQ from "./pages/FAQ.jsx";
import Blogs from "./pages/Blogs.jsx";
import BlogDetail from "./components/blogs/BlogDetail.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "product/:slug", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      { path: "success", element: <Success /> },
      { path: "contact", element: <Contact /> },
      { path: "about", element: <About /> },
      { path: "faq", element: <FAQ /> },
      { path: "blogs", element: <Blogs /> },
      { path: "blog/:slug", element: <BlogDetail /> },
    ],
  },
]);
