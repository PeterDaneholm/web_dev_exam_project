import React, { useState } from 'react'
import { useEffect } from 'react'
import api from '../api'
import { useNavigate, useParams } from 'react-router-dom'

const Profile = () => {
    const { slug } = useParams()
    const [user, setUser] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        const CheckLoggedIn = async () => {
            const response = await api.get("/users/me", {
                withCredentials: true
            })
            if (slug === response.data.username) {
                setUser(response.data)
                return null
            } else {
                navigate("/shop")
                console.log("Not allowed")
            }
        }
        CheckLoggedIn()
    }, [])
    console.log(user)

    return (
        <>
            {user &&
                <div>
                    <h2 className='text-2xl font-bold m-2'>Welcome back {user.username}</h2>

                    <div className='flex flex-col m-2'>
                        <h3 className='text-xl font-bold'>Your details</h3>
                        <p>Username: {user.username}</p>
                        <p>First name: {user.first_name}</p>
                        <p>Last name: {user.last_name}</p>
                        <p>Email: {user.email_address}</p>
                    </div>

                    <div className='flex flex-col m-2'>
                        <h3 className='text-xl font-bold'>Your orders</h3>
                        <p>Total Orders: {user.orders.length}</p>
                        <div>
                            {user.orders.map((order, index) => {
                                return <div key={index}>
                                    Total: {order.total}
                                    Order date: {order.order_date}
                                    {/* Order_date is not being returned with the order through the user. */}
                                    Items:
                                    {/*                                     <ul>
                                        {order.items.map((item, index) => {
                                            return <li key={index}>
                                                Name: {item.name}
                                                Size: {item.size}
                                                Quantity: {item.quantity}
                                            </li>
                                        })}
                                    </ul> */}
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Profile
