import { useState, useEffect } from 'react'
import api from './api'
import Navbar from './components/Navbar';
//import './App.css'
import { Outlet, Link, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ProductPage from './routes/ProductPage';
import ProductsPage from './routes/ProductsPage';
import Admin from './routes/Admin';
import AdminProduct from './routes/AdminProduct';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Profile from './routes/Profile';



function App() {
  const [users, setUsers] = useState([])

  /*   useEffect(() => {
      const fetchUsers = async () => {
        const response = await api.get('/users/');
        console.log(response)
        setUsers(response.data)
      }
      fetchUsers()
    }, []); */

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element="" />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shop" element={<ProductsPage />} />
        <Route path="/shop/:slug" element={<ProductPage />} />
        <Route path="/profile/:slug" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/uploadproduct" element={<AdminProduct />} />
      </Routes>
      <div className='grid h-screen'>
        {/* <Outlet /> */}
      </div>
    </>
  )
}

export default App
