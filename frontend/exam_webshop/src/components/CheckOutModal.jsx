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
        <div className='w-3/4 h-3/4 rounded-md shadow-lg mx-auto p-2 bg-gray-300'>
            {currentCheckout === 'delivery' ?
                <div className='flex flex-col justify-center'>
                    <CheckoutDelivery delivery={delivery} setDelivery={setDelivery} />
                    <Button onClick={changeLayout} text='Payment' my='mx-auto' width='w-2/3' />
                </div>
                :
                <div className='flex flex-col justify-center'>
                    <CheckoutPayment payment={payment} setPayment={setPayment} />
                    <Button onClick={changeLayout} text='Delivery' my='mx-auto' width='w-2/3' />
                </div>
            }
            <Button text='Set Info' width='w-[30%]' my='block' onClick={handleCheckOut} />

        </div>
    )
}

export default CheckOutModal
