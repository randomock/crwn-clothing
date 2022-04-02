import { useState } from 'react';

import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';

import {
   signInWithGooglePopup,
   createUserDocumentFromAuth,
   signInAuthUserWithEmailAndPassword
} from '../../utils/firebase/firebase.utils';

import './sign-in-form.styles.scss';

const defaultFormFields = {
   email: '',
   password: ''
};

const SignInForm = () => {

   const [formFields, setFormFields] = useState(defaultFormFields);
   const { email, password } = formFields;


   const signInWithGoogle = async () => {
      const { user } = await signInWithGooglePopup();
      await createUserDocumentFromAuth(user);
   }

   const resetFormFields = () => {
      setFormFields(defaultFormFields);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         const response = await signInAuthUserWithEmailAndPassword(email, password);
         console.log(response);
         resetFormFields();
      } catch (error) {
         switch (error.code) {
            case 'auth/wrong-password':
               alert('Incorrect password for email');
               break
            case 'auth/user-not-found':
               alert('No user associated with this email');
               break;
            default:
               console.log(error);
         }
      }
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormFields({ ...formFields, [name]: value })
   };

   return (
      <div className="sign-up-container">
         <h2>Already have an account?</h2>
         <span>Sign in with your email and password</span>
         <form onSubmit={handleSubmit} >
            <FormInput 
               label="Email"
               inputOptions={{
                  type: 'email',
                  required: true,
                  onChange: handleChange,
                  name: 'email',
                  value: email,
               }}
            />

            <FormInput 
               label="Password"
               inputOptions={{
                  type: 'password',
                  required: true,
                  onChange: handleChange,
                  name: 'password',
                  value: password,
               }}
            />
            <div className='buttons-container'>
               <Button type='submit'>Sign Up</Button>
               <Button type='button' buttonType='google' onClick={signInWithGoogle}>
                  Google sign in
               </Button>
            </div>
         </form>
      </div>
   );
};

export default SignInForm;