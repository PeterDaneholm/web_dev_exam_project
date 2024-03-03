import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import Cookies from 'js-cookie'


const AdminProduct = () => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        size: [],
        price: 0,
        category_id: "",
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

    console.log("test logging")

    const handleSizeChange = (e) => {
        setSize((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    const addSize = () => {
        setNewProduct({ ...newProduct, size: [...newProduct.size, size] })
        console.log(newProduct)
        setSize({ size: "", quantity: 0 })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = Cookies.get('token')
        console.log("token", token)
        let formData = { ...newProduct, id: uuidv4(), on_sale: false }
        if (formData.price) {
            formData.price = parseInt(formData.price)
        }
        if (formData.size) {
            formData.size = formData.size.map((item) => {
                return {
                    ...item,
                    quantity: parseInt(item.quantity)
                }
            })
        }
        console.log("Product data to request", formData)
        const response = await api.post("/products", formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
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

                <label htmlFor="category_id">Category of Product</label>
                <input type="text" name='category_id' onChange={handleChange} value={newProduct.category_id} />

                <label htmlFor="size">Size of Product</label>
                <input type="text" name='size' onChange={handleSizeChange} value={size.size} />

                <label htmlFor="quantity">Quantity of Product</label>
                <input type="number" name='quantity' onChange={handleSizeChange} value={size.quantity} />

                <button>Submit</button>
            </form>

            <button onClick={addSize}>
                Add size
            </button>
        </div>
    )
}

export default AdminProduct
