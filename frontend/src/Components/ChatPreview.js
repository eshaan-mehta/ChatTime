import React from 'react'
import clsx from 'clsx';

const ChatPreview = ({chat, isActive, setisActive}) => {
  return (
    <div 
        key={chat._id} 
        className={clsx('w-full h-[5rem] border border-primary rounded-lg mb-2 items-center px-6 pt-2 hover:cursor-pointer transition-all', {"bg-primary": isActive})}
        onClick={() => setisActive(chat)}
    >
        <h1 className={clsx('font-normal text-2xl tracking-[0.025rem] ', {[`text-${(isActive) ? "gray-900" : "gray-700"}`] : true})}>
            {chat.name}
        </h1>
        <div className='w-full overflow-hidden max-h-6'>
        <p className={clsx('text-sm pt-1', {[`text-${(isActive) ? "gray-50" : "gray-500"}`] : true})}>
            {(chat.latestMessage) ? chat.latestMessage.message: "This is a template latest message asdlfkjasdl;fajsdlf;kajsdlfjasd;lfkajs"}
        </p>
        </div>
    </div>
  )
}

export default ChatPreview;
