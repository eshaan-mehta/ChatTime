import React, { useState } from 'react';

import { FaEye, FaEyeSlash } from "react-icons/fa6";

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confimPassword, setConfimPassword] = useState();
  const [pic, setPic] = useState();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const postDetails = (pic) => {

  }

  const handleSubmit = () => {

  }

  return (
    <div className='flex flex-wrap w-full md:flex-nowrap p-2 '>
      <form className='w-full px-5 justify-center flex-col mb-5'>
        <input 
          id="Name"
          className='h-[3rem] rounded-[0.55rem] border-2 border-primary pl-3 w-full mb-10'
          type='text'
          required
          placeholder={"Full Name"}
          onChange={(e) => setName(e.target.value)}
        />

        <input 
          id="Email"
          className='h-[3rem] rounded-[0.55rem] border-2 border-primary pl-3 w-full mb-10'
          type='email'
          required
          placeholder={"Email"}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <div className='relative items-center mb-10'>
          <input 
            id="Password"
            className='h-[3rem] rounded-[0.55rem] border-2 border-primary pl-3 w-full '
            type={showPassword? 'text': 'password'}
            required
            placeholder={"Password"}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="button" onClick={() => setShowPassword(!showPassword)} className='absolute right-4 text-xl top-[0.875rem]'>
            {showPassword ? (<FaEyeSlash />) : (<FaEye />)}
          </button>
        </div>

        <div className='relative items-center mb-7'>
          <input 
            id="ConfirmPassword"
            className='h-[3rem] rounded-[0.55rem] border-2 border-primary pl-3 w-full '
            type={showConfirmPassword? 'text': 'password'}
            required
            placeholder={"Confirm Password"}
            onChange={(e) => setConfimPassword(e.target.value)}
          />

          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className='absolute right-4 text-xl top-[0.875rem]'>
            {showConfirmPassword ? (<FaEyeSlash />) : (<FaEye />)}
          </button>
        </div>

        <div className='inline-block gap-4 items-center mb-6 w-full '>
          <h1 className='mb-2 font-semibold text-gray-900'>Profile Picture</h1>
          <input
            id="Pic"
            className='h-[3rem] border-2pl-3'
            type='file'
            accept='image/*'
            placeholder='Profile Picture'
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </div>

        <div className='flex justify-center'>
          <button 
            type='submit'
            onClick={handleSubmit}
            disabled={false}
            className='bg-primary text-white font-bold p-3 rounded-2xl w-[15rem] hover:scale-105 transition-all'
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  )
}

export default Signup;
