import React from 'react'
import { useState } from 'react'
import Button from './basicelements/Button'
import CheckoutDelivery from './Forms/CheckoutDelivery'
import CheckoutPayment from './Forms/CheckoutPayment'
import { verify_checkout } from '../utilities/checkout_requirements'
import { useToast } from './Toast/ToastContext'

const CheckOutModal = ({ readyToOrder, setReadyToOrder }) => {
    const { showToast } = useToast();
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
        if (!verify_checkout(delivery, payment)) {
            showToast("Missing Delivery Address or Payment Information", "fail")
        } else {
            setReadyToOrder(true);
        }
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
