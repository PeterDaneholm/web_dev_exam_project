import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MdOutlineDashboard } from "react-icons/md";
import { FaBasketShopping } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import api from '../api';
import { onAdminRouteLoad } from '../utilities/get_user';
import { useNavigate } from 'react-router-dom'


const Admin = () => {
    const [users, setUsers] = useState([])
    const [orders, setOrders] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        onAdminRouteLoad(navigate)

        const fetchUsers = async () => {
            const response = await api.get("/users/", {
                withCredentials: true,

            })
            //console.log(response)
            setUsers(response.data)
        }
        fetchUsers()

        const getOrders = async () => {
            const response = await api.get("/orders", {
                withCredentials: true,
            })
            setOrders(response.data)
        }
        getOrders()

    }, [])


    return (
        <div className='flex flex-row'>
            <div className='bg-gray-200 sticky h-screen w-44 mr-4 p-2 gap-4 max-w-screen'>
                <ul className='mt-12 gap-2 grid text-xl'>
                    <li><MdOutlineDashboard className='inline' /> Dashboard</li>
                    <li><FaBasketShopping className='inline' /> Products</li>
                    <li><FaUsers className='inline' /> Users</li>
                </ul>

            </div>

            <div className='m-6 p-3 bg-slate-200 w-screen h-auto rounded-xl shadow-sm'>

                <Link to={"uploadproduct"}>Upload</Link>
            </div>

        </div>
    )
}

export default Admin
