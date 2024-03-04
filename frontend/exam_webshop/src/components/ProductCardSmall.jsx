import React from 'react'
import { useNavigate } from 'react-router-dom'


const ProductCardSmall = ({ category_id, name, price, description, size, id, on_sale }) => {
    const navigate = useNavigate()

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
            <button>Add to Cart</button>
        </div>
    )
}

export default ProductCardSmall
