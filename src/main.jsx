import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router'
import routes from './routes/index.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'

const router = createHashRouter(routes)

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
