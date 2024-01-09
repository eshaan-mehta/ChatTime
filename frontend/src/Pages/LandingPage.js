import React from 'react'
import { Link } from 'react-router-dom';

import { FaExternalLinkAlt } from "react-icons/fa";

import Footer from "../Components/Footer";

const LandingPage = () => {
  return (
    <div className='flex justify-center w-screen h-screen'>
      <div className='fixed items-center top-[20%] w-[18rem] h-[18rem] blur-[20rem] bg-gray-400 rounded-full z-0' ></div>
      
      <div className='z-10 flex flex-col justify-start gap-10'>
        <div>
          <h1 className='font-semibold text-center text-primary mt-[6rem] text-7xl sm:text-8xl'>ChatTime</h1>
          <h2 className='text-lg text-center text-white mt-7 sm:text-2xl'>Message others, that's it</h2>
        </div>
        
        
        <div className='z-10 flex items-center justify-center gap-8 text-white sm:mt-4'>
          <Link to="/auth" className='rounded-[0.6rem] p-3 w-[10rem] text-center font-bold bg-primary hover:scale-[1.05] transition-all'>Get Started</Link>
          <Link to="/about" className='flex items-center gap-2 bg-none  hover:scale-[1.03] transition-all'>
            <span>About this site</span>
            <FaExternalLinkAlt  />
          </Link>
        </div>
      </div>


      
      
      <Footer/>
    </div>
  )
}

export default LandingPage;
