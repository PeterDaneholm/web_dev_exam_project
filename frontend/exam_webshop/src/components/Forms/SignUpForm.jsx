import React from 'react'
import api from '../../api'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../basicelements/Input'
import Button from '../basicelements/Button'
import { useToast } from '../Toast/ToastContext'


const SignUpForm = () => {
  const [formData, setFormData] = useState({
    id: uuidv4(),
    username: '',
    first_name: '',
    last_name: '',
    email_address: '',
    password: '',
    role: 'user',
  })
  const { showToast } = useToast()
  const navigate = useNavigate()

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
    await api.post("/register", formData)
    setFormData({
      username: '',
      first_name: '',
      last_name: '',
      email_address: '',
      password: '',
    })
    navigate("/shop")
    showToast(`User: ${formData.username} created`, "success")
  }

  return (
    <div className='flex rounded-md w-4/5 h-auto flex-col text-center gap-2 bg-primary p-2 m-2 mx-auto self-center'>
      <h2 className='text-bold text-2xl'>Create an Account</h2>
      <div className='h-[1px] bg-gray-800 rounded-md w-[90%] self-center'></div>

      <form onSubmit={handleSubmit} className='flex flex-col border-black'>
        <div className="flex flex-col gap-2">
          <label htmlFor='username' className='mt-2'>Choose a Username</label>
          <Input type="text" name="username" onChange={handleChange} value={formData.username} placeholder='Username' />

          <label htmlFor='first_name' className='mt-2'>What's your first name?</label>
          <Input type="text" name="first_name" onChange={handleChange} value={formData.first_name} placeholder='First Name' />

          <label htmlFor='last_name' className='mt-2'>What's your last name?</label>
          <Input type="text" name="last_name" onChange={handleChange} value={formData.last_name} placeholder='Last Name' />

          <label htmlFor='email_address' className='mt-2'>Email address to receive confirmation</label>
          <Input type='email' name='email_address' onChange={handleChange} value={formData.email_address} placeholder='Email' />

          <label htmlFor='password' className='mt-2'>Secret Password</label>
          <Input type="password" name="password" onChange={handleChange} value={formData.password} placeholder='Password' />

          <Button text="Sign Up" />
        </div>
      </form>

      <Link to={"/login"} className='my-3 bg-primarydark rounded-lg w-[70%] mx-auto hover:bg-contrast'>
        Already registered? Sign in instead!
      </Link>
    </div>
  )
}

export default SignUpForm
