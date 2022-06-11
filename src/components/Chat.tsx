import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { MessageEntity } from 'types';

export function Chat(socket: Socket) {
  const [messages, setMessages] = useState<MessageEntity[]>([])
  const [joined, setJoined] = useState<boolean>(false)
  const [name, setName] = useState<boolean>(false)
  const [messageText, setMessageText] = useState<string>('')

  useEffect(() => {
    socket.emit('findAllMessages', {}, (response: MessageEntity[]) => {
        setMessages(response)
    })

    socket.on('message', (message: any) => {
        setMessages([...messages, message])
    })
  }, [])

  const join = () => {
    socket.emit('join', {name: name}, (names: any) => {
        setJoined(true)
    })
  }
  const sendMessage = () => {
    socket.emit('createMessage', { text: messageText }, (response: any) => {
        setMessageText('')
    })
  }
  return (
    <div className="chat">
        {messages.map((e) => {
            return <div className='message'><p>{e.name}</p>{e.text}</div>
        })}
    </div>
  );
}

