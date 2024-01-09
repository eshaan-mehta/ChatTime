import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios, { all } from "axios";
import clsx from 'clsx';
import io from "socket.io-client"

import { useChatContext } from '../Context/ChatProvider'

import { FaArrowCircleUp } from "react-icons/fa";
import MessageBubble from '../Components/MessageBubble';


const ENDPOINT = "http://localhost:8080";
var socket, selectedChatCompare;

const ChatsPage = () => {
  const { user, setUser } = useChatContext();
  const navigate = useNavigate()

  const [socketConnected, setSocketConnected] = useState(false)
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState();
  
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
    
    try {
      const response = await axios.get("http://localhost:8080/api/chats", config);
      const allChats = response.data;
      setChats(allChats);
      
      if (allChats && !activeChat) {
        setActiveChat(allChats[0]);
        await getMessages(allChats[0]._id); 
        console.log(allChats[0]);
      }
    } catch (error) {
      console.warn(error);
    }
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
      socket.emit("join room", chatId)
    })
    .catch((error) => {
      console.warn(error)
    })
  }

  const handlePreviewClick =  (chat) => {
  
    if (chat._id !== activeChat._id) {
      //const otherUser = chat.members.find((u) => u._id !== user._id)

      setActiveChat(chat);
      getMessages(chat._id)
    } //else {
    //   console.log("on active chat");
    // }
    setIsSearchingUser(false);
  }

  const handleEmptyChatClick = async (c) => {
    if (c.isTempChat) {
      console.log(c)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      try {
        const response = await axios.delete(`http://localhost:8080/api/chats/${c._id}`, config)

        if (response.data) {
          console.log("deleted temp chat")
          console.log(response.data);
        }
      } catch (error) {
        console.warn(error)
      }

      
    }
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

    // if user searching for already existing chat, redirect to that chat
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
      console.log("message sent")
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

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    } else {
      fetchChats()
    }
  }, [activeChat, messages])

  useEffect(() => { 
    if (!socketConnected)  {
      socket = io(ENDPOINT);
      socket.emit("setup", user._id);
      socket.on("User Connected", () => {
        console.log("Connected to Socket.IO");
        setSocketConnected(true);
      })
    }

    selectedChatCompare = activeChat;
  }, [user, activeChat])

  // useEffect(() => {
  //   if (socketConnected && selectedChatCompare) {
  //     socket.on("message received", (newMessage) => {
  //       if(!selectedChatCompare || selectedChatCompare._id !== newMessage.chat._id) {
  //         // if receiving message from other chat
          
  //       } else {
  //         setMessages([newMessage, ...messages]);
  //       }
  //     })
  //   }

  // })

  return (
    <div className='flex flex-col w-screen h-screen'>
      {/* Nav Bar */}
      {user && <div className='relative w-full px-4 py-5 h-max'>
        <div className='flex justify-center'>
          <h1 className='text-4xl font-semibold text-primary'> ChatTime </h1>
        </div>

        
        <div className='absolute top-0 flex items-center w-auto h-full gap-10 right-4'>
          <h2 className='text-xl font-medium text-white'>
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

      {user && <div className='flex flex-grow w-full gap-4 px-3 pb-2 overflow-hidden'>
        {/* Search View */}
        <div className='w-[30%] h-full rounded-xl bg-none bg-light px-[0.35rem] relative overflow-hidden'>
          {/* My Chats Header */}
          <div className='flex justify-center mt-2 bg-gray-200 rounded-t-lg'>
            <h1 className='px-3 py-2 text-3xl font-medium text-primary '>
              My Chats
            </h1>
          </div>

          {/* User Search */}
          <div 
            onPointerLeave={() => setIsSearchingUser(false)}
            className='relative w-full '>
            <input
              placeholder='Search Users'
              className='w-full h-10 pl-3 mt-2 bg-gray-100 border rounded-lg border-black/30 '
              onClick={() => setIsSearchingUser(true)}
              onChange={(e) => searchUser(e.target.value)}
              
            />

            {isSearchingUser && 
            <div className='absolute w-full  max-h-[12rem] bg-light p-1 border-[2.5px] border-primary/70 overflow-auto flex flex-col items-center shadow-l'>
              {searchedUsers.length > 0 ? searchedUsers.map((user, index) => (
                <div 
                  key={index} 
                  className='w-full py-2 pl-2 mb-2 bg-gray-100 border rounded-lg hover:bg-gray-200 last:mb-0 border-black/30'
                  onClick={() => validateChat(user)}
                >
                  <p className='font-medium text-gray-700'>{user.name}</p>
                  <p className='text-xs text-gray-500'>{user.email}</p>
                </div>)) : (
                <div className='h-full pl-2 text-gray-700 text-md'>
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
                  className={clsx('w-full max-h-[5rem] border-2 border-primary rounded-lg mb-2 items-center px-6 pt-2 pb-2 hover:cursor-pointer transition-all', {"bg-primary": activeChat._id === chat._id})}
                  onClick={() => {
                    handlePreviewClick(chat);
                  }}
                >
                    <h1 className={clsx('font-normal  text-xl lg:text-2xl tracking-[0.025rem] ', {[`text-${(activeChat._id === chat._id) ? "gray-900" : "gray-700"}`] : true})}>
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
            <div className='flex justify-center flex-grow'>
              <h1 className='text-gray-700 mt-[10rem] text-center font-extralight'>
                Search users to start a new chat
              </h1>
            </div>
          )}
        </div>
        
        {/* Chat View */}
        <div className='w-full h-full p-1 rounded-xl bg-light'>
          {activeChat? (
            <div className='relative flex flex-col flex-grow w-full h-full p-1'>
              {/* Chat Name */}
              <div className='w-full text-center bg-gray-200 rounded-t-lg h-max'>
                <h1 className='px-3 py-2 text-3xl font-medium text-gray-900 '>{activeChat.name}</h1>
                <small></small>
              </div>

              <div className='flex flex-col flex-grow w-full overflow-hidden'>
                {/* Messages View */}
                <div className='w-full flex flex-col-reverse flex-grow border-x-[8px] border-gray-200 gap-2 py-4 px-2 overflow-auto no-scrollbar'>
                  {messages && messages.map((message, index) => (
                    <MessageBubble key={index} message={message} isUser={message.sender === user._id} />
                  ))}
                </div>

                {/* Message Field */}
                <form
                  className='flex items-center gap-4 px-5 py-3 pb-2 mb-1 bg-gray-200 rounded-b-lg'
                  onSubmit={(e) => {
                    e.preventDefault()
                    sendMessage(activeChat._id)
                  }}
                >
                  <input 
                    className='grow h-12 text-[1.075rem] rounded-lg border-2 border-primary px-4 text-left'
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
            <div className='flex items-center justify-center w-full h-full'>
              <h1 className='text-3xl font-light text-gray-700'>
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
