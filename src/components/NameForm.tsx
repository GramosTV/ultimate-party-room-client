import React, { Dispatch } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
interface NameFormProps {
    join: (name: string) => void;
}
export const NameForm = (props: NameFormProps ) => (
   <div>
     <h1>Enter your name</h1>
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
         return {};
       }}
       onSubmit={(values, { setSubmitting }) => {
         props.join(values.name)
         setSubmitting(false)
       }}
     >
       {({ isSubmitting }) => (
         <Form>
           <Field type="text" name="name" />
           <ErrorMessage name="name" component="div" />
           <button type="submit" disabled={isSubmitting}>
             Submit
           </button>
         </Form>
       )}
     </Formik>
   </div>
 );
 