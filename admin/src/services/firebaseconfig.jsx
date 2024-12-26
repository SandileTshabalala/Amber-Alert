import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};


const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP)
export const STORAGE = getStorage(FIREBASE_APP)

export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export async function lookupUser(idToken) {
  try {
      const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
          {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  idToken: idToken,
              }),
          }
      );
      const data = await response.json();
      if (response.ok) {
        //log
          console.log("User lookup successful:", data);

          // Check if the user exists and has custom attributes adn has superuser set to treu
          if (data.users && data.users.length > 0 && data.users[0].customAttributes) {

              // Parse custom attributes
              const customAttributes = JSON.parse(data.users[0].customAttributes);
              console.log("Parsed custom attributes:", customAttributes);

              // Return the custom attributes
              return customAttributes;
          } else {
              console.error("User does not have custom attributes or user data is invalid");
              return { success: false, error: "No custom attributes found" };
          }
      } else {
          console.error("User lookup failed:", data.error);
          return { success: false, error: data.error };
      }
  } catch (error) {
      console.error("Error looking up user:", error);
      return { success: false, error };
  }
}

export const logout = async () => {
  try {
    await signOut(FIREBASE_AUTH);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
