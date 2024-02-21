import { useState, useEffect } from 'react'
import api from './api'
import Navbar from './components/Navbar';
//import './App.css'
import { Outlet, Link } from 'react-router-dom';
import HomePage from './components/HomePage';



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
      <div className='grid h-screen'>
        <Outlet />
      </div>
    </>
  )
}

export default App
