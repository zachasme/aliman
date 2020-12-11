import firebase from "https://cdn.skypack.dev/firebase/app";
import "https://cdn.skypack.dev/firebase/auth";
import "https://cdn.skypack.dev/firebase/firestore";

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

export default firebase;
