import React, { useState, useEffect, useRef } from 'react'
import { FaRegUserCircle } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { Link, Route } from 'react-router-dom';
import ProductCart from './ProductCart';
import { useContext } from 'react';
import { CartContext } from './CartContext';
import api from '../api';


const Navbar = () => {
    const [user, setUser] = useState("")
    const [profileOpen, setProfileOpen] = useState(false)
    const [productCartOpen, setProductCartOpen] = useState(false)
    const profileRef = useRef()
    const productCartRef = useRef()
    const { cart } = useContext(CartContext)

    useEffect(() => {
        const getUser = async () => {
            const response = await api.get("/users/me", {
                withCredentials: true
            })
            setUser(response.data.username)
        }
        getUser()

        const handleOutsideClick = (event) => {
            if (!profileRef.current?.contains(event.target)) {
                setProfileOpen(false)
            }
            if (!productCartRef.current?.contains(event.target)) {
                setProductCartOpen(false)
            }
        }
        window.addEventListener('click', handleOutsideClick)

        return () => {
            window.removeEventListener('click', handleOutsideClick)
        }
    }, [])

    return (
        <div className='sticky bg-primary h-20 w-full flex flex-row justify-between'>
            <Link to={'/shop'}>
                <h1 className='my-2 ml-4 text-2xl w-[50%]'>Stuff n' Things</h1>
            </Link>

            {user !== "" ?
                <div className='flex flex-row justify-evenly w-[30%] float-end items-center'>
                    <div className='relative inline-block'>
                        <button onClick={() => setProductCartOpen(!productCartOpen)}
                            className='' ref={productCartRef}>
                            <FaCartShopping />
                            {cart.length == 0 ?
                                "" :
                                <div className='w-5 h-5 bg-red-500 rounded-xl absolute bottom-4 left-2'>{cart.length}</div>
                            }
                        </button>
                        {productCartOpen ? <>
                            <ProductCart />
                        </>
                            : ''}
                    </div>

                    <div className='relative inline-block'>
                        <button onClick={() => setProfileOpen(!profileOpen)}
                            className='' ref={profileRef}>
                            <FaRegUserCircle />
                        </button>
                        {profileOpen ?
                            <div className='absolute top-full left-0 w-16 bg-slate-400'>
                                <div className='flex flex-col'>
                                    <Link to={`/profile/${user}`}>
                                        Profile
                                    </Link>
                                    <Link to={'/admin'}>
                                        Admin
                                    </Link>
                                    <Link to={'/signout'}>
                                        Sign Out
                                    </Link>
                                </div>
                            </div>
                            :
                            ''}
                    </div>
                </div>
                :
                <div>
                    <Link to={"/signup"}>Sign Up</Link>
                    <Link to={"/login"}>Log In</Link>
                </div>
            }
        </div>
    )
}

export default Navbar
