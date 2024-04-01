import React from 'react'
import Input from '../basicelements/Input'

const CheckoutPayment = ({ payment, setPayment }) => {


    const submitPayment = (e) => {
        e.preventDefault();

    }

    const handleChange = (e) => {
        setPayment((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    return (
        <div>
            <h3>Enter your payment Details here!</h3>
            <form className='gap-2 flex flex-col'>
                <Input type="number" name="card_number" placeholder='Card Number' onChange={handleChange} value={payment.card_number} />

                <Input type="number" name="expiration_date" placeholder='Expiration Date' onChange={handleChange} value={payment.expiration_date} />

                <Input type="number" name="security_digits" placeholder='Security Digits' onChange={handleChange} value={payment.security_digits} />

                <Input type="text" name="card_name" placeholder='Card Name' onChange={handleChange} value={payment.card_name} />
            </form>
        </div>
    )
}

export default CheckoutPayment
