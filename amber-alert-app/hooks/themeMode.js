import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../services/firebaseConfig'; 

const themeMode= () => {
  const userId = FIREBASE_AUTH.currentUser?.uid;

  const getPreferredTheme = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const initializeTheme = async () => {
    if (!userId) return getPreferredTheme(); 

    try {
      const userDocRef = doc(FIREBASE_DB, 'public_users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const savedTheme = userDoc.data().preferences?.theme;
        return savedTheme || getPreferredTheme();
      } else {
        const preferredTheme = getPreferredTheme();
        await setDoc(userDocRef, { preferences: { theme: preferredTheme } }, { merge: true });
        return preferredTheme;
      }
    } catch (error) {
      console.error('Error fetching theme from Firebase:', error);
      return getPreferredTheme();
    }
  };

  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const loadTheme = async () => {
      const theme = await initializeTheme();
      setTheme(theme);
    };
    loadTheme();
  }, [userId]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (userId) {
      try {
        const userDocRef = doc(FIREBASE_DB, 'public_users', userId);
        await setDoc(userDocRef, { preferences: { theme: newTheme } }, { merge: true });
      } catch (error) {
        console.error('Error updating theme in Firebase:', error);
      }
    }
  };

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return { theme, toggleTheme };
}
export default themeMode;