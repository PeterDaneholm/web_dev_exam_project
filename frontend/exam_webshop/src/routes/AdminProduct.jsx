import React, { useState, useEffect } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { onAdminRouteLoad } from '../utilities/get_user'
import Button from '../components/basicelements/Button'
import Input from '../components/basicelements/Input'

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

    useEffect(() => {
        onAdminRouteLoad(navigate)
    }, [])

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
        setNewProduct({ ...newProduct, size: [...newProduct.size, size] })
        console.log(newProduct)
        setSize({ size: "", quantity: 0 })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formData = { ...newProduct, id: uuidv4(), on_sale: false }
        if (formData.price) {
            formData.price = parseInt(formData.price)
        }
        if (formData.size) {
            formData.size = formData.size.map((item) => {
                return {
                    ...item,
                    quantity: parseInt(item.quantity),
                    id: uuidv4()
                }
            })
        }
        //console.log("Product data to request", formData)
        const response = await api.post("/products", formData, {
            withCredentials: true,
        })
        //console.log("Response: ", response)
        navigate("/admin")
    }

    return (
        <div>

            <form onSubmit={handleSubmit} className='bg-gray-200 flex flex-col w-[90%] p-2 rounded-lg m-2'>
                <label htmlFor="name">Name of Product</label>
                <input type="text" name='name' onChange={handleChange} value={newProduct.name} />
                <Input type='text' name='name' onChange={handleChange} value={newProduct.name} />

                <label htmlFor="description">Description of Product</label>
                <input type="text" name='description' onChange={handleChange} value={newProduct.description} />
                <Input type='text' name='description' onChange={handleChange} value={newProduct.description} />

                <label htmlFor="price">Price of Product</label>
                <input type="number" name='price' onChange={handleChange} value={newProduct.price} />
                <Input type='text' name='price' onChange={handleChange} value={newProduct.price} />

                <label htmlFor="category_id">Category of Product</label>
                <input type="text" name='category_id' onChange={handleChange} value={newProduct.category_id} />
                <Input type='text' name='category_id' onChange={handleChange} value={newProduct.category_id} />

                <label htmlFor="size">Size of Product</label>
                <input type="text" name='size' onChange={handleSizeChange} value={size.size} />
                <Input type='text' name='size' onChange={handleChange} value={newProduct.size} />

                <label htmlFor="quantity">Quantity of Product</label>
                <input type="number" name='quantity' onChange={handleSizeChange} value={size.quantity} />
                <Input type='text' name='quantity' onChange={handleChange} value={newProduct.quantity} />

                <button>Submit</button>
                <Button text='Add Product' />
            </form>

            <Button text="Add Size" onClick={addSize} />
            <button onClick={addSize}>
                Add size
            </button>
        </div>
    )
}

export default AdminProduct
