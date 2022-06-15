import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
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

firebase.initializeApp(firebaseConfig);

firebase.auth().signInAnonymously();

export function useUserConfiguration(user: any) {
  const [state, setState] = React.useState(null);

  React.useEffect(() => {
    if (!user) return;
    return firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .onSnapshot((snapshot: any) => {
        setState(snapshot.data());
      });
  }, [user]);

  async function reset() {
    await firebase.firestore().collection("users").doc(user.uid).delete();
  }

  return [state, reset];
}

export function setConfiguration(user: any, configuration: any) {
  firebase
    .firestore()
    .collection("configurations")
    .doc(user.uid)
    .set(configuration);
}

export default firebase;
