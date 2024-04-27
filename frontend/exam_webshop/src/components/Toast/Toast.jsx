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
        absolute w-auto h-18 rounded-md text-lg my-auto p-3 flex items-center float-left top-36 right-12 z-20 border-2 border-black animate-fade-in-out`}
        >
            <span className='ml-1'>{icon}</span>
            <span className='ml-2'>{label}</span>
        </div>
    )
}

export default Toast
