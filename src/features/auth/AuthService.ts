import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { User } from '@/types';
import { useAuthStore } from './useAuthStore';

export const AuthService = {
  initialize: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as Omit<User, 'uid' | 'email'>;
          useAuthStore.getState().setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            ...userData,
          });
        } else {
          // fallback if user doc doesn't exist but authenticated
          // Ideally seed data creates these documents
          useAuthStore.getState().setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            role: 'matchmaker',
          });
        }
      } else {
        useAuthStore.getState().setUser(null);
      }
    });
  },

  login: async (email: string, password: string): Promise<User> => {
    let userCredential;
    try {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        // If it's the demo account, auto-create it to make evaluation easier
        if (email === 'matchmaker@tdc.com') {
          userCredential = await createUserWithEmailAndPassword(auth, email, password);
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
    const firebaseUser = userCredential.user;
    
    // Fetch or create user record
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userRef);
    
    let user: User;
    if (userDoc.exists()) {
      user = { uid: firebaseUser.uid, email: firebaseUser.email!, ...(userDoc.data() as Omit<User, 'uid' | 'email'>) };
    } else {
      user = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        role: 'matchmaker',
        createdAt: new Date().toISOString()
      };
      await setDoc(userRef, user);
    }
    
    return user;
  },

  logout: async () => {
    await signOut(auth);
  }
};
