import { Button } from '@nextui-org/react';
import React from 'react'
import { Link } from 'react-router-dom';

const LandingPage = () => {
  
  return (
    <div className='h-screen w-screen flex justify-center relative items-center'>
      <div className='absolute'>
        <h1 className=' font-semibold text-primary mt-[-16rem] text-8xl text-center'>Only Chats</h1>
        <h2 className='text-white mt-6 text-2xl text-center'>Message others and nothing else</h2>
      </div>

      <div className='flex justify-center gap-8 text-white text-center items-center font-bold mt-5'>
        <Link to="/login" className='border  rounded-[0.6rem] p-3 w-[10rem] bg-primary hover:scale-[1.07] transition-all'>Login</Link>
        <Link to="sign-up" className='border rounded-[0.6rem] p-3 w-[10rem] hover:scale-[1.07] transition-all'> Sign Up</Link>
      </div>
      
      
    </div>
  )
}

export default LandingPage;
