import React from 'react'
import { Link } from 'react-router-dom'


const ProfileDropdown = ({ user, role }) => {

    return (
        <div className='flex flex-col p-1 shadow-inner'>
            <Link to={`/profile/${user}`}>
                Profile
            </Link>
            {role === "admin" ?
                <Link to={'/admin'}>
                    Admin
                </Link>
                :
                ""
            }
            <Link to={'/signout'}>
                Sign Out
            </Link>
        </div>
    )
}

export default ProfileDropdown
