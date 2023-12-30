import React, { useEffect } from 'react'
import { useChatContext } from '../Context/ChatProvider'
import { useNavigate } from 'react-router-dom';

const Chats = () => {
  const { user, setUser } = useChatContext();
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [])

  return (
    <div className='w-screen h-screen'>
      <div className='w-screen h-[5rem] bg-gray-50'>

      </div>
    </div>
  )
}

export default Chats;
