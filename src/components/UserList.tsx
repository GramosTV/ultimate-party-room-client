import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { SocketContext } from '../context/Socket'
import { UpdateRes, UserAction, UserEntity, UserVideoAction } from 'types'
import { UserVideoActionEntity } from '../types/user-video.action'
import { ToastContainer, toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileVideo,
  faForward,
  faPause,
  faPlay,
  faQuestion,
} from '@fortawesome/free-solid-svg-icons'
interface RoomsListProps {
  room: string
  userVideoAction: UserVideoActionEntity | undefined
}
export function UserList({ room, userVideoAction }: RoomsListProps) {
  const socket = useContext(SocketContext)
  const [users, setUsers] = useState<UserEntity[]>([])
  const userJoinAnimation = useRef(false)
  const [clientId, setClientId] = useState('')
  useEffect(() => {
    setUsers([])
  }, [room])
  useMemo(() => {
    socket.emit('clientId', {}, (clientId: string) => {
      setClientId(clientId)
    })
    socket.emit('findAllUsersInRoom', {}, (users: UserEntity[]) => {
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
    let action: string
    switch (userVideoAction?.userVideoAction) {
      case UserVideoAction.pause:
        action = 'paused the video'
        break
      case UserVideoAction.play:
        action = 'played the video'
        break
      case UserVideoAction.forward:
        action = 'forwarded the video'
        break
      case UserVideoAction.url:
        action = 'changed the video source'
        break
      default:
        action = ''
    }
    if (action && userVideoAction?.user?.clientId !== clientId && !userVideoAction?.hidden) {
      toast(`${userVideoAction?.user?.name} has ${action}`)
      setUsers((actualState) => {
        const data = [...actualState].filter((item) => item.id !== userVideoAction?.user?.id)
        if (userVideoAction?.user) {
          data.unshift({ ...userVideoAction?.user, action: userVideoAction?.userVideoAction })
          setUsers((actualState) => {
          console.log('set timeout')
            return actualState.map((item, i) => {
              if (item.id === userVideoAction?.user?.id) {
                setTimeout(() => {
                  setUsers((actualState) => {
                    return actualState.map((item) => {
                      if (item.id === userVideoAction?.user?.id && item.timeoutFlag === true) {
                        return { ...item, action: NaN, timeoutFlag: undefined };
                      } else if (item.id === userVideoAction?.user?.id) {
                        return { ...item, timeoutFlag: true };
                      }
                      return item
                    })
                  })
                }, 3000)
                return { ...data[i], timeoutFlag: item.timeoutFlag === undefined ? undefined : true}
              }
              return data[i]
            })
            })
        }
        return data
      })
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
                className={
                  userJoinAnimation.current && i === 0
                    ? 'user animate animated animate__zoomIn'
                    : 'user'
                }
              >
                <div className='imgBx'>
                  <img
                    src={`http://localhost:3001/photos/${
                      user.profilePicture ? user.profilePicture : 'default.png'
                    }`}
                    alt={user.name + '\'s profile picture'}
                  />
                  {typeof user.action === 'number' ? (
                    <div>
                      {(() => {
                        switch (user?.action) {
                          case UserVideoAction.pause:
                            return <FontAwesomeIcon icon={faPause} />
                          case UserVideoAction.play:
                            return <FontAwesomeIcon icon={faPlay} />
                          case UserVideoAction.forward:
                            return <FontAwesomeIcon icon={faForward} />
                          case UserVideoAction.url:
                            return <FontAwesomeIcon icon={faFileVideo} />
                          default:
                            return null
                        }
                      })()}
                    </div>
                  ) : null}
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
