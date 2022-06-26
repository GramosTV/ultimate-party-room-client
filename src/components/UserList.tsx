import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { SocketContext } from '../context/Socket'
import { UpdateRes, UserAction, UserEntity, UserRoomAction } from 'types'
import { UserRoomActionEntity } from '../types/user-video.action'
import { ToastContainer, toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileVideo,
  faForward,
  faImage,
  faPause,
  faPen,
  faPlay,
  faQuestion,
  faTrashCan,
  faUsers,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
interface RoomsListProps {
  room: string
  userRoomAction: UserRoomActionEntity | undefined
}
export function UserList({ room, userRoomAction }: RoomsListProps) {
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
    switch (userRoomAction?.userRoomAction) {
      case UserRoomAction.pause:
        action = 'has paused the video'
        break
      case UserRoomAction.play:
        action = 'has played the video'
        break
      case UserRoomAction.forward:
        action = 'has forwarded the video'
        break
      case UserRoomAction.url:
        action = 'has changed the video source'
        break
      case UserRoomAction.draw:
        action = 'is drawing on the canvas'
        break
      case UserRoomAction.clean:
        action = 'has cleared the canvas'
        break
      case UserRoomAction.changeBgc:
        action = 'has changed background of the canvas'
        break
      default:
        action = ''
    }
    if (action && userRoomAction?.user?.clientId !== clientId && !userRoomAction?.hidden) {
      toast(`${userRoomAction?.user?.name} ${action}`)
      setUsers((actualState) => {
        const data = [...actualState].filter((item) => item.id !== userRoomAction?.user?.id)
        if (userRoomAction?.user) {
          data.unshift({ ...userRoomAction?.user, action: userRoomAction?.userRoomAction })
          setUsers((actualState) => {
            console.log('set timeout')
            return actualState.map((item, i) => {
              if (item.id === userRoomAction?.user?.id) {
                setTimeout(() => {
                  setUsers((actualState) => {
                    return actualState.map((item) => {
                      if (item.id === userRoomAction?.user?.id && item.timeoutFlag === true) {
                        return { ...item, action: NaN, timeoutFlag: undefined }
                      } else if (item.id === userRoomAction?.user?.id) {
                        return { ...item, timeoutFlag: true }
                      }
                      return item
                    })
                  })
                }, 3000)
                return {
                  ...data[i],
                  timeoutFlag: item.timeoutFlag === undefined ? undefined : true,
                }
              }
              return data[i]
            })
          })
        }
        return data
      })
    }
  }, [userRoomAction?.user?.id, userRoomAction?.userRoomAction])
  const [animate, setAnimate] = useState(false)
  const handleSwitch = () => {
    setAnimate(!animate)
  }
  return (
    <>
      <div className={animate ? 'userList animate' : 'userList'}>
        <div className='userBox'>
          <div className='switch' onClick={handleSwitch}>
            {animate ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faUsers} />}
          </div>
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
                          case UserRoomAction.pause:
                            return <FontAwesomeIcon icon={faPause} />
                          case UserRoomAction.play:
                            return <FontAwesomeIcon icon={faPlay} />
                          case UserRoomAction.forward:
                            return <FontAwesomeIcon icon={faForward} />
                          case UserRoomAction.url:
                            return <FontAwesomeIcon icon={faFileVideo} />
                          case UserRoomAction.draw:
                            return <FontAwesomeIcon icon={faPen} />
                          case UserRoomAction.clean:
                            return <FontAwesomeIcon icon={faTrashCan} />
                          case UserRoomAction.changeBgc:
                            return <FontAwesomeIcon icon={faImage} />
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
