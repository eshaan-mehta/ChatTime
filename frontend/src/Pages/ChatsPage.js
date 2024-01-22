import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import clsx from 'clsx';
import io from "socket.io-client"

import { useChatContext } from '../Context/ChatProvider'

import { FaArrowCircleUp } from "react-icons/fa";
import MessageBubble from '../Components/MessageBubble';


const ENDPOINT = "http://localhost:8080";
var socket;

const ChatsPage = () => {
  var { user, setUser } = useChatContext();
  const navigate = useNavigate()

  const [socketConnected, setSocketConnected] = useState(false)
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState();
  
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false);
  const timeoutIdRef = useRef(null);

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
        if (activeChat) {
          getMessages(activeChat._id);
        } else if (allChats[0]) {
          getMessages(allChats[0]._id);
        }
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

  const handlePreviewClick = (chat) => {
  
    if (chat && chat._id !== activeChat._id) {
      //const otherUser = chat.members.find((u) => u._id !== user._id)
      socket.emit("leave room", activeChat._id);
      setActiveChat(chat);
      getMessages(chat._id)
      setMessage("");
    } //else {
    //   console.log("on active chat");
    // }
    setIsSearchingUser(false);
  }

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!socketConnected || !socket) return;

    
    socket.emit("typing", activeChat._id);
    let lastTypingTime = new Date().getTime();


    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    let timer = 1800;

    timeoutIdRef.current = setTimeout(() => {
      var timeDiff = new Date().getTime() - lastTypingTime;

      if (timeDiff >= timer) {
        socket.emit("stop typing", activeChat._id);
      }
    }, timer);
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
    const alreadyExistingChat = chats.length > 0 && chats.find((c) => c.members.some((member) => member._id === u._id) > 0)

    // if user searching for already existing chat, redirect to that chat
    if (alreadyExistingChat) {
      handlePreviewClick(alreadyExistingChat);
    } else {
      createChat(u);
    }
  }

  const createChat = async (u) => {
    console.log(user)
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }

    axios.post("http://localhost:8080/api/chats", { userId: u._id, name: u.name }, config)
    .then((response) => {
      setChats([response.data, ...chats])
      setActiveChat(response.data);
      setIsSearchingUser(false);
      setMessages([])
    })
    .catch((error) => {
      console.warn(error)
    })
  }

  const sendMessage = async (id) => {
    socket.emit("stop typing", id);
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
      socket.emit("new message", response.data);
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

  //redirect to auth page if no user
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    } else {
      fetchChats()
    }
  }, [activeChat])

  //connect user upon initial render
  useEffect(() => { 
    if (!user) return;

    if (!socketConnected || !socket)  {
      socket = io(ENDPOINT);
      socket.emit("setup", user._id);
      socket.on("User Connected", () => setSocketConnected(true));
    } else {
      console.log("socket already connected");
    }
  }, [])

  useEffect(() => {
    return () => {
      clearTimeout(timeoutIdRef.current);
    };
  }, []);

  useEffect(() => {
    if (!socketConnected || !socket) return;

    socket.on("typing", () => {
      console.log(activeChat);
        setIsTyping(true)
      
    });
    socket.on("stop typing", () => {
        setIsTyping(false)
    });

    socket.on("message received", (newMessage) => {
      
      if(!activeChat || activeChat._id !== newMessage.chatRoomID._id) {
        console.log(newMessage.chatRoomID);
        // if receiving message from other chat

        // setChats((prevChats) => {
        //   const targetChat = prevChats.find((c) => c._id === newMessage.chatRoom._id);

        //   if (targetChat) {
        //     const updatedChats = prevChats.filter((c) => c._id !== newMessage.chatRoom._id);
        //     return [targetChat, ...updatedChats];
        //   }

        //   return [newMessage.chatRoom, ...prevChats];
        // })

        // bring chat to top, case when chat doesnt exist or chat already exists
        // update latest message
        // add styling
        
      } else {
        setMessages([newMessage, ...messages]);
      }
    }, [])
    
  })

  return (
    <div className='flex flex-col w-screen h-screen'>
      {/* Nav Bar */}
      {user && <div className='relative w-full px-4 py-5 h-max'>
        <div className='flex justify-center'>
          <h1 className='text-4xl font-semibold text-primary'> ChatTime </h1>
        </div>


        <div className='absolute top-0 flex items-center w-auto h-full gap-5 md:gap-10 right-4'>
          <h2 className='text-base font-medium text-white md:text-xl'>
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
        <div className='w-[55%] sm:w-[45%] lg:w-[40%] xl:w-[30%] h-full rounded-xl bg-none bg-light px-[0.35rem] relative overflow-hidden'>
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
                    <h1 className={clsx('font-normal sm:text-lg md:text-xl lg:text-2xl tracking-[0.025rem] ', {[`text-${(activeChat._id === chat._id) ? "gray-900" : "gray-700"}`] : true})}>
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
                
                {isTyping && <p className='text-gray-800 text-sm border-x-[8px] border-gray-200 px-2'>
                  Typing...
                </p>}

                {/* Message Field */}
                <form
                  className='flex items-center gap-4 px-5 py-3 pb-2 mb-1 bg-gray-200 rounded-b-lg'
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(activeChat._id)
                  }}
                >
                  <input 
                    className='grow h-12 text-[1.075rem] rounded-lg border-2 border-primary px-4 text-left'
                    value={message}
                    onChange={handleTyping}
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
