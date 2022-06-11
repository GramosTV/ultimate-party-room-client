import React from 'react';
import logo from './logo.svg';
import './App.css';
import { io } from 'socket.io-client';
import { Chat } from './components/Chat';

export function App() {
  const socket = io('https://localhost:3001')
  return (
    <div className="App">
      {/* Encountered a type problem */}
      {/* @ts-ignore:next-line */}
      <Chat socket={socket}/>
    </div>
  );
}


