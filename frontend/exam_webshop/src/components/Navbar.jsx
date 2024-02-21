import React, { useState } from 'react'
import { FaRegUserCircle } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { Link, Route } from 'react-router-dom';


const Navbar = () => {
    const [profileOpen, setProfileOpen] = useState(false)
    const [productCartOpen, setProductCartOpen] = useState(false)

    return (
        <div className='absolute bg-orange-100 h-20 w-full flex flex-row justify-between'>
            <Link to={'/'}>
                <h1 className='my-4 ml-4 text-2xl w-[30%]'>WebShop Name</h1>
            </Link>


            <div className='flex flex-row justify-evenly w-[30%] float-end items-center'>
                <div className='flex flex-col'>
                    <button onClick={() => setProfileOpen(!profileOpen)}>
                        <FaRegUserCircle />
                    </button>
                    {profileOpen ? <div className='sticky bg-slate-400 w-24 h-20 text-center -bottom-5 -left-1'>
                        <Link to={'/profile/zach'}>
                            Profile
                        </Link>
                    </div>
                        : ''}
                </div>

                <div className='flex flex-col'>
                    <button onClick={() => setProductCartOpen(!productCartOpen)}>
                        <FaCartShopping />
                    </button>
                    {productCartOpen ? <div className='absolute bg-slate-100 w-32 flex h-44 p-2'>
                        Hello
                    </div> : ''}
                </div>
            </div>
        </div>
    )
}

export default Navbar
