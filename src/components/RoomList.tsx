import React, { Dispatch, SetStateAction, useContext, useMemo, useRef, useState } from 'react'
import { SocketContext } from '../context/Socket'
import { RoomAction, RoomActionRes, RoomEntity, UpdateRes } from 'types'
import { toast } from 'react-toastify'
interface RoomsListProps {
  room: string
  setJoinedRoom: Dispatch<SetStateAction<boolean>>
  setRoom: Dispatch<SetStateAction<string>>
}
export function RoomList({setJoinedRoom, setRoom}: RoomsListProps) {
  const socket = useContext(SocketContext)
  const [rooms, setRooms] = useState<RoomEntity[]>([])
  const [currentRoom, setCurrentRoom] = useState<RoomEntity | null>(null)
  useMemo(() => {
    socket.emit('findAllRooms', (rooms: RoomEntity[]) => {
      setRooms(rooms)
    })
    socket.on('room', (roomRes: RoomActionRes) => {
      console.log(roomRes)
      if (roomRes.roomAction === RoomAction.add) {
        setRooms((actualState) => {
          return [...actualState, roomRes.room]
        })
      } else if (roomRes.roomAction === RoomAction.delete) {
        setRooms((actualState) => {
          return actualState.filter((e) => e.id !== roomRes.room.id)
        })
      }
    })
  }, [])
  const createRoom = () => {
    socket.emit('createRoom', {}, (room: RoomEntity) => {
      setRoom(room.id)
      setJoinedRoom(true)
      setRooms((actualState) => {
        const arr = [...actualState].filter((item) => item.id !== room.id)
        if (currentRoom) {
          arr.push(currentRoom)
        }
        return arr
      })
      setCurrentRoom(room)
    })
  }
  const joinRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    socket.emit('joinRoom', { roomId: e.currentTarget.id }, (updateResult: UpdateRes) => {
      if (updateResult) {
        setRoom(updateResult.updatedItem.id)
        setJoinedRoom(true)
        setRooms((actualState) => {
          const arr = [...actualState].filter((item) => item.id !== updateResult.updatedItem.id)
          if (currentRoom) {
            arr.push(currentRoom)
          }
          return arr
        })
        setCurrentRoom(updateResult.updatedItem)
      } else {
        toast.error('Failed to join room', {
          theme: 'colored'
        })
      }
    })
  }
  return (
    <>
      <div className='roomList'>
        <div className='roomBox'>
          <h3>Rooms</h3>
          <button className='submitForm' onClick={createRoom}>Create a room</button>
          <div className='list'>
            {rooms.map((room) => (
              <div className='room' key={room.id}>
                <div className='content'>
                  <h4>Room #{room.id}</h4>
                  <button className='confirmBtn' onClick={joinRoom} id={room.id}>
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
