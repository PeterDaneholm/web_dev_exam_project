import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

const AdminProduct = () => {
    const [newProduct, setNewProduct] = useState({})
    const navigate = useNavigate()

    const handleChange = (e) => {
        setNewProduct((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await api.post("/products")
        navigate("/admin")
    }

    return (
        <div>

            <form onSubmit={handleSubmit}>

            </form>
        </div>
    )
}

export default AdminProduct
