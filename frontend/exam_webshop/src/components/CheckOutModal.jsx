import React from 'react'
import { useState } from 'react'
import Button from './basicelements/Button'
import CheckoutDelivery from './Forms/CheckoutDelivery'
import CheckoutPayment from './Forms/CheckoutPayment'

const CheckOutModal = () => {
    const [delivery, setDelivery] = useState({
        street_name: "",
        street_number: 0,
        city: "",
        country: "",
        zip_code: "",
    })
    const [payment, setPayment] = useState({
        card_number: "",
        expiration_date: "",
        security_digits: "",
        card_name: "",
    })

    const [currentCheckout, setCurrentCheckout] = useState('delivery')
    const changeLayout = () => {
        currentCheckout === 'delivery' ? setCurrentCheckout('payment') : setCurrentCheckout('delivery')
    }

    const handleCheckOut = (e) => {
        e.preventDefault();

    }

    return (
        <div className='w-3/4 h-3/4 rounded-md shadow-lg'>
            {currentCheckout === 'delivery' ?
                <>
                    <CheckoutDelivery delivery={delivery} setDelivery={setDelivery} />
                    <button onClick={changeLayout}>Switch</button>
                </>
                :
                <>
                    <CheckoutPayment payment={payment} setPayment={setPayment} />
                    <button onClick={changeLayout}>Switch</button>
                </>
            }

            <Button onClick={handleCheckOut} />

        </div>
    )
}

export default CheckOutModal
