import { createBrowserRouter } from 'react-router'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Cart from './pages/Cart.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'cart', element: <Cart /> },
    ],
  },
])
