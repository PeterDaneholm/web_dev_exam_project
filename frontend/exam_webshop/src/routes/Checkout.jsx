import React from 'react'
import { CartContext } from '../components/CartContext'
import { useContext, useEffect, useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { isUserLoggedIn } from '../utilities/get_user'
import { useToast } from '../components/Toast/ToastContext'
import Button from '../components/basicelements/Button'
import CheckOutModal from '../components/CheckOutModal'



const Checkout = () => {
    const { cart, removeFromCart, addUser } = useContext(CartContext)
    const [user, setUser] = useState("")
    const navigate = useNavigate()
    const { showToast } = useToast()
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
        const order = { products: cart, total: getTotal(cart), customer_id: user }
        console.log("order: ", order)
        const response = await api.post("/neworder", order,
            {
                withCredentials: true,
            })
        console.log(response)
        if (response.status === 200) {
            showToast('Order placed', 'success')
        } else {
            showToast('Could not place order', 'fail')
        }
        cart.forEach(item => {
            removeFromCart(item)
        });
        navigate("/shop")
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

                            <Button text='Remove from Cart' onClick={() => removeFromCart(item)} />
                        </div>
                    )}

                    <Button text='Make the Order!' onClick={handleSubmit} />

                    <CheckOutModal />
                </div>
            }

        </div >
    )
}

export default Checkout
