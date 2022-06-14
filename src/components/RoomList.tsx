import React, { Dispatch, SetStateAction, useContext, useMemo, useRef, useState } from 'react'
import { SocketContext } from "../context/Socket";
import { RoomEntity, UpdateRes } from 'types'
interface RoomsListProps {
    room: string;
    setJoinedRoom: Dispatch<SetStateAction<boolean>>;
    setRoom: Dispatch<React.SetStateAction<string>>;
}
export function RoomList(props: RoomsListProps) {
    const socket = useContext(SocketContext);
    const [rooms, setRooms] = useState<RoomEntity[]>([])
    const [currentRoom, setCurrentRoom] = useState<RoomEntity | null>(null)
    useMemo(() => {
        socket.emit("findAllRooms", (rooms: RoomEntity[]) => {
            setRooms(rooms)
        });
        socket.on("room", (room: RoomEntity) => {
          setRooms(actualState => {
            return [...actualState, room]
        });
        });
      }, []);
      const createRoom = () => {
        socket.emit("createRoom", {}, (room: RoomEntity) => {
            props.setRoom(room.id)
            props.setJoinedRoom(true)
          setRooms(actualState => {
            const arr = [...actualState].filter((item) => item.id !== room.id)
            if (currentRoom) {
              arr.push(currentRoom)
            }
            return arr
        })
        setCurrentRoom(room)
        });
      };
      const joinRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
        socket.emit("joinRoom", { roomId: e.currentTarget.id }, (updateResult: UpdateRes) => {
          if(updateResult) {
            props.setRoom(updateResult.updatedItem.id)
            props.setJoinedRoom(true)
            setRooms(actualState => {
              const arr = [...actualState].filter((item) => item.id !== updateResult.updatedItem.id)
              if (currentRoom) {
                arr.push(currentRoom)
              }
              return arr
          })
          setCurrentRoom(updateResult.updatedItem)
          } else {
            window.alert('Failed to join room')
          }
      });
      }
  return (
    <>
    <button onClick={createRoom}>Create a room</button>
    <div className='roomList'>
        {rooms.map(room => (
            <div className='room' key={room.id}>
                <p>Room #{room.id}</p>
                <button onClick={joinRoom} id={room.id}>Join</button>
            </div>
        ))}
    </div>
    </>
  )
}
