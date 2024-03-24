import React from 'react'
import Input from '../basicelements/Input'


const CheckoutDelivery = ({ delivery, setDelivery }) => {

    const submitDelivery = (e) => {
        e.preventDefault();

    }

    const handleChange = () => {

    }

    return (
        <form action={submitDelivery}>
            <Input placeholder='Street' onChange={handleChange} value={delivery.street_name} />

            <Input placeholder='Street Number' onChange={handleChange} value={delivery.street_number} />

            <Input placeholder='City' onChange={handleChange} value={delivery.city} />

            <Input placeholder='Zip Code' onChange={handleChange} value={delivery.zip_code} />

            <Input placeholder='Country' onChange={handleChange} value={delivery.country} />
        </form>
    )
}

export default CheckoutDelivery
