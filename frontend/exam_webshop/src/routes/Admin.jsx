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
    console.log(orders)


    function isActive(page) {
        return activeSubPage === page ? "bg-contrastdark w-full " : ""
    }


    return (
        <div className='flex flex-row justify-between h-full'>
            <div className='bg-primary sticky h-[66%] w-44 mr-4 gap-4 rounded-b-2xl'>

                <ul className='mt-12 gap-2 grid text-xl'>
                    <li className={`${isActive("dashboard")} pl-2 hover:cursor-pointer hover:bg-contrast`} onClick={() => setActiveSubPage('dashboard')}>
                        <MdOutlineDashboard className='inline' /> Dashboard</li>
                    <li className={`${isActive("products")} pl-2 hover:cursor-pointer hover:bg-contrast`} onClick={() => setActiveSubPage("products")}>
                        <FaBasketShopping className='inline' /> Products</li>
                    <li className={`${isActive("orders")} pl-2 hover:cursor-pointer hover:bg-contrast`} onClick={() => { setActiveSubPage("orders") }}>
                        <RiBillLine className='inline' /> Orders</li>
                    <li className={`${isActive("users")} pl-2 hover:cursor-pointer hover:bg-contrast`} onClick={() => setActiveSubPage("users")}>
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
    return <div>
        <h3>All Products</h3>
        {content.map(item => <div key={item.id}>
            {item.name}

            <Link to={`product/${item.id}`}>
                <MdEditSquare />
            </Link>

        </div>)}
    </div>
}
function Users({ content }) {
    return <div>
        <h3>Total Users</h3>
        <h4>{content.length}</h4>

        <div>
            {content.map((item) => (
                <div key={item.id}>
                    {item.username}
                </div>
            ))}
        </div>

    </div>
}
function Orders({ content }) {
    return <>
        {content.map(item => (
            <div key={item.id}>
                {item.total}
            </div>
        ))}
    </>
}
export default Admin
