// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCRQdAeL-opUgWMVD18sJWU0Mew9LQ1bqk",
    authDomain: "foam-6929f.firebaseapp.com",
    projectId: "foam-6929f",
    storageBucket: "foam-6929f.firebasestorage.app",
    messagingSenderId: "446271665143",
    appId: "1:446271665143:web:295cbc4487708c5d21f4f2",
    measurementId: "G-P97XQDL068"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
