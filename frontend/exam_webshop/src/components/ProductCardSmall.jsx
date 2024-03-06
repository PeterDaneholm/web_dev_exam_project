import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { CartContext } from './CartContext'


const ProductCardSmall = ({ category_id, name, price, description, size, id, on_sale }) => {
    const navigate = useNavigate()
    const { cart, addToCart, removeFromCart } = useContext(CartContext)

    const redirectToProduct = () => {
        navigate(`/shop/${id}`)
    }

    return (
        <div className='h-auto w-44 bg-orange-200 m-2  p-2 border-blue-200 border-2 rounded-md shadow-sm'>
            <div onClick={redirectToProduct}>
                <h3>{name}</h3>
                <p>{description}</p>

                <p>{price} EUR</p>

            </div>
            <button onClick={() => addToCart({ id, name, price })}>Add to Cart</button>
        </div>
    )
}

export default ProductCardSmall
