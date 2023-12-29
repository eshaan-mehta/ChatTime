import React from 'react'
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className='h-screen w-screen flex justify-center relative items-center'>
      <div className='fixed items-center top-[20%] w-[18rem] h-[18rem] blur-[20rem] bg-gray-400 rounded-full z-0' ></div>
      
      <div className='absolute z-10'>
        <h1 className=' font-semibold text-primary mt-[-16rem] text-7xl sm:text-8xl text-center'>Only Chats</h1>
        <h2 className='text-white mt-7 text-lg sm:text-2xl text-center'>Message others with no distractions</h2>
      </div>

      <div className='flex justify-center gap-8 text-white text-center items-center font-bold mt-[-4rem] sm:mt-4 z-10'>
        <Link to="/auth" className='rounded-[0.6rem] p-3 w-[10rem] bg-primary hover:scale-[1.07] transition-all'>Get Started</Link>
      </div>
      
      
    </div>
  )
}

export default LandingPage;
