import { createBrowserRouter } from 'react-router'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Success from './pages/Success.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'product/:slug', element: <ProductDetail /> },
      { path: 'cart', element: <Cart /> },
      { path: 'success', element: <Success /> },
    ],
  },
])
