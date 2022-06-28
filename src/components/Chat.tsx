import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { SocketContext } from '../context/Socket'
import { MessageEntity, IsTypingEntity } from 'types'
import { MessageInput } from './MessageInput'
interface ChatProps {
  name: string
  room: string
}
export function Chat({ name, room }: ChatProps) {
  const [messages, setMessages] = useState<MessageEntity[]>([])
  const socket = useContext(SocketContext)
  const [usersTyping, setUsersTyping] = useState<
    { name: string; isTyping: boolean; clientId: string }[]
  >([])
  useEffect(() => {
    setMessages([])
    socket.emit('findAllMessages', (response: MessageEntity[]) => {
      setMessages(response)
    })
  }, [room])
  useMemo(() => {
    socket.on('message', (message: MessageEntity) => {
      console.log(message)
      setMessages((actualState) => {
        return [...actualState, message]
      })
    })
    socket.on('typing', ({ name, isTyping, clientId }: IsTypingEntity) => {
      setUsersTyping((actualState) => {
        return isTyping
          ? (actualState.find(e => e.clientId === clientId) ? actualState : [...actualState, { name, isTyping, clientId }])
          : [...actualState].filter(e => e.clientId !== clientId)
      })
    })
  }, [])
  const chat = useRef<null | HTMLDivElement>(null)
  const scrollToBottom = () => {
    if (chat.current?.offsetTop && chat.current.offsetHeight) {
      chat.current.scrollTop = chat.current.scrollHeight
    }
  }
  const usersTypingMessage = () => {
    switch (usersTyping.length) {
      case 1:
      return `${usersTyping[0].name} is typing...`
      case 2:
      return `${usersTyping[0].name} and ${usersTyping[1].name} are typing...`
      default:
      return `${usersTyping[0].name}, ${usersTyping[1].name} and others are typing...`
    }
  }
  return (
    <div className='chatContainer'>
      <h2 className='gradientText small'>Chat</h2>
      <div className='chat' ref={chat}>
        {/* <span>Your name is {name}</span> */}
        {messages.map((e, i) => {
          setTimeout(() => {
            scrollToBottom()
          }, 100)
          return (
            <div key={i} className='message'>
              <span>
                {e.name}:
                <p>
                  {new Date(String(e.createdAt))?.toISOString().replace('T', ' ').substring(11, 19)}
                </p>
              </span>
              <p>{e.text}</p>
            </div>
          )
        })}
      </div>
      {usersTyping.length ? <p>{usersTypingMessage()}</p> : null}
      <MessageInput name={name} />
    </div>
  )
}
