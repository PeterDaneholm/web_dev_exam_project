import React from 'react'




const Button = ({
    bg = "bg-primarydark hover:bg-contrastdark",
    text = "Default text",
    width = "w-[70%]",
    key = "",
    my = "",
    onClick,
}) => {
    const baseClasses = "font-bold rounded-lg my-3 mx-auto shadow-md p-2"

    return (
        <button className={`${baseClasses} ${bg} ${width} ${my} `}
            onClick={onClick} key={key} >
            {text}
        </button>
    )
}

export default Button
