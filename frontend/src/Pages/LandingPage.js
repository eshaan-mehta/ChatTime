import React from 'react'
import { Link } from 'react-router-dom';

import { FaExternalLinkAlt } from "react-icons/fa";

import Footer from "../Components/Footer";

const LandingPage = () => {
  return (
    <div className='h-screen w-screen flex justify-center relative items-center'>
      <div className='fixed items-center top-[20%] w-[18rem] h-[18rem] blur-[20rem] bg-gray-400 rounded-full z-0' ></div>
      
      <div className='absolute z-10'>
        <h1 className=' font-semibold text-primary mt-[-16rem] text-7xl sm:text-8xl text-center'>Only Chats</h1>
        <h2 className='text-white mt-7 text-lg sm:text-2xl text-center'>Message others, that's it</h2>
      </div>


      <div className='flex justify-center gap-8 text-white items-center  mt-[-4rem] sm:mt-4 z-10'>
        <Link to="/auth" className='rounded-[0.6rem] p-3 w-[10rem] text-center font-bold bg-primary hover:scale-[1.05] transition-all'>Get Started</Link>
        <Link to="/about" className='flex items-center gap-2 bg-none  hover:scale-[1.03] transition-all'>
          <span>About this site</span>
          <FaExternalLinkAlt  />
        </Link>
      </div>
      
      
      <Footer/>
    </div>
  )
}

export default LandingPage;
