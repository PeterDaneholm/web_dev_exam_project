import React from 'react'
import { useEffect, useState, useContext } from 'react'
import api from '../api'
import { useParams } from 'react-router-dom'
import { CartContext } from '../components/CartContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast/ToastContext'


const ProductPage = () => {
    const [product, setProduct] = useState({});
    const [currentSize, setCurrentSize] = useState({})
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate()
    const { showToast } = useToast()

    useEffect(() => {
        const getProduct = async () => {
            const response = await api.get(`/products/${id}`)
            //console.log("response, ", response)

            setProduct(response.data)
        }

        getProduct()
    }, [id])

    const AddProduct = (e) => {
        if (currentSize.quantity === 0) {
            showToast("Could not add since it's sold out", 'warning')
        } else {
            const toCart = { ...product, size: [currentSize] }
            console.log(toCart)
            addToCart(toCart)
            navigate("/shop")
            showToast('Added to Cart', 'success')
        }
    }

    return (
        <div>
            <h2>{product.name}</h2>
            <h3>{product.price}</h3>
            <p>{product.description}</p>

            <div>
                {product.size && Object.values(product.size).map((item) =>
                    <button onClick={() => setCurrentSize(item)}
                        key={item.id}>{item.size}: {item.quantity} in stock</button>
                )}
            </div>

            <button onClick={AddProduct}>Add to Cart</button>
        </div>
    )
}

export default ProductPage
