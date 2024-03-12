import React from 'react'

const Input = ({
    type = "text",
    name = "name",
    value = "value",
    placeholder = "placeholder",
    width = "w-[70%]",
    bg = 'bg-white',
    onChange,
}) => {
    const baseClasses = 'mx-auto shadow-md rounded-lg text-center py-[2px]'

    return (
        <input type={type} className={`${baseClasses} ${width} ${bg}`}
            name={name} value={value} placeholder={placeholder} onChange={onChange} />
    )
}

export default Input
