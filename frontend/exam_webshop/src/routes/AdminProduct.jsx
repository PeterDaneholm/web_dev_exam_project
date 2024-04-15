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
        //console.log("Product data to request", formData)
        const response = await api.post("/products", formData, {
            withCredentials: true,
        })
        //console.log("Response: ", response)
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
                <Input type='text' name='category_id' onChange={handleChange} value={newProduct.category_id} placeholder='Select Category' />

                <label htmlFor="size">Size of Product</label>
                <Input type='text' name='size' onChange={handleSizeChange} value={size.size} placeholder='Add Sizes' />

                <label htmlFor="quantity">Quantity of Product</label>
                <Input type='number' name='quantity' onChange={handleSizeChange} value={size.quantity} />

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
