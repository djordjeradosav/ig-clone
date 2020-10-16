import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDzCy4vkMfWWyRe3EAhvBBoSY4CkuNcq-w",
  authDomain: "instagram-clone-30071.firebaseapp.com",
  databaseURL: "https://instagram-clone-30071.firebaseio.com",
  projectId: "instagram-clone-30071",
  storageBucket: "instagram-clone-30071.appspot.com",
  messagingSenderId: "756118675339",
  appId: "1:756118675339:web:5bd5bec17c7bec2cea198e",
  measurementId: "G-LTXRY7XFH9",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
