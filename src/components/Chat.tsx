import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SocketContext } from '../context/Socket';
import { MessageEntity, IsTypingEntity } from 'types';
import { MessageInput } from './MessageInput';
interface ChatProps {
  name: string;
  room: string;
}
export function Chat(props: ChatProps) {
  const {name, room} = props;
  const [messages, setMessages] = useState<MessageEntity[]>([]);
  const socket = useContext(SocketContext);
  const [userIsTyping, setUserIsTyping] = useState<string>('');
  useEffect(() => {
    setMessages([]);
    socket.emit('findAllMessages', (response: MessageEntity[]) => {
      setMessages(response);
    });
  }, [room])
  useMemo(() => {
    socket.on('message', (message: MessageEntity) => {
      console.log(message);
      setMessages(actualState => {
        return [...actualState, message]
    });
    });
    socket.on('typing', ({ name, isTyping }: IsTypingEntity) => {
      isTyping ? setUserIsTyping(`${name} is typing...`) : setUserIsTyping('');
    });
  }, []);
  const chat = useRef<null | HTMLDivElement>(null)
  const scrollToBottom = () => {
    if (chat.current?.offsetTop && chat.current.offsetHeight) {
      chat.current.scrollTop = chat.current.scrollHeight;
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
            <span>{e.name}:<p>{new Date(String(e.createdAt))?.toISOString().replace('T',' ').substring(11, 19)}</p></span>
            <p>
              {e.text}
            </p>
          </div>
        );
      })}
    </div>
    {userIsTyping ? <p>{userIsTyping}</p> : null}
      <MessageInput name={name}/>
    </div>
  );
}
