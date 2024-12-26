import { FIREBASE_AUTH } from './firebaseconfig';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const signIn = (email, password) => {
  return signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
};

export const signOutUser = () => {
  return signOut(FIREBASE_AUTH);
};
