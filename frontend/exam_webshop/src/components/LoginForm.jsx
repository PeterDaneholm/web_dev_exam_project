import React, { useState } from 'react'
import api from '../api'

const LoginForm = () => {
    const [login, setLogin] = useState({
        username: '',
        password: '',
    })

    const handleChange = (e) => {
        setLogin((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
/*         const response = await api.post("/login");
 */    }

    return (
        <div className='flex rounded-md w-4/5 h-auto flex-col text-center gap-2 bg-gray-300 p-2 m-2 justify-self-center self-center'>
            <h2>Log In</h2>
            <form onSubmit={handleSubmit} className='flex bg-gray-300 flex-col border-black justify-center text-center'>
                <div className='h-[1px] bg-gray-800 rounded-md w-[90%] self-center justify-center'></div>

                <label htmlFor="username">Username</label>
                <input type='text' onChange={handleChange} name="username" value={login.username} placeholder="Username"
                    className='w-2/3 mx-auto'></input>

                <label htmlFor="password">Password</label>
                <input type='password' onChange={handleChange} name="password" value={login.password} placeholder="Password"
                    className='w-2/3 mx-auto'></input>

                <button>
                    Log In
                </button>
            </form>
        </div>
    )
}

export default LoginForm
