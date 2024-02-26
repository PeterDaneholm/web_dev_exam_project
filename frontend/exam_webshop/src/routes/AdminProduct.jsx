import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

const AdminProduct = () => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        size: [],
        price: 0,
        category: "",
    })
    const [size, setSize] = useState({ size: "", quantity: 0 })
    const navigate = useNavigate()

    const handleChange = (e) => {
        setNewProduct((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSizeChange = (e) => {
        setSize((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    const addSize = () => {
        setNewProduct({ ...newProduct, size: size })
        console.log(newProduct)
        setSize({ size: "", quantity: 0 })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await api.post("/products")
        console.log("Response: ", response)
        navigate("/admin")
    }

    return (
        <div>

            <form onSubmit={handleSubmit} className='bg-gray-200 flex flex-col w-[90%] p-2 rounded-lg m-2'>
                <label htmlFor="name">Name of Product</label>
                <input type="text" name='name' onChange={handleChange} value={newProduct.name} />

                <label htmlFor="description">Description of Product</label>
                <input type="text" name='description' onChange={handleChange} value={newProduct.description} />

                <label htmlFor="price">Price of Product</label>
                <input type="number" name='price' onChange={handleChange} value={newProduct.price} />

                <label htmlFor="category">Category of Product</label>
                <input type="text" name='category' onChange={handleChange} value={newProduct.category} />

                <label htmlFor="size">Size of Product</label>
                <input type="text" name='size' onChange={handleSizeChange} value={size.size} />

                <label htmlFor="quantity">Quantity of Product</label>
                <input type="text" name='quantity' onChange={handleSizeChange} value={size.quantity} />

                <button>Submit</button>
            </form>

            <button onClick={addSize}>
                Add size
            </button>
        </div>
    )
}

export default AdminProduct
