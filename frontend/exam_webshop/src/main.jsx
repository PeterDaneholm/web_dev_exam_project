import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Errorpage from './Errorpage.jsx'
import Login from './routes/Login.jsx'
import Signup from './routes/Signup.jsx'
import Profile from './routes/Profile.jsx'
import Product from './routes/Product.jsx'
import ProductsPage from './routes/ProductsPage.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Errorpage />,
    children: [
      {
        path: "/products",
        element: <ProductsPage />
      },
      {
        path: "/products/:id",
        element: <Product />
      },
      {
        path: "/profile/:username",
        element: <Profile />
      },
      {
        path: "/profile/:username",
        element: <Profile />
      },
      {
        path: "/product/:id",
        element: <Product />,
      },
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />

  </React.StrictMode>,
)
