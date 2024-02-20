import { useState, useEffect } from 'react'
import SignUpForm from './components/SignUpForm'
import api from './api'
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
//import './App.css'


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
        <SignUpForm />
        <LoginForm />
      </div>
    </>
  )
}

export default App
