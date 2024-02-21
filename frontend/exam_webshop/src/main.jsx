import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Errorpage from './Errorpage.jsx'
import Login from './routes/Login.jsx'
import Signup from './routes/Signup.jsx'
import Profile from './routes/Profile.jsx'
import ProductsPage from './routes/ProductsPage.jsx'
import ProductPage from './routes/ProductPage.jsx'
import Admin from './routes/Admin.jsx'

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
        element: <ProductPage />
      },
      {
        path: "/profile/:username",
        element: <Profile />
      },
      {
        path: "/profile/:username",
        element: <Profile />
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
  },
  {
    path: "/admin",
    element: <Admin />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />

  </React.StrictMode>,
)
