import React from 'react'
import { useEffect, useState } from 'react'
import api from '../api'
import { useParams } from 'react-router-dom'


const ProductPage = () => {
    const [product, setProduct] = useState({})
    const { id } = useParams()

    useEffect(() => {
        const getProduct = async () => {
            const response = await api.get(`/products/${id}`)
            //console.log("response, ", response)

            setProduct(response.data)
        }

        getProduct()
    }, [id])
    //console.log(product)

    return (
        <div>
            <h2>{product.name}</h2>
            <h3>{product.price}</h3>
            <p>{product.description}</p>

            <div>

                {product.size && Object.values(product.size).map((item) => {
                    return <p key={item.id}>{item.size}: {item.quantity} in stock</p>
                }
                )
                }
            </div>

        </div>
    )
}

export default ProductPage
