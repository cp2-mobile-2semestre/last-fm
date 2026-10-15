// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvFxcXxg-eAGm_hu_Hi-LRFFeJD_WsbHA",
  authDomain: "mini-lastfm.firebaseapp.com",
  projectId: "mini-lastfm",
  storageBucket: "mini-lastfm.firebasestorage.app",
  messagingSenderId: "41957302214",
  appId: "1:41957302214:web:40bcccded624c38b795cc7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const firestore = getFirestore(app)