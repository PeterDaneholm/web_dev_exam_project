import Navbar from './components/Navbar';
//import './App.css'
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage'
import ProductPage from './routes/ProductPage';
import ProductsPage from './routes/ProductsPage';
import Admin from './routes/Admin';
import AdminProduct from './routes/AdminProduct';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Profile from './routes/Profile';
import CartProvider from './components/CartContext';
import Signout from './routes/Signout';
import Checkout from './routes/Checkout';
import AdminEdit from './routes/AdminEdit';
import { ToastProvider } from './components/Toast/ToastContext';


function App() {

  return (
    <>
      <ToastProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signout" element={<Signout />} />
            <Route path="/shop" element={<ProductsPage />} />
            <Route path="/shop/:id" element={<ProductPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile/:slug" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/uploadproduct" element={<AdminProduct />} />
            <Route path="/admin/product/:id" element={<AdminEdit />} />
          </Routes>
        </CartProvider>
      </ToastProvider>

    </>
  )
}

export default App
