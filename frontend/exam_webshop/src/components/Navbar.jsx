import React, { useState } from 'react'
import { FaRegUserCircle } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { Link, Route } from 'react-router-dom';


const Navbar = () => {
    const [profileOpen, setProfileOpen] = useState(false)
    const [productCartOpen, setProductCartOpen] = useState(false)

    return (
        <div className='absolute bg-orange-100 h-20 w-full flex flex-row'>
            <Link to={'/'}>
                <h1 className='my-4 ml-4 text-2xl w-[30%]'>WebShop Name</h1>
            </Link>


            <div className='flex flex-row justify-evenly w-[30%] float-end items-center'>
                <button onClick={() => setProfileOpen(!profileOpen)}>
                    <FaRegUserCircle />
                </button>
                {profileOpen ? '' : ''}

                <button onClick={() => setProductCartOpen(!productCartOpen)}>
                    <FaCartShopping />
                </button>
                {productCartOpen ? '' : ''}
            </div>
        </div>
    )
}

export default Navbar
