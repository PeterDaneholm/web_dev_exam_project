import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { CartContext } from './CartContext'

const ProductCart = () => {
    const { cart, removeFromCart } = useContext(CartContext)


    return (
        <div className='absolute bg-slate-100 flex flex-col h-44 p-2 w-auto'>
            {cart.map((item, index) =>
                <div key={index}
                    className='' >
                    {item.name}
                    {item.price}
                </div>
            )}

        </div>
    )
}

export default ProductCart
