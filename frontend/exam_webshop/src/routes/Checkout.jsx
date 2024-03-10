import React from 'react'
import { CartContext } from '../components/CartContext'
import { useContext, useEffect, useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { isUserLoggedIn } from '../utilities/get_user'


const Checkout = () => {
    const { cart, removeFromCart, addUser } = useContext(CartContext)
    const [user, setUser] = useState("")
    const navigate = useNavigate()
    console.log("cart", cart)

    useEffect(() => {
        isUserLoggedIn(navigate)
        const getUser = async () => {
            const response = await api.get("/users/me", {
                withCredentials: true
            })
            setUser(response.data.id)
        }
        getUser()
    }, [])

    const getTotal = (cart) => {
        let total = 0
        for (let i = 0; i < cart.length; i++) {
            total = total + cart[i].price
        }
        return total
    }

    const uploadImages = async (e) => {

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const products = cart.map((item) => item.id
        )
        const order = { products: products, total: getTotal(cart), customer_id: user }
        console.log("order: ", order)
        const response = await api.post("/neworder", order,
            {
                withCredentials: true,
            })
        console.log(response)
    }

    return (
        <div>
            {cart.length === 0 ?
                <div>
                    You cannot buy anything if there's nothing in your cart :/
                </div>
                :
                <div>
                    <h2>In your Shopping Cart</h2>
                    {cart.map((item) =>
                        <div key={item.id}>
                            <h3>{item.name}</h3>

                            <h4></h4>

                            <button onClick={() => removeFromCart(item)}>
                                Remove from cart</button>
                        </div>
                    )}

                    <button onClick={handleSubmit}>
                        Make the Order!
                    </button>
                </div>
            }

        </div >
    )
}

export default Checkout
