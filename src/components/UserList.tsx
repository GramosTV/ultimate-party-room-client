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
        <div className="userBox">
            <h3>
                Users in Room
            </h3>
            <div className="list">
            {users.map(user => (
                <div className='user' key={user.id}>
                <div className="imgBx">
                    {user.profilePicture ? <img src={`http://localhost:3001/photos/${user.profilePicture}`} alt={user.name + "'s profile picture"} /> : <img src={`http://localhost:3001/photos/default.png`} alt={user.name + "'s profile picture"} />}    
                </div>
                <div className="content">
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