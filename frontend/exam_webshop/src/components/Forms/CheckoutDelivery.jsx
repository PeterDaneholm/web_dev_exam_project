import React from 'react'
import Input from '../basicelements/Input'


const CheckoutDelivery = ({ delivery, setDelivery }) => {

    const submitDelivery = (e) => {
        e.preventDefault();

    }

    const handleChange = (e) => {
        setDelivery((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    return (
        <form action={submitDelivery}>
            <Input type="text" name="street_name" placeholder='Street' onChange={handleChange} value={delivery.street_name} />

            <Input type="text" name="street_number" placeholder='Street Number' onChange={handleChange} value={delivery.street_number} />

            <Input type="text" name="city" placeholder='City' onChange={handleChange} value={delivery.city} />

            <Input type="number" name="zip_code" placeholder='Zip Code' onChange={handleChange} value={delivery.zip_code} />

            <Input type="text" name="country" placeholder='Country' onChange={handleChange} value={delivery.country} />
        </form>
    )
}

export default CheckoutDelivery
