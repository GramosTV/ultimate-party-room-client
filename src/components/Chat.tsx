import React, { useContext, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketContext } from "../context/Socket";
import { MessageEntity, IsTypingEntity } from "types";
import { MessageInput } from "./MessageInput";
interface ChatProps {
  name: string;
}
export function Chat(props: ChatProps) {
  const [messages, setMessages] = useState<MessageEntity[]>([]);
  const socket = useContext(SocketContext);
  const [userIsTyping, setUserIsTyping] = useState<string>("");
  useMemo(() => {
    socket.emit("findAllMessages", {}, (response: MessageEntity[]) => {
      setMessages(response);
    });

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
      <span>Your name is {props.name}</span>
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
      <MessageInput name={props.name}/>
    </div>
  );
}
