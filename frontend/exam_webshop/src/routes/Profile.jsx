import React, { useState } from 'react'
import { useEffect } from 'react'
import api from '../api'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/basicelements/Button'
import Input from '../components/basicelements/Input'
import { useToast } from '../components/Toast/ToastContext'


const Profile = () => {
    const { slug } = useParams()
    const [user, setUser] = useState()
    const [newPassword, setNewPassword] = useState({
        oldPassword: "",
        newPassword: "",
        validateNewPassword: ""
    })
    const navigate = useNavigate()
    const { showToast } = useToast();

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

    const handlePasswordSubmit = async (e) => {
        //e.preventDefault();
        const newPayload = { "id": user.id, "username": user.username, "old_password": newPassword.oldPassword, "new_password": newPassword.newPassword }
        const response = await api.put(`/users/${user.id}/change-password`, newPayload, {
            withCredentials: true
        });
        showToast("Password updated", "success")
        setNewPassword({
            oldPassword: "",
            newPassword: "",
            validateNewPassword: ""
        })
    }

    return (
        <>
            {user &&
                <div className='w-[90%] bg-primarydark rounded-md ml-[5%] p-3 mt-3 shadow-inner'>
                    <h2 className='text-2xl font-bold m-2 text-center mb-5'>Welcome back {user.username}</h2>

                    <div className='flex flex-row w-full justify-around'>
                        <div className='flex flex-col m-2 border-2 border-gray-500 p-6 rounded-md bg-gray-100'>
                            <h3 className='text-xl font-bold'>Your details</h3>
                            <p>Username: {user.username}</p>
                            <p>First name: {user.first_name}</p>
                            <p>Last name: {user.last_name}</p>
                            <p>Email: {user.email_address}</p>
                        </div>

                        <div className='w-[60%] border-2 border-gray-500 bg-white p-2 rounded-md'>
                            <h3 className='text-lg font-semibold text-center mb-5'>Change Password</h3>
                            <form onSubmit={handlePasswordSubmit} className='gap-2 mx-auto flex flex-col'>
                                <Input type="password" placeholder='Old Password' value={newPassword.oldPassword} onChange={(e) => setNewPassword({ ...newPassword, oldPassword: e.target.value })} />
                                <Input type="password" placeholder='Enter New Password' value={newPassword.newPassword} onChange={(e) => setNewPassword({ ...newPassword, newPassword: e.target.value })} />
                                <Input type="password" placeholder='Validate Password' value={newPassword.validateNewPassword} onChange={(e) => setNewPassword({ ...newPassword, validateNewPassword: e.target.value })} />
                                <Button text='Change your password' />
                            </form>
                        </div>
                    </div>

                    <div className='flex flex-col m-2 mt-8'>
                        <h3 className='text-2xl font-bold text-center'>Your orders</h3>
                        <p className='text-center'>Total Orders: {user.orders.length}</p>
                        <div className='mt-4 flex flex-row flex-wrap justify-around'>
                            {user.orders.map((order, index) => {
                                return <div key={index} className='w-2/5 border-2 rounded-lg m-2 p-3 border-gray-500 bg-gray-100 h-[250px] overflow-auto'>
                                    <p>
                                        Total: {order.total}
                                    </p>
                                    <p>
                                        Order date: {order.order_date}
                                    </p>
                                    <p className='mt-2'>
                                        Products in Order:
                                    </p>
                                    {order.products.map((product, index) => (
                                        <div key={index} className='my-2'>
                                            <p>{product.name}</p>
                                            <p>{product.price} EUR</p>
                                            <p>{product.description}</p>
                                        </div>
                                    ))}
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
