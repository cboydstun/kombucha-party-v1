import { createBrowserRouter } from 'react-router'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Success from './pages/Success.jsx'
import Contact from './pages/Contact.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'product/:slug', element: <ProductDetail /> },
      { path: 'cart', element: <Cart /> },
      { path: 'success', element: <Success /> },
      { path: 'contact', element: <Contact /> },
    ],
  },
])
