import React, { useState } from 'react'
import api from '../../api'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../basicelements/Button'
import Input from '../basicelements/Input'


const LoginForm = () => {
    const [login, setLogin] = useState({
        username: '',
        password: '',
    })
    const navigate = useNavigate()

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
        const response = await api.post("/login", login, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true
        });
        if (response.status === 200) {
            navigate("/shop");
            window.location.reload();
        }
    }

    return (
        <div className='flex rounded-md w-4/5 h-auto flex-col text-center gap-2 bg-primary p-2 m-2 mx-auto self-center'>
            <h2 className='text-xl font-semibold'>Log In</h2>
            <form onSubmit={handleSubmit} className='flex flex-col border-black justify-center text-center gap-2'>
                <div className='h-[1px] bg-gray-800 rounded-md w-[90%] self-center justify-center'></div>

                <label htmlFor="username">Username</label>
                <Input type='text' onChange={handleChange} name="username" value={login.username} placeholder="Username" />

                <label htmlFor="password">Password</label>
                <Input type="password" onChange={handleChange} name='password' value={login.password}
                    placeholder='Password'
                />


                <Button text="Log In" width={"w-[50%]"} my={"my-8"} />
            </form>

            {/*             <Button text='Forgot your password?' onClick={resetPassword} />
 */}
            <Link to={"/signup"} className='my-3 bg-primarydark rounded-lg w-[70%] mx-auto hover:bg-contrast'>
                Don't have an account? Sign up here!
            </Link>
        </div>
    )
}

export default LoginForm
