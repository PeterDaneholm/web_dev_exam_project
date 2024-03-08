import React from 'react'
import { useEffect } from 'react'
import api from '../api'
import { useNavigate, useParams } from 'react-router-dom'

const Profile = () => {
    const { slug } = useParams()
    const navigate = useNavigate()
    console.log(slug)

    useEffect(() => {
        const CheckLoggedIn = async () => {
            const response = await api.get("/users/me", {
                withCredentials: true
            })
            if (slug === response.data.username) {
                return null
            } else {
                navigate("/shop")
                console.log("Not allowed")
            }
        }
        CheckLoggedIn()
    })

    return (
        <div>
            Profile view
        </div>
    )
}

export default Profile
