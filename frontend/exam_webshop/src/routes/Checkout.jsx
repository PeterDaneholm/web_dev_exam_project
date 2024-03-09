import React from 'react'
import { CartContext } from '../components/CartContext'
import { useContext, useEffect } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { isUserLoggedIn } from '../utilities/get_user'


const Checkout = () => {
    const { cart, removeFromCart } = useContext(CartContext)
    const navigate = useNavigate()
    console.log("cart", cart)

    useEffect(() => {
        isUserLoggedIn(navigate)
    }, [])

    return (
        <div>
            <h2>In your Shopping Cart</h2>

            <div>
                {cart.map((item) =>
                    <div key={item.id}>
                        <h3>{item.name}</h3>

                        <h4></h4>

                        <button onClick={() => removeFromCart(item)}>
                            Remove from cart</button>
                    </div>
                )}
            </div>

        </div >
    )
}

export default Checkout
