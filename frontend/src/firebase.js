//firebase config file to set up Firebase on Frontend.This tells the Frontend which Firebase project to communicate with
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDk15-h_BbqOpx3KU3vCbiV3Pm_6VcUCNE",
  authDomain: "focusflow-app-e20aa.firebaseapp.com",
  projectId: "focusflow-app-e20aa",
  storageBucket: "focusflow-app-e20aa.firebasestorage.app",
  messagingSenderId: "968186095740",
  appId: "1:968186095740:web:c560bead36e152abd841f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const db = getFirestore(app);