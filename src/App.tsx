import React, { useContext, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { io } from 'socket.io-client';
import { Chat } from './components/Chat';
import { SocketProvider, SocketContext } from './context/Socket';
import { NameForm } from './components/NameForm';

export function App() {
  const socket = useContext(SocketContext)
  const [joined, setJoined] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const join = (name: string) => {
    socket.emit('join', {name}, (names: any) => {
        setName(name)
        setJoined(true)
    })
  }
  return (
    <SocketProvider>
    <div className="App">
      {joined ? <Chat name={name}/> : <NameForm join={join}/>}
      
    </div>
    </SocketProvider>
  );
}


