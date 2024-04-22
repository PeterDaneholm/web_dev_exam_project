import React, { useState, useEffect } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { onAdminRouteLoad } from '../utilities/get_user'
import Button from '../components/basicelements/Button'
import Input from '../components/basicelements/Input'
import { useToast } from '../components/Toast/ToastContext'
import { Link } from 'react-router-dom'


const AdminProduct = () => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        size: [],
        price: 0,
        category_id: "",
        image_id: [
            { "url": "" }
        ]
    })
    const [size, setSize] = useState({ size: "", quantity: 0 })
    const navigate = useNavigate()
    const { showToast } = useToast()

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
        showToast("Size added", "success")
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formData = { ...newProduct, id: uuidv4(), on_sale: false }
        formData.image_id = formData.image_id.filter(image => image.url !== '')
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
        const response = await api.post("/products", formData, {
            withCredentials: true,
        })
        showToast("Product added!", "success")
        navigate("/admin")
    }

    return (
        <div className='w-full'>
            <Link to={"/admin"} className='w-[100px] h-[24px] bg-contrast hover:bg-contrastdark rounded-md p-2 m-4'>
                Back to Panel
            </Link>
            <form onSubmit={handleSubmit} className='bg-primary shadow-inner flex flex-col w-[90%] p-6 rounded-lg m-2 text-center gap-2 mx-auto'>
                <label htmlFor="name">Name of Product</label>
                <Input type='text' name='name' onChange={handleChange} value={newProduct.name} placeholder='Product Name' />

                <label htmlFor="description">Description of Product</label>
                <Input type='text' name='description' onChange={handleChange} value={newProduct.description} placeholder='Description of Product' />

                <label htmlFor="price">Price of Product</label>
                <Input type='text' name='price' onChange={handleChange} value={newProduct.price} placeholder='Price' />

                <label htmlFor="category_id">Category of Product</label>
                <select name="category_id" id="category_id" onChange={handleChange}
                    className='rounded-md h-[30px] w-[70%] mx-auto text-center shadow-md'>
                    <option value="baseball">Baseball</option>
                    <option value="jacket">Jacket</option>
                    <option value="suit">Suit</option>
                    <option value="sportclothes">Sportclothes</option>
                    <option value="shoes">Shoes</option>
                    <option value="accessories">Accessories</option>
                    <option value="sportequipment">Sportequipment</option>
                </select>

                <label htmlFor="size">Size of Product</label>
                <Input type='text' name='size' onChange={handleSizeChange} value={size.size} placeholder='Add Sizes' />

                <label htmlFor="quantity">Quantity of Product</label>
                <Input type='number' name='quantity' onChange={handleSizeChange} value={size.quantity} />

                <h4>Added Sizes:</h4>
                <div className='flex flex-row justify-around'>
                    {newProduct.size && newProduct.size.map((size, index) => {
                        return <div key={index} className='rounded-md bg-gray-100 border-gray-500 border-2 w-[120px] h-[52px]'>
                            <p>Size: {size.size}</p>
                            <p>Quantity: {size.quantity}</p>
                        </div>
                    }
                    )}
                </div>

                <label htmlFor='image'>Add Images below</label>
                {newProduct.image_id.map((item, index) => (
                    <Input type='text' name='image' key={index}
                        onChange={e => {
                            let newImages = [...newProduct.image_id]
                            newImages[index].url = e.target.value
                            setNewProduct(prev => ({
                                ...prev,
                                image_id: newImages
                            }))
                            if (index === newProduct.image_id.length - 1 && e.target.value !== '') {
                                setNewProduct(prev => ({
                                    ...prev,
                                    image_id: [...prev.image_id, { url: '' }]
                                }))
                            }
                        }} value={item.url} placeholder='Add URL for the image' />
                ))}

                <Button text='Add Product' width='w-3/5' />
            </form>

            <Button text="Add Size" onClick={addSize} width='w-3/5' my='ml-[20%]' />
        </div>
    )
}

export default AdminProduct
