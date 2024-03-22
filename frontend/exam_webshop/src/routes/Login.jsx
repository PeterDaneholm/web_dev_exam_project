import { useEffect } from 'react'
import React from 'react'
import LoginForm from '../components/Forms/LoginForm'
import alreadyLogin from '../utilities/redirect_functions'
import { useNavigate } from 'react-router-dom'


const Login = () => {
    const navigate = useNavigate()

    useEffect(() => {
        alreadyLogin(navigate)
    }, [navigate])

    return (
        <div>
            <LoginForm />
        </div>
    )
}

export default Login
