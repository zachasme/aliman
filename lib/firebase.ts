import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  setDoc,
  getFirestore,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import React from "react";

const firebaseConfig = {
  apiKey: "AIzaSyDKXAbzf26WdBaZvrqq5LpLrB-0yQJ_9-4",
  authDomain: "arch-linux-installation.firebaseapp.com",
  databaseURL: "https://arch-linux-installation.firebaseio.com",
  projectId: "arch-linux-installation",
  storageBucket: "arch-linux-installation.appspot.com",
  messagingSenderId: "669864844601",
  appId: "1:669864844601:web:d8012ae654236cdd735ce8",
  measurementId: "G-R8X2TG5GPE",
};

//const firebase = window.firebase;

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
signInAnonymously(auth);

export function useUserConfiguration(user: any) {
  const [state, setState] = React.useState(null);

  React.useEffect(() => {
    if (!user) return;

    return onSnapshot(doc(db, "users", user.uid), (snapshot: any) => {
      setState(snapshot.data());
    });
  }, [user]);

  async function reset() {
    deleteDoc(doc(db, "users", user.uid));
  }

  return [state, reset];
}

export function setConfiguration(user: any, configuration: any) {
  setDoc(doc(db, "users", user.uid), configuration);
}

export default app;
