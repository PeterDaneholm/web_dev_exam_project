import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { CartContext } from './CartContext'
import { Link } from 'react-router-dom'

const ProductCart = ({ user }) => {
    const { cart, removeFromCart } = useContext(CartContext)

    return (
        <div className='absolute bg-slate-100 flex flex-col h-44 p-2 w-auto gap-2 z-50'>
            {cart.map((item, index) =>
                <div key={index}
                    className='border-b-2 w-full ' >
                    {item.name}
                    {item.price}
                </div>
            )}

            <h4>Total:</h4>

            <Link to={"/checkout"}>
                Checkout
            </Link>
        </div>
    )
}

export default ProductCart
