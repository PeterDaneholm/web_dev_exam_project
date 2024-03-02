import React, { useState } from 'react'
import { FaRegUserCircle } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { Link, Route } from 'react-router-dom';
import Cookies from 'js-cookie';


const Navbar = () => {
    const [profileOpen, setProfileOpen] = useState(false)
    const [productCartOpen, setProductCartOpen] = useState(false)

    return (
        <div className='sticky bg-orange-100 h-20 w-full flex flex-row justify-between'>
            <Link to={'/shop'}>
                <h1 className='my-4 ml-4 text-2xl w-[30%]'>WebShop Name</h1>
            </Link>


            <div className='flex flex-row justify-evenly w-[30%] float-end items-center'>
                <div className='relative inline-block'>
                    <button onClick={() => setProductCartOpen(!productCartOpen)}>
                        <FaCartShopping />
                    </button>
                    {productCartOpen ?
                        <div className='absolute bg-slate-100 w-32 flex h-44 p-2 '>
                            Hello
                        </div>
                        : ''}
                </div>

                <div className='relative inline-block'>
                    <button onClick={() => setProfileOpen(!profileOpen)}>
                        <FaRegUserCircle />
                    </button>
                    {profileOpen ?
                        <div className='absolute top-full left-0 w-16 bg-slate-400'>
                            <div className='flex flex-col'>
                                <Link to={'/profile/zach'}>
                                    Profile
                                </Link>
                                <Link to={'/admin'}>
                                    Admin
                                </Link>
                                <Link to={'/logout'}>
                                    Sign Out
                                </Link>
                            </div>
                        </div>
                        :
                        ''}
                </div>
            </div>
        </div>
    )
}

export default Navbar
