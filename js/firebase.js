import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    updateDoc,
    increment
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDyY84RGqsixwaYmbT655yWtF67V3PiVtM",
    authDomain: "ganpati-invitation-845f3.firebaseapp.com",
    projectId: "ganpati-invitation-845f3",
    storageBucket: "ganpati-invitation-845f3.firebasestorage.app",
    messagingSenderId: "1099063657708",
    appId: "1:1099063657708:web:8d28a9a3f2efc39f3b51c9"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export {
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    updateDoc,
    increment
};