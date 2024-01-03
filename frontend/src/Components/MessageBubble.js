import React from 'react'
import clsx from 'clsx'

const MessageBubble = ({ message, isUser }) => {
  return (
    <div className={clsx('flex w-full', {[`justify${isUser ? "-end" : "-start"}`] : true})}>
        <p className={clsx("w-max max-w-[40%] px-3 py-2 text-lg border rounded-b-xl", {
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
