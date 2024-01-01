import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import { useChatContext } from '../Context/ChatProvider'
import ChatPreview from '../Components/ChatPreview';

const ChatsPage = () => {
  const { user, setUser } = useChatContext();
  const navigate = useNavigate()

  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState()
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState([]);

  const fetchData = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }
    
    axios.get("http://localhost:8080/api/chats", config)
    .then((response) => {
      setChats(response.data);

      if (response.data) {
        setActiveChat(response.data[0])
      }
    })

  }

  const searchUser = async (keyword) => {
    
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }
    axios.get(`http://localhost:8080/api/user?search=${keyword}`, config)
    .then((response) => {
      setSearchedUsers(response.data)
      setIsSearchingUser(true);
    })
  }


  const accessChat = () => {

  }

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    } else {
      fetchData()
    }
    
  }, [])

  const handleClick = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
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
        <div className='w-[30%] h-full rounded-xl bg-none bg-light px-[0.35rem] relative'>
          <div className='flex justify-center mt-2  bg-gray-200 rounded-t-lg'>
            <h1 className='text-3xl font-medium text-primary px-3 py-2 '>
              My Chats
            </h1>
          </div>

          <div 
            onPointerLeave={() => setIsSearchingUser(false)}
            className='w-full relative '>
            <input 
              placeholder='Search Users'
              className='w-full h-10 mt-2 rounded-xl bg-gray-100 border border-black/30 pl-3 '
              onClick={() => setIsSearchingUser(true)}
              onChange={(e) => searchUser(e.target.value)}
              
            />

            {isSearchingUser && 
            <div className='absolute w-full min-h-[3rem] max-h-[12rem] bg-light p-1 border-[2.5px] border-primary/70 overflow-auto flex flex-col items-center shadow-l'>
              {searchedUsers.length > 0 ? searchedUsers.map((user, index) => (
                <div 
                  key={index} 
                  className='bg-gray-100 hover:bg-gray-200 mb-2 last:mb-0 py-2 pl-2 border border-black/30 rounded-lg w-full'
                  onClick={accessChat}
                >
                  <p className='text-gray-700 font-medium'>{user.name}</p>
                  <p className='text-gray-500 text-xs'>{user.email}</p>
                </div>)) : (
                <div className='pl-2 text-gray-700 text-md h-full'>
                  No Users Found
                </div>
                )  
              }
            </div>}
          </div>  

          {chats ? 
            (<div className='asbolute w-full mt-4 overflow-hidden'>
              {chats.map((chat, index) => (
                <ChatPreview chat={chat} key={index} isActive={activeChat._id === chat._id} setisActive={setActiveChat}/> 
              ))}
            </div>) : (
            <div>
              Start a new chat
            </div>
          )}
        </div>

        <div className='w-full h-full border rounded-xl bg-light'>
          {activeChat? (
            <div className='flex justify-center mt-1 mx-1 bg-gray-200 rounded-t-lg'>
              <h1 className='text-3xl font-medium text-gray-900 px-3 py-2 '>{activeChat.name}</h1>
            </div>
          ) : (
            <h2>
              No Active Chat
            </h2>
          )}
        </div>
      </div>}
    </div>
  )
}

export default ChatsPage;
