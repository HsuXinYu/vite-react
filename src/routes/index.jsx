import FrontendLayout from '../layout/FrontendLayout'
import Home from '../pages/HomePage'
import Product from '../pages/ProductPage'
import Cart from '../pages/CartPage'
import Login from '../pages/LoginPage'
import AdminLayout from '../layout/AdminLayout'
import AdminProduct from '../pages/AdminProductPage'

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
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'product',
        element: <AdminProduct />,
      },
    ],
  },
]

export default routes
