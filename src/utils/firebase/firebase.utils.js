import { initializeApp } from 'firebase/app';
import {
   getAuth,
   signInWithRedirect,
   signInWithPopup,
   GoogleAuthProvider,
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
   apiKey: "AIzaSyD4t_IT98Ai1ep9Ld__sTYJjWsBi1wpbiI",
   authDomain: "crwn-clothing-db-a7a58.firebaseapp.com",
   projectId: "crwn-clothing-db-a7a58",
   storageBucket: "crwn-clothing-db-a7a58.appspot.com",
   messagingSenderId: "425183833290",
   appId: "1:425183833290:web:75df1d11f39b8197d89833"
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
   prompt: 'select_account'
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth, additionalInformation) => {
   if (!userAuth) return;
   
   const userDocRef = doc(db, 'users', userAuth.uid);
   const userSnapshot = await getDoc(userDocRef);
   
   if (!userSnapshot.exists()) {
      const { displayName, email } = userAuth;
      const createdAt = new Date();

      try {
         await setDoc(userDocRef, {
            displayName,
            email,
            createdAt,
            ...additionalInformation
         });
      } catch (error) {
         console.log('error creating the user', error.message);
      }
   }

   return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
   if (!email || !password) return;

   return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
   if (!email || !password) return;

   return await signInWithEmailAndPassword(auth, email, password);
};