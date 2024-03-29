import React from 'react'
import clsx from 'clsx'

const MessageBubble = ({ message, isUser }) => {
  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`} >
        <p className={clsx("w-max max-w-[40%] px-3 py-[0.35rem] lg:py-2 lg:text-lg border rounded-b-xl", {
                                                                                        [`${isUser ? "bg-primary" : "bg-gray-300"}`] : true,
                                                                                        [`${isUser ? "rounded-tl-xl" : "rounded-tr-xl"}`] : true,
                                                                                    })}
        >
            {message.message}
        </p>
    </div>
  )
}

export default MessageBubble
