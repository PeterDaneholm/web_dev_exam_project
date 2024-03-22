import React from 'react'
import { useState, useEffect } from 'react'
import Button from './basicelements/Button'
import CheckoutDelivery from './Forms/CheckoutDelivery'
import CheckoutPayment from './Forms/CheckoutPayment'

const CheckOutModal = () => {
    const [delivery, setDelivery] = useState({

    })
    const [payment, setPayment] = useState({

    })

    const [currentCheckout, setCurrentCheckout] = useState('delivery')
    const changeLayout = () => {
        currentCheckout === 'delivery' ? setCurrentCheckout('payment') : setCurrentCheckout('delivery')
    }

    const submitDelivery = () => {

    }

    const submitPayment = () => {

    }

    return (
        <div>
            {currentCheckout === 'delivery' ?
                <div>
                    <CheckoutDelivery />
                    <button onClick={changeLayout}>Switch</button>
                </div>
                :
                <div>
                    <CheckoutPayment />
                    <button onClick={changeLayout}>Switch</button>
                </div>
            }

        </div>
    )
}

export default CheckOutModal
