import React from 'react'
import { hasToken } from '../utilities/get_user'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const navigate = useNavigate()

    useEffect(() => {
        hasToken(navigate)
    }, [])

    return (
        <div >
            Home
        </div>
    )
}

export default HomePage
