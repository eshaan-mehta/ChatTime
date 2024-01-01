import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import clsx from 'clsx';

import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useChatContext } from '../Context/ChatProvider';

const Login = () => {
  const { setUser } = useChatContext();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!email || !password) {
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        "Content-type": "application/json"
      },
    };

    axios.post(
      "http://192.168.1.3:8080/api/user/login",
      {
        email,
        password
      },
      config
    )
    .then((response) => {
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      setLoading(false);
      setUser(response.data)
      navigate('/chats');
    })
    .catch((error) => {
      setLoading(false);
      console.log(error)
      setErrorMessage(error.response.data.error); // narrowed down from console logs
    })
    
  }

  return (
    <div className='flex flex-wrap w-full md:flex-nowrap p-2 '>
      <form className='w-full px-5 justify-center flex-col mb-5' onSubmit={(e) => handleSubmit(e)}>
        

        <input 
          id="Email"
          className='h-[3rem] rounded-[0.55rem] border-2 border-primary bg-white pl-3 w-full mb-10'
          type='email'
          required
          placeholder={"Email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <div className={clsx('relative items-center', {[`mb-${errorMessage? '3' : '10'}`] : true })}>
          <input 
            id="Password"
            className='h-[3rem] rounded-[0.55rem] border-2 border-primary bg-white pl-3 w-full '
            type={showPassword? 'text': 'password'}
            required
            placeholder={"Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="button" onClick={() => setShowPassword(!showPassword)} className='absolute right-4 text-xl top-[0.875rem]'>
            {showPassword ? (<FaEyeSlash />) : (<FaEye />)}
          </button>
        </div>

        {errorMessage && 
        <h1 className='text-center mb-5 text-red-500 font-medium'>
          {errorMessage}  
        </h1>}

        <div className='flex flex-wrap justify-center gap-5'>
          <button 
            type='submit'
            disabled={loading}
            className='bg-primary text-white font-bold p-3 rounded-2xl w-[15rem] hover:scale-105 transition-all'
          >
            Log In
          </button>
          <button 
            type='button'
            className='bg-none border-[2.5px] border-red-500 text-red-500 font-bold p-3 rounded-2xl w-[15rem] hover:scale-105 transition-all'
            onClick={() => {
              setEmail("guest@test.com");
              setPassword("123123")
              setShowPassword(true)
            }}
          >
            Use Guest
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login;
