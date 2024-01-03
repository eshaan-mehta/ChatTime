import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import clsx from 'clsx';

import { useChatContext } from '../Context/ChatProvider'

import { FaArrowCircleUp } from "react-icons/fa";
import MessageBubble from '../Components/MessageBubble';

const ChatsPage = () => {
  const { user, setUser } = useChatContext();
  const navigate = useNavigate()

  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState()
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState([]);

  const fetchChats = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }
    
    axios.get("http://localhost:8080/api/chats", config)
    .then((response) => {
      const allChats = response.data
      setChats(allChats);

      if (allChats && !activeChat) {
        setActiveChat(allChats[0])
        getMessages(allChats[0]._id)
      }
    })

  }

  const getMessages = async (chatId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }

    axios.get(`http://localhost:8080/api/messages/${chatId}`, config)
    .then((response) => {
      setMessages(response.data)
    })
    .catch((error) => {
      console.warn(error)
    })
  }

  const handlePreviewClick = (chat) => {
    if (chat._id !== activeChat._id) {
      //const otherUser = chat.members.find((u) => u._id !== user._id)
      setActiveChat(chat);
      getMessages(chat._id)
    } else {
      console.log("on active chat");
    }
    setIsSearchingUser(false);
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

  const validateChat = (u) => {
    const alreadyExistingChat = chats.find((c) => c.members.some((member) => member._id === u._id) > 0)

    if (alreadyExistingChat) {
      handlePreviewClick(alreadyExistingChat);
    } else {
      createChat(u);
    }
  }

  const createChat = async (u) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }

    axios.post("http://localhost:8080/api/chats", { userId: u._id, name: u.name }, config)
    .then((response) => {
      handlePreviewClick(response.data)
      setChats([response.data, ...chats])
      setMessages([])
    })
    .catch((error) => {
      console.warn(error)
    })
  }

  const sendMessage = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }

    axios.post("http://localhost:8080/api/messages", {
      chatRoomID: id,
      message: message
    }, config)
    .then((response) => {
      setMessages([response.data, ...messages])
      setMessage("")
    })
    .catch((error) => {
      console.warn(error)
    })
  }

  
  const handleLogoutClick = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/")
  }

  // on message send or new chat creation
  const updateChatOrder = (id) => {
    const index = chats.find((c) => c._id === id);

    if (index !== 0 || index !== -1) {
      const chat = chats.splice(index, 1)[0];
      chats.unshift(chat);
    }
  }
  
  useEffect(() => {
    console.log("rerendering")
    if (!user) {
      navigate("/auth");
    } else {
      fetchChats()
    }
    
  }, [activeChat, messages])


  return (
    <div className='w-screen h-screen flex flex-col'>
      {/* Nav Bar */}
      {user && <div className=' py-5 px-4 w-full h-max relative'>
        <div className='flex justify-center'>
          <h1 className='font-semibold text-primary text-4xl'> Only Chats </h1>
        </div>

        
        <div className='absolute top-0 right-4 w-auto h-full flex items-center gap-10'>
          <h2 className='text-white font-medium text-xl'>
            {user.name}
          </h2>

          {/* Logout Button */}
          <div
            onClick={handleLogoutClick} 
            className='bg-red-500 text-white py-2 px-3 rounded-lg cursor-pointer hover:scale-[1.02] transition'
          >
            Log Out
          </div>
        </div>
      </div>}

      {user && <div className='flex flex-grow px-3 pb-2 w-full gap-4 overflow-hidden'>
        {/* Search View */}
        <div className='w-[30%] h-full rounded-xl bg-none bg-light px-[0.35rem] relative overflow-hidden'>
          {/* My Chats Header */}
          <div className='flex justify-center mt-2  bg-gray-200 rounded-t-lg'>
            <h1 className='text-3xl font-medium text-primary px-3 py-2 '>
              My Chats
            </h1>
          </div>

          {/* User Search */}
          <div 
            onPointerLeave={() => setIsSearchingUser(false)}
            className='w-full relative '>
            <input
              placeholder='Search Users'
              className='w-full h-10 mt-2 rounded-lg bg-gray-100 border border-black/30 pl-3 '
              onClick={() => setIsSearchingUser(true)}
              onChange={(e) => searchUser(e.target.value)}
              
            />

            {isSearchingUser && 
            <div className='absolute w-full  max-h-[12rem] bg-light p-1 border-[2.5px] border-primary/70 overflow-auto flex flex-col items-center shadow-l'>
              {searchedUsers.length > 0 ? searchedUsers.map((user, index) => (
                <div 
                  key={index} 
                  className='bg-gray-100 hover:bg-gray-200 mb-2 last:mb-0 py-2 pl-2 border border-black/30 rounded-lg w-full'
                  onClick={() => validateChat(user)}
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

          {/* Chat Previews */}
          {chats.length > 0 ? 
            (<div className='asbolute  max-h-[82%] w-full mt-4 overflow-auto no-scrollbar'>
              {chats.map((chat, index) => (
                <div 
                  key={index} 
                  className={clsx('w-full h-[5rem] border-2 border-primary rounded-lg mb-2 items-center px-6 pt-2  hover:cursor-pointer transition-all', {"bg-primary": activeChat._id === chat._id})}
                  onClick={() => handlePreviewClick(chat)}
                >
                    <h1 className={clsx('font-normal text-2xl tracking-[0.025rem] ', {[`text-${(activeChat._id === chat._id) ? "gray-900" : "gray-700"}`] : true})}>
                        {chat.name}
                    </h1>
                    <div className='w-full overflow-hidden max-h-6'>
                    <p className={clsx('text-sm pt-1', {[`text-${(activeChat._id === chat._id) ? "gray-50" : "gray-500"}`] : true})}>
                        {(chat.latestMessage) ? chat.latestMessage.message: "- - - -"}
                    </p>
                  </div>
                </div> 
              ))}
            </div>) : (
            <div className='flex flex-grow justify-center'>
              <h1 className='text-gray-700 mt-[10rem] text-center font-extralight'>
                Search users to start a new chat
              </h1>
            </div>
          )}
        </div>
        
        {/* Chat View */}
        <div className='w-full h-full p-1 rounded-xl bg-light'>
          {activeChat? (
            <div className='p-1 relative flex flex-col flex-grow w-full h-full'>
              {/* Chat Name */}
              <div className='text-center w-full bg-gray-200 rounded-t-lg h-max'>
                <h1 className='text-3xl font-medium text-gray-900 px-3 py-2 '>{activeChat.name}</h1>
                <small></small>
              </div>

              <div className='flex flex-col w-full flex-grow overflow-hidden'>
                {/* Messages View */}
                <div className='w-full flex flex-col-reverse flex-grow border-x-[8px] border-gray-200 gap-2 py-4 px-2 overflow-auto no-scrollbar'>
                  {messages && messages.map((message, index) => (
                    <MessageBubble key={index} message={message} isUser={message.sender === user._id} />
                  ))}
                </div>

                {/* Message Field */}
                <form
                  className='flex items-center gap-4 px-5 py-3 pb-2 bg-gray-200 mb-1 rounded-b-lg'
                  onSubmit={(e) => {
                    e.preventDefault()
                    sendMessage(activeChat._id)
                  }}
                >
                  <input 
                    className='grow h-12 text-lg rounded-lg border-2 border-primary px-4 text-left'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    type='submit'
                    className='text-primary text-[2.8rem] hover:scale-110 transition bg-white rounded-full border-primary'
                  >
                    <FaArrowCircleUp />
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className='w-full h-full flex justify-center items-center'>
              <h1 className='text-gray-700 text-3xl font-light'>
                No Active Chat
              </h1>
            </div>
          )}
        </div>
      </div>}
    </div>
  )
}

export default ChatsPage;
