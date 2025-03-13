import FrontendLayout from '../layout/FrontendLayout'
import Home from '../pages/HomePage'
import Product from '../pages/ProductPage'
import Cart from '../pages/CartPage'

const routes = [
  {
    path: '/',
    element: <FrontendLayout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'product',
        element: <Product />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
    ],
  },
]

export default routes
