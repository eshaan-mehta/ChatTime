import React from 'react'
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <div className='fixed top-2 left-3 p-3 font-semibold text-primary text-4xl'>
        <Link to='/'>Only Chats</Link>
    </div>
  )
}

export default Logo
