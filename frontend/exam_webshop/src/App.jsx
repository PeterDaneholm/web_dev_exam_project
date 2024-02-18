import { useState, useEffect } from 'react'
import SignUpForm from './components/SignUpForm'
import api from './api'
//import './App.css'


function App() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await api.get('/users/');
      console.log(response)
      setUsers(response.data)
    }
    fetchUsers()
  }, []);

  return (
    <>
      <h1>Hello there</h1>
      <div className='grid h-screen'>
        <SignUpForm />
      </div>
    </>
  )
}

export default App
