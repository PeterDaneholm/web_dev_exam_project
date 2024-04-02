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
    const [readyToOrder, setReadyToOrder] = useState(false)
    const [user, setUser] = useState("")
    const navigate = useNavigate()
    const { showToast } = useToast()

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
        if (readyToOrder) {
            const products = cart.map((item) => item.id)
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
    }

    return (
        <div>
            {cart.length === 0 ?
                <div>
                    You cannot buy anything if there's nothing in your cart :/
                </div>
                :
                <div>
                    <h2 className='text-lg font-semibold text-center m-2'>In your Shopping Cart</h2>
                    <div className='flex flex-row flex-wrap'>
                        {cart.map((item) => <>
                            <div key={item.id} className='h-1/4 m-2 border-2 rounded-md px-2 w-[280px]'>
                                <h3 className='text-lg'>{item.name}</h3>
                                {item.size.map((size) => <div className='flex flex-row'>
                                    <div className='flex flex-col'>
                                        <h4>Size: {size.size} </h4>
                                        <h4 >Quantity: {size.quantity}</h4>
                                    </div>
                                    <Button text='Remove from Cart' onClick={() => removeFromCart(item)} width='w-1/2' my='inline' />
                                </div>)}

                            </div>
                        </>
                        )}
                    </div>

                    <CheckOutModal readyToOrder={readyToOrder} setReadyToOrder={setReadyToOrder} />

                    {readyToOrder && <Button text='Make the Order!' onClick={handleSubmit} my='my-8 mx-[16%]' width='w-2/3' />}
                </div>
            }

        </div >
    )
}

export default Checkout
