// This file manages interactions with Firestore, including loading the roster and attendance data, and updating the database.

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load roster from Firestore
export const loadRoster = async () => {
    const rosterCollection = collection(db, "roster");
    const rosterSnapshot = await getDocs(rosterCollection);
    return rosterSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Update attendance for an athlete
export const updateAttendance = async (athleteId, attendanceData) => {
    const athleteDoc = doc(db, "roster", athleteId);
    await updateDoc(athleteDoc, attendanceData);
};

// Add a new athlete to the roster
export const addAthlete = async (athleteData) => {
    const rosterCollection = collection(db, "roster");
    await addDoc(rosterCollection, athleteData);
};