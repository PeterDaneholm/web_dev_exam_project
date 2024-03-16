import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import Button from '../components/basicelements/Button'
import Input from '../components/basicelements/Input'
import { useNavigate } from 'react-router-dom'

const AdminEdit = () => {
    const { id } = useParams()
    const [product, setProduct] = useState()
    const [updatedQuantities, setUpdatedQuantities] = useState([])
    const navigate = useNavigate()

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
        console.log(updatedQuantities)
    }


    const SubmitUpdate = async (e) => {
        e.preventDefault()
        console.log(updatedQuantities)
        const response = await api.put(`/productquantity/${id}`, updatedQuantities, {
            withCredentials: true
        })
        console.log(response)
        if (response.status == 200) {
            console.log("Sizes updated")
            navigate("/admin")
        }
    }

    return (

        <div className='w-full'>

            {product && <div className='mx-auto'>
                <p>
                    {product.name}
                </p>
                <p>
                    {product.category_id}
                </p>
                <div>
                    {product.size.map((item) => (
                        <div key={item.id}>
                            <p>
                                {item.size}
                            </p>
                            <p>
                                {item.quantity}
                            </p>
                            <Input placeholder='New Quantity' width={"w-1/5"}
                                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                value={updatedQuantities.find(q => q.id === item.id)?.quantity || ""} />
                        </div>
                    ))}
                </div>
            </div>}

            <Button text={"Update the product"} onClick={SubmitUpdate} />

        </div>
    )
}

export default AdminEdit
