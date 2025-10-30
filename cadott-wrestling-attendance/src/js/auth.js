// src/js/auth.js

import { getAuth, signInAnonymously } from "firebase/auth";

export const signIn = async (initialAuthToken) => {
    try {
        // Sign in anonymously
        const auth = getAuth();
        const userCredential = await signInAnonymously(auth);
        console.log("User signed in:", userCredential.user);
    } catch (error) {
        console.error("Error signing in:", error);
    }
};

export const getCurrentUser = () => {
    const auth = getAuth();
    return auth.currentUser;
};

export const signOutUser = async () => {
    try {
        const auth = getAuth();
        await auth.signOut();
        console.log("User signed out");
    } catch (error) {
        console.error("Error signing out:", error);
    }
};