import React, { useContext, useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketContext } from "../context/Socket";
import { MessageEntity, IsTypingEntity } from "types";
import { MessageInput } from "./MessageInput";
interface ChatProps {
  name: string;
  room: string;
}
export function Chat(props: ChatProps) {
  const {name, room} = props;
  const [messages, setMessages] = useState<MessageEntity[]>([]);
  const socket = useContext(SocketContext);
  const [userIsTyping, setUserIsTyping] = useState<string>("");
  useEffect(() => {
    setMessages([]);
    socket.emit("findAllMessages", {roomId: room}, (response: MessageEntity[]) => {
      setMessages(response);
    });
  }, [room])
  useMemo(() => {
    socket.on("message", (message: MessageEntity) => {
      setMessages(actualState => {
        return [...actualState, message]
    });
    });
    socket.on("typing", ({ name, isTyping }: IsTypingEntity) => {
      isTyping ? setUserIsTyping(`${name} is typing...`) : setUserIsTyping(``);
    });
  }, []);
  return (
    <div className="chat">
      <span>Your name is {name}</span>
      {messages.map((e, i) => {
        return (
          <div key={i} className="message">
            <p>
              {e.name}: {e.text}
            </p>
          </div>
        );
      })}
      {userIsTyping ? <p>{userIsTyping}</p> : null}
      <MessageInput name={name} room={room}/>
    </div>
  );
}
