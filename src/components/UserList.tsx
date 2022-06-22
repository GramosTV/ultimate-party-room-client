import React, { Dispatch, SetStateAction, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { SocketContext } from '../context/Socket'
import { RoomEntity, UpdateRes, UserAction, UserEntity } from 'types'
import { UserVideoAction, UserVideoActionEntity } from '../types/user-video.action';
import { ToastContainer, toast } from 'react-toastify';
interface RoomsListProps {
  room: string
  userVideoAction: UserVideoActionEntity | undefined;
}
export function UserList({room, userVideoAction}: RoomsListProps) {
  const socket = useContext(SocketContext);
  const [users, setUsers] = useState<UserEntity[]>([]);
  const userJoinAnimation = useRef(false);
  const [clientId, setClientId] = useState('');
  useEffect(() => {
    setUsers([])
  }, [room])
  useMemo(() => {
    socket.emit('clientId', {}, (clientId: string) => {
      setClientId(clientId)
    })
    socket.emit('findAllUsersInRoom', { roomId: room }, (users: UserEntity[]) => {
      setUsers(users)
    })
    socket.on('usersInRoom', (updateRes: UpdateRes) => {
      console.log(updateRes)
      if (updateRes.result === UserAction.joined) {
        userJoinAnimation.current = true
        setUsers((actualState) => {
          return [updateRes.updatedItem, ...actualState]
        })
      } else if (updateRes.result === UserAction.left) {
        userJoinAnimation.current = false
        setUsers((actualState) => {
          return actualState.filter((item) => item.id !== updateRes.updatedItem.id)
        })
      }
    })
  }, [])
  useEffect(() => {
    let action: string;
    switch (userVideoAction?.userVideoAction) {
      case UserVideoAction.pause:
      action = 'paused the video'
      break;
      case UserVideoAction.play:
      action = 'played the video'
      break;
      case UserVideoAction.forward:
      action = 'forwarded the video'
      break;
      case UserVideoAction.url:
      action = 'changed the video source'
      break;
      default:
      action = '';
    }
    if (action && userVideoAction?.user?.clientId !== clientId) {
      toast(`${userVideoAction?.user?.name} has ${action}`);
    }
  }, [userVideoAction?.user?.id, userVideoAction?.userVideoAction])
  return (
    <>
      <div className='userList'>
      <ToastContainer />
        <div className='userBox'>
          <h3>Users in Room</h3>
          <div className='list'>
            {users.map((user, i) => (
              <div
                key={user.id}
                className={(userJoinAnimation.current && i === 0) ? 'user animate animated animate__zoomIn' : 'user'}
              >
                <div className='imgBx'>
                  {user.profilePicture ? (
                    <img
                      src={`http://localhost:3001/photos/${user.profilePicture}`}
                      alt={user.name + '\'s profile picture'}
                    />
                  ) : (
                    <img
                      src={'http://localhost:3001/photos/default.png'}
                      alt={user.name + '\'s profile picture'}
                    />
                  )}
                </div>
                <div className='content'>
                  <h4>{user.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
