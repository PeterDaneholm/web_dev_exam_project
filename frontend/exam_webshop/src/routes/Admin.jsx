import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MdOutlineDashboard } from "react-icons/md";
import { FaBasketShopping } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import api from '../api';
import { onAdminRouteLoad } from '../utilities/get_user';
import { useNavigate } from 'react-router-dom'
import { MdEditSquare } from "react-icons/md";
import { RiBillLine } from "react-icons/ri";


const Admin = () => {
    const [users, setUsers] = useState([])
    const [orders, setOrders] = useState([])
    const [products, setProducts] = useState([])
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
        const getOrders = async () => {
            const response = await api.get("/orders", {
                withCredentials: true,
            })
            setOrders(response.data)
        }
        const getProducts = async () => {
            const response = await api.get("/products", {
                withCredentials: true
            })
            setProducts(response.data)
        }

        fetchUsers()
        getOrders()
        getProducts()

    }, [])


    function isActive(page) {
        return activeSubPage === page ? "bg-contrastdark w-full " : ""
    }


    return (
        <div className='flex flex-row justify-between h-full'>
            <div className='bg-primary sticky h-[66%] w-44 mr-4 gap-4 rounded-b-2xl'>

                <ul className='mt-12 gap-2 grid text-xl'>
                    <li className={`${isActive("dashboard")} pl-2 py-1 hover:cursor-pointer hover:bg-contrast`} onClick={() => setActiveSubPage('dashboard')}>
                        <MdOutlineDashboard className='inline' /> Dashboard</li>
                    <li className={`${isActive("products")} pl-2 py-1 hover:cursor-pointer hover:bg-contrast`} onClick={() => setActiveSubPage("products")}>
                        <FaBasketShopping className='inline' /> Products</li>
                    <li className={`${isActive("orders")} pl-2 py-1 hover:cursor-pointer hover:bg-contrast`} onClick={() => { setActiveSubPage("orders") }}>
                        <RiBillLine className='inline' /> Orders</li>
                    <li className={`${isActive("users")} pl-2 py-1 hover:cursor-pointer hover:bg-contrast`} onClick={() => setActiveSubPage("users")}>
                        <FaUsers className='inline' /> Users</li>
                    <li className='pl-2 mt-5 hover:bg-contrast'>
                        <Link to={"uploadproduct"}>Upload New Product</Link>
                    </li>
                </ul>
            </div>

            <div className='m-2 p-3 bg-primarydark w-screen h-auto rounded-xl shadow-sm'>
                {activeSubPage === "dashboard" && <Dashboard />}
                {activeSubPage === "products" && <Products content={products} />}
                {activeSubPage === "orders" && <Orders content={orders} />}
                {activeSubPage === "users" && <Users content={users} />}

            </div>
        </div >
    )
}

function Dashboard({ }) {
    return <div>Dashboard
        Need to figure out what to put here :/
    </div>
}
function Products({ content }) {
    return <div className='overflow-auto max-h-full'>
        <h3 className='font-semibold text-xl'>All Products</h3>
        {content.map(item =>
            <div key={item.id} className='bg-white border-2 border-gray-600 rounded-md m-2 p-2 flex flex-row justify-evenly'>
                <div className='flex flex-col w-1/3'>
                    <p className='text-lg'>{item.name}</p>
                    <p>Price: {item.price} EUR</p>
                    <p>Category: {item.category_id}</p>
                </div>
                <div className='w-1/3'>{item.size.map(s =>
                    <div>
                        <p>Sizes: {s.size}</p>
                        <p>Current Stock: {s.quantity}</p>
                    </div>)}</div>

                <Link to={`product/${item.id}`}>
                    Edit <MdEditSquare />
                </Link>

            </div>)}
    </div>
}
function Users({ content }) {
    return <div className='overlow-auto max-h-full'>
        <div>
            <h4 className='text-xl font-semibold'>All Users</h4>
            {content.map((item) => (
                <div key={item.id} className='border-2 bg-white border-black rounded-md m-2 p-2 '>
                    <p>{item.username}</p>
                    <p>First Name: {item.first_name}, Last Name: {item.last_name}</p>
                    <p>Email address: {item.email_address}</p>

                </div>
            ))}
        </div>

    </div>
}
function Orders({ content }) {
    return <div className='overflow-auto max-h-full'>
        <h3 className='text-xl font-semibold'>All Orders</h3>
        {content.map(item => (
            <div key={item.id} className='border-2 rounded-md m-2 p-2 w-auto bg-white border-gray-600 shadow-sm '>
                <h4>Ordered by: {item.customer.username}</h4>
                <h4>First name: {item.customer.first_name}, Last name: {item.customer.last_name}</h4>
                <h4>Ordered on: {item.order_date}</h4>
                <h4> Order total: {item.total} EUR</h4>

            </div>
        ))}
    </div>
}
export default Admin
