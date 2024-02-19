import React from 'react'
import { FaRegUserCircle } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";


const Navbar = () => {
    return (
        <div className='absolute bg-orange-100 h-20 w-full flex flex-row'>
            <h1 className='my-4 ml-4 text-2xl w-[70%]'>WebShop Name</h1>

            <div className='flex flex-row justify-evenly w-[30%] float-end items-center'>
                <FaRegUserCircle />
                <FaCartShopping />
            </div>
        </div>
    )
}

export default Navbar
