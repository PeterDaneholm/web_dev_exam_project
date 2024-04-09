import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { CartContext } from './CartContext'
import Button from './basicelements/Button'
import Image from './basicelements/Image'

const ProductCardSmall = ({ category_id, name, price, description, size, image_id, id, on_sale }) => {
    const navigate = useNavigate()
    const { addToCart } = useContext(CartContext)

    const redirectToProduct = () => {
        navigate(`/shop/${id}`)
    }

    return (
        <div className='h-[380px] max-h-[450px] w-[200px] m-2 p-2 rounded-md flex flex-col justify-between overflow-auto'>
            <div onClick={redirectToProduct}>
                <Image source={image_id[0].url} width="max-w-[180px]" height='max-h-[240px]' styles={'mx-auto'} />
                <h3 className='mt-2 text-lg font-semibold text-center'>{name}</h3>

                <p className='text-center'>{price} EUR</p>

            </div>
            <Button text="See Product" onClick={redirectToProduct}
                my='ml-[10%]' />
        </div>
    )
}

export default ProductCardSmall
