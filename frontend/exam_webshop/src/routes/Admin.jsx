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
    const [activeSubPage, setActiveSubPage] = useState("dashboard")
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
                    <li className={activeSubPage === "dashboard" ? "bg-contrastdark" : ""} onClick={() => setActiveSubPage('dashboard')}>
                        <MdOutlineDashboard className='inline' /> Dashboard</li>
                    <li className={activeSubPage === "products" ? "bg-contrastdark" : ""} onClick={() => setActiveSubPage("products")}>
                        <FaBasketShopping className='inline' /> Products</li>
                    <li className={activeSubPage === "users" ? "bg-contrastdark" : ""} onClick={() => setActiveSubPage("users")}>
                        <FaUsers className='inline' /> Users</li>
                    <li>
                        <Link to={"uploadproduct"}>Upload</Link>
                    </li>
                </ul>
            </div>

            <div className='m-6 p-3 bg-slate-200 w-screen h-auto rounded-xl shadow-sm'>
                {activeSubPage === "dashboard" && <Dashboard />}
                {activeSubPage === "products" && <Products />}
                {activeSubPage === "users" && <Users />}

            </div>

        </div >
    )
}

function Dashboard() {
    return <div>Dashboard</div>
}
function Products() {
    return <div>Products</div>
}
function Users() {
    return <div>Users</div>
}

export default Admin
