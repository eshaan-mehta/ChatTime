import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const Login = () => {

  const [email, setEmail] = useState();

  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    
  }

  return (
    <div className='flex flex-wrap w-full md:flex-nowrap p-2 '>
      <form className='w-full px-5 justify-center flex-col mb-5'>
        

        <input 
          id="Email"
          className='h-[3rem] rounded-[0.55rem] border-2 border-primary pl-3 w-full mb-10'
          type='email'
          required
          placeholder={"Email"}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <div className='relative items-center mb-12'>
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



        <div className='flex justify-center'>
          <button 
            type='submit'
            onClick={handleSubmit}
            disabled={false}
            className='bg-primary text-white font-bold p-3 rounded-2xl w-[15rem] hover:scale-105 transition-all'
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login;
