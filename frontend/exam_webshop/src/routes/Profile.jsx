import React, { useState } from 'react'
import { useEffect } from 'react'
import api from '../api'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/basicelements/Button'
import Input from '../components/basicelements/Input'

const Profile = () => {
    const { slug } = useParams()
    const [user, setUser] = useState()
    const [newPassword, setNewPassword] = useState({
        oldPassword: "",
        newPassword: "",
        validateNewPassword: ""
    })
    const navigate = useNavigate()

    useEffect(() => {
        const CheckLoggedIn = async () => {
            const response = await api.get(`/users/${slug}`, {
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

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const response = await api.put(`/users/${user.id}/change-password`, newPassword, {
            withCredentials: true
        });
        console.log(response.data)
        setNewPassword({
            oldPassword: "",
            newPassword: "",
            validateNewPassword: ""
        })

    }

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

                    <div>
                        <h3>Change Password</h3>
                        <form onSubmit={handlePasswordSubmit} className='gap-2'>
                            <Input type="password" placeholder='Enter New Password' value={newPassword.password} onChange={() => setNewPassword(e.target.value)} />
                            <Input type="password" placeholder='Validate Password' value={newPassword.validatePassword} onChange={() => setNewPassword(e.target.value)} />
                            <Button text='Change your password' />
                        </form>
                    </div>

                    <div className='flex flex-col m-2'>
                        <h3 className='text-xl font-bold'>Your orders</h3>
                        <p>Total Orders: {user.orders.length}</p>
                        <div>
                            {user.orders.map((order, index) => {
                                return <div key={index}>
                                    Total: {order.total}
                                    Order date: {order.order_date}

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
