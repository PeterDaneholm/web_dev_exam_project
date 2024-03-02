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
import AdminProduct from './routes/AdminProduct.jsx'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

const ProtectedRoute = ({ children, scopes }) => {
  const navigate = useNavigate()
  const token = Cookies.get('token');

  if (!token) {
    navigate("/login")
    return null
  }

  const decodedToken = jwtDecode(token);

  if (!scopes.some(scope => decodedToken.scopes.includes(scope))) {
    navigate("/error");
    return null
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Errorpage />,
    children: [
      {
        path: "/shop",
        element: <ProductsPage />
      },
      {
        path: "/shop/:id",
        element: <ProductPage />
      },
      {
        path: "/profile/:username",
        element: <Profile />
      },
      {
        path: "/admin",
        element: <Admin />,/* (
          <ProtectedRoute scopes={['Admin']}>
            <AdminProduct />
          </ProtectedRoute>
        ) */
        children: [
          {
            path: "/admin/uploadproduct",
            element: <AdminProduct />/* (
              <ProtectedRoute scopes={['Admin']}>
                <AdminProduct />
              </ProtectedRoute>
            ) */
          },
        ]
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
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />

  </React.StrictMode>,
)
