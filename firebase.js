// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARmNkdYqCrgrdXZt8OsxwimbQoDRZyUCI",
  authDomain: "flashcards-ce78d.firebaseapp.com",
  projectId: "flashcards-ce78d",
  storageBucket: "flashcards-ce78d.appspot.com",
  messagingSenderId: "136593858814",
  appId: "1:136593858814:web:a03a0443389c17aa28c5af",
  measurementId: "G-J9707S2ZY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);