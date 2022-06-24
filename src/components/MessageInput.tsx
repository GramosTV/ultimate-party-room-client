import React, { useContext, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { SocketContext } from '../context/Socket';
import { MessageEntity } from 'types'
interface MessageInputProps {
    name: string;
}
export const MessageInput = ({name}: MessageInputProps) => {
  const socket = useContext(SocketContext);
  const sendMessage = (text: string) => {
    socket.emit('createMessage', { name: name, text });
  };
  let typingTimeout;
  const emitTyping = () => {
    socket.emit('typing', { isTyping: true });
    typingTimeout = setTimeout(() => {
      socket.emit('typing', { isTyping: false });
    }, 2000);
  };
  const handleChange = (e: React.ChangeEvent<any>) => {
    emitTyping()
  }
  
  return (
    <>
      <Formik
        initialValues={{ message: '' }}
        validate={values => {
          const errors = { message: '' };
          if (!values.message) {
            errors.message = 'Required';
          } else if (values.message.length < 3) {
            errors.message = 'Too short';
          } else if (values.message.length > 255) {
            errors.message = 'Too long';
          }
          if (errors.message) {
            return errors
          }
          return {}
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
            sendMessage(values.message);
            setSubmitting(false);
            resetForm();
        }}
      >
        {({ isSubmitting }) => (
          <Form className="chatForm">
            <Field type='text' name='message' onKeyUp={handleChange} className='input'/>
            <button className='confirmBtn' type='submit' disabled={isSubmitting}>
              Submit
            </button>
            <ErrorMessage name='message' component='div' />
          </Form>
        )}
      </Formik>
    </>
  );
};
