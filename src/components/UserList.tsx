import React, { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react'
import { SocketContext } from "../context/Socket";
import { RoomEntity, UpdateRes, UserAction, UserEntity } from 'types'
interface RoomsListProps {
    room: string;
}
export function UserList(props: RoomsListProps) {
    const socket = useContext(SocketContext);
    const [users, setUsers] = useState<UserEntity[]>([]) 
    useEffect(() => {
        setUsers([])
    }, [props.room])
    useMemo(() => {
        socket.emit("findAllUsersInRoom", {roomId: props.room},(users: UserEntity[]) => {
            console.log('sad')
            setUsers(users)
        });
        socket.on("usersInRoom", (updateRes: UpdateRes) => {
            console.log(updateRes)
            if (updateRes.result === UserAction.joined) {
                setUsers(actualState => {
                    return [...actualState, updateRes.updatedItem]
                });
            } else if (updateRes.result === UserAction.left) {
                setUsers(actualState => {
                    return actualState.filter((item) => item.id !== updateRes.updatedItem.id)
                });
            }
        });
      }, []);
  return (
    <>
    <div className='roomList'>
        {users.map(user => (
            <div key={user.id}>
            <b>{user.name}</b>
            <br />
            </div>
        ))}
    </div>
    </>
  )
}