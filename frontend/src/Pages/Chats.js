import React, { useEffect } from 'react'
import { useChatContext } from '../Context/ChatProvider'
import { useNavigate } from 'react-router-dom';

const Chats = () => {
  const { user } = useChatContext();
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  })

  const handleClick = () => {
    localStorage.removeItem("userInfo");
    navigate("/")
  }

  return (
    <div className='w-screen h-screen flex flex-col'>
      {user && <div className=' py-5 px-4 w-full h-max relative'>
        
        <div className='flex justify-center'>
          <h1 className='font-semibold text-primary text-4xl'> Only Chats </h1>
        </div>

        
        <div className='absolute top-0 right-4 w-auto h-full flex items-center gap-10'>
          <h2 className='text-white font-medium text-xl'>
            {user.name}
          </h2>

          <div
            onClick={handleClick} 
            className='bg-red-500 text-white py-2 px-3 rounded-lg cursor-pointer hover:scale-[1.02] transition'
          >
            Log Out
          </div>
        </div>
      </div>}

      {user && <div className='flex flex-grow px-3 w-full gap-4'>
        <div className='w-[30%] h-full border rounded-xl bg-none bg-light'>
          <div className='flex justify-center mt-1 mx-1 bg-gray-200 rounded-t-lg'>
            <h1 className='text-3xl font-medium text-primary px-3 py-2 '>
              My Chats
            </h1>
          </div>

          
        </div>

        <div className='w-full h-full border rounded-xl bg-light'>
        <div className='flex justify-center mt-1 mx-1 bg-gray-200 rounded-t-lg'>
            <h1 className='text-3xl font-medium text-gray-900 px-3 py-2 '>
              Chat Name
            </h1>
          </div>
        </div>
      </div>}
    </div>
  )
}

export default Chats;
