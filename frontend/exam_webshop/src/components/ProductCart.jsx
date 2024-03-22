import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { CartContext } from './CartContext'
import { Link } from 'react-router-dom'
import Button from './basicelements/Button'

const ProductCart = ({ user }) => {
    const { cart, removeFromCart } = useContext(CartContext)

    return (
        <div className='absolute right-0 bg-contrast flex flex-col h-auto p-2 px-4 w-auto gap-2 z-50 rounded-md shadow-md '>
            {cart.map((item, index) =>
                <div key={index}
                    className='border-b-2 w-full ' >
                    {item.name}
                    {item.price}
                    <Button key={index} text="Remove" onClick={() => removeFromCart(item)} width='w-full' />
                </div>
            )}

            <h4>Total:</h4>

            <Link to={"/checkout"} className='rounded-lg bg-white border-[2px] border-gray-300 py-1 px-2 shadow-sm hover:bg-gray-300'>
                Checkout
            </Link>
        </div>
    )
}

export default ProductCart
