// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7pDp9EUppSRaswYSE_p6tJHqXOP55oVQ",
  authDomain: "flashcard-cc8c1.firebaseapp.com",
  projectId: "flashcard-cc8c1",
  storageBucket: "flashcard-cc8c1.appspot.com",
  messagingSenderId: "153633435129",
  appId: "1:153633435129:web:7fa0c16e23f76b4e4da128",
  measurementId: "G-Q6SYSFBQ6D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);