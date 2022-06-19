import React, { useContext, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { io } from 'socket.io-client';
import { Chat } from './components/Chat';
import { SocketProvider, SocketContext } from './context/Socket';
import { NameForm } from './components/NameForm';
import { RoomList } from './components/RoomList';
import { UserList } from './components/UserList';
import { VideoPlayer } from './components/VideoPlayer';
import { ProfilePicUpload } from './components/ProfilePicUpload';
import { SketchCanvas } from './components/SketchCanvas';

export function App() {
  const socket = useContext(SocketContext)
  const [joined, setJoined] = useState<boolean>(false)
  const [joinedRoom, setJoinedRoom] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [room, setRoom] = useState<string>('')
  const [pfpForm, setPfpForm] = useState<boolean>(false)
  const join = () => {
    socket.emit('join', {name}, () => {
        setJoined(true)
    })
  }
  return (
    <SocketProvider>
    <div className="App">
      {room ? <h2>You're in room #{room}</h2> : null}
      {joinedRoom ? <VideoPlayer room={room} /> : null}
      {joinedRoom ? <Chat name={name} room={room}/> : null}
      {joinedRoom ? <SketchCanvas room={room} /> : null}
      {joinedRoom ? <UserList room={room}/> : null}
      {joined ? <RoomList room={room} setJoinedRoom={setJoinedRoom} setRoom={setRoom} /> : (pfpForm ? <ProfilePicUpload join={join}/> : <NameForm setPfpForm={setPfpForm} setName={setName}/>)}
    </div>
    </SocketProvider>
  );
}


