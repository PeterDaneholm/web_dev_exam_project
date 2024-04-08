import React from 'react'

const Image = ({
    source,
    styles,

}) => {
    return (
        <img src={`${source}`} className={`w-340px h-[520px] object-contain ${styles} rounded-lg`} />
    )
}

export default Image
