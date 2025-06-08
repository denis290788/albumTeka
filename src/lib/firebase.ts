// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "REMOVED_API_KEY",
    authDomain: "albumteka-d0226.firebaseapp.com",
    projectId: "albumteka-d0226",
    storageBucket: "albumteka-d0226.firebasestorage.app",
    messagingSenderId: "55624650348",
    appId: "1:55624650348:web:b2505e50f2d726a0459249",
    measurementId: "G-C1DW506ZRH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// const analytics = getAnalytics(app);
