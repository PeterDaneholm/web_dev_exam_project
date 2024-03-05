import React from 'react'
import api from '../api'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Signout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const logOut = async () => {
            const response = await api.post("/logout", {
                withCredentials: true,
            })
            console.log("Logged out")
            navigate("/login")
        }
        logOut()
    }, [])


    return (
        <div>

        </div>
    )
}

export default Signout
