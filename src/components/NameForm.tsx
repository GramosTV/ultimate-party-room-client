import React, { Dispatch, SetStateAction } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
interface NameFormProps {
  setPfpForm: Dispatch<SetStateAction<boolean>>;
  setName: Dispatch<SetStateAction<string>>;
}
export const NameForm = ({setPfpForm, setName}: NameFormProps ) => (
   <div>
    <h1 className='gradientText animate__animated animate__fadeIn'>Welcome!</h1>
     <h2 className='gradientText animate__animated animate__fadeIn' style={{animationDelay: '1.2s'}}>Enter your name</h2>
     <Formik
       initialValues={{ name: ''}}
       validate={values => {
         const errors = { name: '' };
         if (!values.name) {
           errors.name = 'Required';
         } else if (
           values.name.length < 3
         ) {
           errors.name = 'Too short';
         }
         else if (
            values.name.length > 25  
          ) {
            errors.name = 'Too long';
          }
          if (errors.name) {
            return errors
          }
          return {}
       }}
       onSubmit={(values, { setSubmitting }) => {
         setPfpForm(true)
         setName(values.name)
         setSubmitting(false)
       }}
     >
       {({ isSubmitting }) => (
         <Form className='animate__animated animate__fadeIn'
         style={{animationDelay: '1.8s'}}
         >
           <Field type='text' name='name' className='nameInput'/>
           <ErrorMessage name='name' component='div' />
           <button className='submitForm' type='submit' disabled={isSubmitting}>
             Submit
           </button>
         </Form>
       )}
     </Formik>
   </div>
 );
 