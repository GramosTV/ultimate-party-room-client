import React, { useContext, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { SocketContext } from "../context/Socket";
interface MessageInputProps {
    name: string;
}
export const MessageInput = (props: MessageInputProps) => {
  const socket = useContext(SocketContext);
  const [messageText, setMessageText] = useState<string>('');
  const sendMessage = () => {
    socket.emit("createMessage", { name: props.name, text: messageText }, (response: any) => {
      setMessageText("");
    });
  };
  let typingTimeout;
  const emitTyping = () => {
    socket.emit("typing", { isTyping: true });
    typingTimeout = setTimeout(() => {
      socket.emit("typing", { isTyping: false });
    }, 2000);
  };
  const handleChange = (e: React.ChangeEvent<any>) => {
    setMessageText(e.currentTarget.value);
    emitTyping()
  }
  
  return (
    <div>
      <Formik
        initialValues={{ message: "" }}
        validate={(values) => {
          const errors = { message: "" };
          if (!values.message) {
            errors.message = "Required";
          } else if (values.message.length < 1) {
            errors.message = "Too short";
          } else if (values.message.length > 100) {
            errors.message = "Too long";
          }
          return {};
        }}
        onSubmit={(values, { setSubmitting }) => {
            setMessageText(values.message);
            sendMessage()
            setSubmitting(false);
        //   setTimeout(() => {
        //     alert(JSON.stringify(values, null, 2));
        //     setSubmitting(false);
        //   }, 400);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type="text" name="message" onChange={handleChange} value={messageText}/>
            <ErrorMessage name="message" component="div" />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
