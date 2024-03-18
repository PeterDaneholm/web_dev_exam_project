import React, { useEffect } from 'react'
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { PiWarningOctagonBold } from "react-icons/pi";
import { FaRegCircleXmark } from "react-icons/fa6";



const Toast = ({ label, status, closeToast }) => {
    let icon = null;

    useEffect(() => {
        const timer = setTimeout(closeToast, 5000);
        return () => clearTimeout(timer)
    }, [closeToast])

    const bgColor = (status) => {
        switch (status) {
            case 'success':
                icon = <IoMdCheckmarkCircleOutline />
                return 'bg-green-500';
            case 'fail':
                icon = <FaRegCircleXmark />
                return 'bg-red-500';
            case 'warning':
                icon = <PiWarningOctagonBold />
                return 'bg-orange-500';
            default:
                return 'bg-slate-300';
        }
    }

    return (
        <div className={`${bgColor(status)} bg-opacity-90
        absolute w-56 h-12 rounded-md text-lg my-auto flex items-center float-left top-36 right-12 z-20 border-2 border-gray-500 animate-fade-in-out`}
        >
            <span className='ml-2'>{icon}</span>
            <span className='ml-4'>{label}</span>
        </div>
    )
}

export default Toast
