import React from 'react'
import api from '../api'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    id: uuidv4,
    username: '',
    first_name: '',
    last_name: '',
    email_address: '',
    password: '',
    role: 'user',
  })

  const handleChange = async (e) => {
    setFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Form Data: ", formData)
    await api.post("/users", formData)
    setFormData({
      username: '',
      first_name: '',
      last_name: '',
      email_address: '',
      password: '',
    })
  }

  return (
    <div className='flex rounded-md w-4/5 h-auto flex-col text-center gap-2 bg-gray-300 p-2 m-2 justify-self-center self-center'>
      <h2>SignUp</h2>
      <div className='h-[1px] bg-gray-800 rounded-md w-[90%] self-center'></div>
      <form onSubmit={handleSubmit} className='flex bg-gray-300 flex-col border-black'>
        <div className="flex flex-col gap-2">

          <label htmlFor='username'>Username</label>
          <input type="text" name="username" onChange={handleChange} value={formData.username} placeholder="Username" />

          <label htmlFor='first_name'>first_name</label>
          <input type="text" name="first_name" onChange={handleChange} value={formData.first_name} placeholder="First Name" />

          <label htmlFor='last_name'>last_name</label>
          <input type="text" name="last_name" onChange={handleChange} value={formData.last_name} placeholder="Last Name" />

          <label htmlFor='email_address'>email_address</label>
          <input type="email" name="email_address" onChange={handleChange} value={formData.email_address} placeholder="Email" />

          <label htmlFor='password'>password</label>
          <input type="password" name="password" onChange={handleChange} value={formData.password} placeholder="Password" />

          <button>
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default SignUpForm
