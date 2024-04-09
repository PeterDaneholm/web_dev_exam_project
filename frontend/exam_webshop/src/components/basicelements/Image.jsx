import React from 'react'

const Image = ({
    source,
    styles,
    width = "w-[340px]",
    height = "h-[520px]"
}) => {
    return (
        <img src={`${source}`} className={`${width} ${height} object-contain ${styles} rounded-lg`} />
    )
}

export default Image
