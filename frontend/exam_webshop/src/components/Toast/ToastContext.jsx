import React, { createContext, useContext, useState } from 'react'
import Toast from './Toast';


const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ label: "", status: "" })

    const showToast = (label, status) => {
        setToast({ label, status });
    }

    const closeToast = () => {
        setToast({ label: "", status: "" })
    }

    return (
        <ToastContext.Provider value={{ showToast, closeToast }}>
            {children}
            {toast.status && <Toast label={toast.label} status={toast.status} closeToast={closeToast} />}
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context == undefined) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context;
}
