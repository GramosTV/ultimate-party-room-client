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
import { UserVideoActionEntity } from './types/user-video.action';

export function App() {
  const socket = useContext(SocketContext)
  const [joined, setJoined] = useState<boolean>(false)
  const [joinedRoom, setJoinedRoom] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [room, setRoom] = useState<string>('')
  const [pfpForm, setPfpForm] = useState<boolean>(false)
  const [userVideoAction, setUserVideoAction] = useState<UserVideoActionEntity>()
  const join = () => {
    socket.emit('join', {name}, () => {
        setJoined(true)
    })
  }
  return (
    <SocketProvider>
    <div className='App'>
      {room ? <h2 className='roomLabel'>You&apos;re in room #{room}</h2> : null}
      {joinedRoom ? 
      <div className='container'>
      {joinedRoom ? <UserList room={room} userVideoAction={userVideoAction}/> : null}
      <VideoPlayer room={room} setUserVideoAction={setUserVideoAction}/>
      <Chat name={name} room={room}/>
      </div>
      : null}
      {joinedRoom ? <SketchCanvas room={room} /> : null}
      {joined ? <RoomList room={room} setJoinedRoom={setJoinedRoom} setRoom={setRoom} /> : (pfpForm ? <ProfilePicUpload join={join}/> : <NameForm setPfpForm={setPfpForm} setName={setName}/>)}
    </div>
    </SocketProvider>
  );
}


