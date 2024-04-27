import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import Button from '../components/basicelements/Button'
import Input from '../components/basicelements/Input'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useToast } from '../components/Toast/ToastContext'


const AdminEdit = () => {
    const { id } = useParams()
    const [product, setProduct] = useState()
    const [updatedQuantities, setUpdatedQuantities] = useState([])
    const navigate = useNavigate()
    const { showToast } = useToast()

    useEffect(() => {
        const getProduct = async () => {
            const response = await api.get(`/products/${id}`, {
                withCredentials: true
            })
            setProduct(response.data)
            setUpdatedQuantities(response.data.size)
        }
        getProduct()
    }, [])

    const updateQuantity = (id, newQuantity) => {
        setUpdatedQuantities((prev) => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: newQuantity }
            } else {
                return item;
            }
        }))
    }


    const SubmitUpdate = async (e) => {
        e.preventDefault()
        const response = await api.put(`/productquantity/${id}`, updatedQuantities, {
            withCredentials: true
        })
        console.log(response)
        if (response.status == 200) {
            showToast("Sizes updated!", "success")
            navigate("/admin")
        }
    }

    return (

        <div className='w-full'>
            <Link to={"/admin"} className='w-[100px] h-[24px] bg-contrast hover:bg-contrastdark rounded-md p-2 m-4'>
                Back to Panel
            </Link>
            {product && <div className='mx-auto bg-primary border-2 border-gray-500 rounded-lg m-2 w-3/5 p-4 mt-8'>
                <p className='text-center font-semibold text-lg'>
                    {product.name}
                </p>
                <p>
                    Category: {product.category_id}
                </p>
                <div className='flex flex-row flex-wrap'>
                    {product.size.map((item) => (
                        <div key={item.id} className='border-2 border-gray-500 bg-gray-100 p-2 w-1/4 m-2 rounded-lg'>
                            <p className='text-center'>
                                Size: {item.size}
                            </p>
                            <p className='text-center'>
                                Quantity: {item.quantity}
                            </p>
                            <p className='text-center text-sm mt-2'>
                                Enter new quantity below:
                            </p>
                            <Input placeholder='New Quantity' width={"w-1/3 ml-[33%] mt-2"}
                                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                value={updatedQuantities.find(q => q.id === item.id)?.quantity || ""} />
                        </div>
                    ))}
                </div>
            </div>}

            <Button text={"Update the product"} onClick={SubmitUpdate} width='w-2/5' my='ml-[30%]' />

        </div>
    )
}

export default AdminEdit
