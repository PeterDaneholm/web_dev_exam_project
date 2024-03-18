import React, { useState } from 'react'
import { useEffect } from 'react'
import api from '../api'
import { useNavigate, useParams } from 'react-router-dom'

const Profile = () => {
    const { slug } = useParams()
    const [user, setUser] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        const CheckLoggedIn = async () => {
            const response = await api.get("/users/me", {
                withCredentials: true
            })
            if (slug === response.data.username) {
                setUser(response.data)
                return null
            } else {
                navigate("/shop")
                console.log("Not allowed")
            }
        }
        CheckLoggedIn()
    }, [])

    return (
        <>
            {user &&
                <div>
                    <h2>Welcome back {user.username}</h2>
                    Profile view

                    <p></p>
                </div>
            }
        </>
    )
}

export default Profile
