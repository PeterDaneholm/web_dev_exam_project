import React, { useEffect } from 'react'

const Toast = ({ label, status, closeToast }) => {

    useEffect(() => {
        const timer = setTimeout(closeToast, 5000);
        return () => clearTimeout(timer)
    }, [closeToast])

    const bgColor = (status) => {
        switch (status) {
            case 'success':
                return 'bg-green-500';
            case 'fail':
                return 'bg-red-500';
            default:
                return 'bg-slate-300';
        }
    }

    const autoClose = () => {

    }

    return (
        <div className={`${bgColor(status)} bg-opacity-90
        absolute w-56 h-12 rounded-md text-lg my-auto flex items-center justify-center float-left top-36 right-12 z-20 border-2 border-gray-500 animate-fade-in-out`}
        >
            {label}
        </div>
    )
}

export default Toast
