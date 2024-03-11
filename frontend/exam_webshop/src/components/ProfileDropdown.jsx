import React from 'react'
import { Link } from 'react-router-dom'


const ProfileDropdown = ({ user }) => {


    return (
        <div className='flex flex-col'>
            <Link to={`/profile/${user}`}>
                Profile
            </Link>
            <Link to={'/admin'}>
                Admin
            </Link>
            <Link to={'/signout'}>
                Sign Out
            </Link>
        </div>
    )
}

export default ProfileDropdown
