/**
 * Firebase Real-time Sync Module
 * Syncs attendance data across multiple devices using Firestore
 * Falls back to localStorage if offline or Firebase not configured
 */

(function() {
    'use strict';

    // Firebase SDK v9+ modular imports
    let db = null;
    let auth = null;
    let isFirebaseReady = false;
    let unsubscribeListeners = [];

    // Storage keys
    const ATTENDANCE_KEY = 'attendanceRecordsV1';
    const PRACTICE_DATES_KEY = 'practiceDatesV1';
    const PRACTICE_FINALIZED_KEY = 'practiceFinalizedV1';
    const ATHLETES_KEY = 'athletesData';
    const FIREBASE_ENABLED_KEY = 'firebaseSyncEnabled';

    // Check if Firebase sync is enabled
    function isFirebaseEnabled() {
        try {
            return localStorage.getItem(FIREBASE_ENABLED_KEY) === 'true';
        } catch (e) {
            return false;
        }
    }

    // Initialize Firebase
    async function initializeFirebase() {
        try {
            // Check if Firebase config exists
            if (!window.firebaseConfig || window.firebaseConfig.apiKey === 'YOUR_API_KEY_HERE') {
                console.log('Firebase not configured. Using localStorage only.');
                return false;
            }

            // Import Firebase modules from CDN
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
            const { getFirestore, collection, doc, setDoc, getDoc, getDocs, onSnapshot, deleteField, updateDoc } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            const { getAuth, signInAnonymously, onAuthStateChanged } = 
                await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');

            // Initialize Firebase app
            const app = initializeApp(window.firebaseConfig);
            db = getFirestore(app);
            auth = getAuth(app);

            // Expose db globally for app-display.js
            window.db = db;

            // Store Firestore functions globally
            window.firestoreFunctions = {
                collection,
                doc,
                setDoc,
                getDoc,
                getDocs,
                onSnapshot,
                deleteField,
                updateDoc
            };

            // Sign in anonymously (no login required, but needed for Firestore security)
            await signInAnonymously(auth);
            
            isFirebaseReady = true;
            console.log('✅ Firebase initialized successfully');
            
            // Enable Firebase sync by default
            if (localStorage.getItem(FIREBASE_ENABLED_KEY) === null) {
                localStorage.setItem(FIREBASE_ENABLED_KEY, 'true');
            }

            return true;
        } catch (error) {
            console.warn('Firebase initialization failed:', error);
            console.log('Falling back to localStorage only.');
            return false;
        }
    }

    // Migrate localStorage data to Firebase
    async function migrateLocalStorageToFirebase() {
        if (!isFirebaseReady || !isFirebaseEnabled()) return;

        try {
            const { doc, setDoc, getDoc } = window.firestoreFunctions;

            // Migrate athletes
            const athletesData = localStorage.getItem(ATHLETES_KEY);
            if (athletesData) {
                const athletesDoc = doc(db, 'roster', 'athletes');
                const snapshot = await getDoc(athletesDoc);
                if (!snapshot.exists()) {
                    await setDoc(athletesDoc, {
                        athletes: JSON.parse(athletesData),
                        lastUpdated: new Date().toISOString()
                    });
                    console.log('✅ Athletes migrated to Firebase');
                }
            }

            // Migrate attendance records
            const attendanceData = localStorage.getItem(ATTENDANCE_KEY);
            if (attendanceData) {
                const attendanceDoc = doc(db, 'attendance', 'records');
                const snapshot = await getDoc(attendanceDoc);
                if (!snapshot.exists()) {
                    await setDoc(attendanceDoc, {
                        records: JSON.parse(attendanceData),
                        lastUpdated: new Date().toISOString()
                    });
                    console.log('✅ Attendance records migrated to Firebase');
                }
            }

            // Migrate practice dates
            const datesData = localStorage.getItem(PRACTICE_DATES_KEY);
            if (datesData) {
                const datesDoc = doc(db, 'attendance', 'practice-dates');
                const snapshot = await getDoc(datesDoc);
                if (!snapshot.exists()) {
                    await setDoc(datesDoc, {
                        dates: JSON.parse(datesData),
                        lastUpdated: new Date().toISOString()
                    });
                    console.log('✅ Practice dates migrated to Firebase');
                }
            }

            // Migrate finalized dates
            const finalizedData = localStorage.getItem(PRACTICE_FINALIZED_KEY);
            if (finalizedData) {
                const finalizedDoc = doc(db, 'attendance', 'finalized');
                const snapshot = await getDoc(finalizedDoc);
                if (!snapshot.exists()) {
                    await setDoc(finalizedDoc, {
                        finalized: JSON.parse(finalizedData),
                        lastUpdated: new Date().toISOString()
                    });
                    console.log('✅ Finalized dates migrated to Firebase');
                }
            }

        } catch (error) {
            console.error('Error migrating data to Firebase:', error);
        }
    }

    // Setup real-time listeners
    function setupRealtimeListeners() {
        if (!isFirebaseReady || !isFirebaseEnabled()) return;

        try {
            const { doc, onSnapshot } = window.firestoreFunctions;

            // Listen to athletes changes
            const athletesUnsub = onSnapshot(doc(db, 'roster', 'athletes'), (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    localStorage.setItem(ATHLETES_KEY, JSON.stringify(data.athletes || []));
                    
                    // Trigger a custom event to notify the app
                    window.dispatchEvent(new CustomEvent('firebase-athletes-updated', { 
                        detail: data.athletes 
                    }));
                }
            });
            unsubscribeListeners.push(athletesUnsub);

            // Listen to attendance records changes
            const attendanceUnsub = onSnapshot(doc(db, 'attendance', 'records'), (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(data.records || {}));
                    
                    // Trigger a custom event
                    window.dispatchEvent(new CustomEvent('firebase-attendance-updated', { 
                        detail: data.records 
                    }));
                }
            });
            unsubscribeListeners.push(attendanceUnsub);

            // Listen to practice dates changes
            const datesUnsub = onSnapshot(doc(db, 'attendance', 'practice-dates'), (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    localStorage.setItem(PRACTICE_DATES_KEY, JSON.stringify(data.dates || []));
                    
                    window.dispatchEvent(new CustomEvent('firebase-dates-updated', { 
                        detail: data.dates 
                    }));
                }
            });
            unsubscribeListeners.push(datesUnsub);

            // Listen to finalized dates changes
            const finalizedUnsub = onSnapshot(doc(db, 'attendance', 'finalized'), (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    localStorage.setItem(PRACTICE_FINALIZED_KEY, JSON.stringify(data.finalized || {}));
                    
                    window.dispatchEvent(new CustomEvent('firebase-finalized-updated', { 
                        detail: data.finalized 
                    }));
                }
            });
            unsubscribeListeners.push(finalizedUnsub);

            console.log('✅ Real-time listeners active');
        } catch (error) {
            console.error('Error setting up listeners:', error);
        }
    }

    // Sync functions that write to Firebase
    window.firebaseSync = {
        // Save athletes to Firebase
        saveAthletes: async function(athletes) {
            localStorage.setItem(ATHLETES_KEY, JSON.stringify(athletes));
            
            if (!isFirebaseReady || !isFirebaseEnabled()) return;
            
            try {
                const { doc, setDoc } = window.firestoreFunctions;
                await setDoc(doc(db, 'roster', 'athletes'), {
                    athletes: athletes,
                    lastUpdated: new Date().toISOString()
                });
            } catch (error) {
                console.error('Error saving athletes to Firebase:', error);
            }
        },

        // Save attendance record for a specific date
        saveAttendance: async function(date, athleteKey, isPresent) {
            // Update localStorage
            const records = JSON.parse(localStorage.getItem(ATTENDANCE_KEY) || '{}');
            if (!records[date]) records[date] = {};
            
            if (isPresent) {
                records[date][athleteKey] = true;
            } else {
                delete records[date][athleteKey];
            }
            
            localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
            
            if (!isFirebaseReady || !isFirebaseEnabled()) return;
            
            try {
                const { doc, setDoc } = window.firestoreFunctions;
                await setDoc(doc(db, 'attendance', 'records'), {
                    records: records,
                    lastUpdated: new Date().toISOString()
                });
            } catch (error) {
                console.error('Error saving attendance to Firebase:', error);
            }
        },

        // Add practice date
        addPracticeDate: async function(date) {
            const dates = JSON.parse(localStorage.getItem(PRACTICE_DATES_KEY) || '[]');
            if (!dates.includes(date)) {
                dates.push(date);
                dates.sort();
                localStorage.setItem(PRACTICE_DATES_KEY, JSON.stringify(dates));
            }
            
            if (!isFirebaseReady || !isFirebaseEnabled()) return;
            
            try {
                const { doc, setDoc } = window.firestoreFunctions;
                await setDoc(doc(db, 'attendance', 'practice-dates'), {
                    dates: dates,
                    lastUpdated: new Date().toISOString()
                });
            } catch (error) {
                console.error('Error saving practice dates to Firebase:', error);
            }
        },

        // Finalize a practice date
        finalizePractice: async function(date, isFinalized) {
            const finalized = JSON.parse(localStorage.getItem(PRACTICE_FINALIZED_KEY) || '{}');
            finalized[date] = isFinalized;
            localStorage.setItem(PRACTICE_FINALIZED_KEY, JSON.stringify(finalized));
            
            if (!isFirebaseReady || !isFirebaseEnabled()) return;
            
            try {
                const { doc, setDoc } = window.firestoreFunctions;
                await setDoc(doc(db, 'attendance', 'finalized'), {
                    finalized: finalized,
                    lastUpdated: new Date().toISOString()
                });
            } catch (error) {
                console.error('Error saving finalized status to Firebase:', error);
            }
        },

        // Reset all attendance
        resetAllAttendance: async function() {
            localStorage.setItem(ATTENDANCE_KEY, '{}');
            localStorage.setItem(PRACTICE_DATES_KEY, '[]');
            localStorage.setItem(PRACTICE_FINALIZED_KEY, '{}');
            
            if (!isFirebaseReady || !isFirebaseEnabled()) return;
            
            try {
                const { doc, setDoc } = window.firestoreFunctions;
                await setDoc(doc(db, 'attendance', 'records'), {
                    records: {},
                    lastUpdated: new Date().toISOString()
                });
                await setDoc(doc(db, 'attendance', 'practice-dates'), {
                    dates: [],
                    lastUpdated: new Date().toISOString()
                });
                await setDoc(doc(db, 'attendance', 'finalized'), {
                    finalized: {},
                    lastUpdated: new Date().toISOString()
                });
            } catch (error) {
                console.error('Error resetting attendance in Firebase:', error);
            }
        },

        // Reset today's attendance
        resetTodayAttendance: async function(todayKey) {
            const records = JSON.parse(localStorage.getItem(ATTENDANCE_KEY) || '{}');
            delete records[todayKey];
            localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
            
            const dates = JSON.parse(localStorage.getItem(PRACTICE_DATES_KEY) || '[]');
            const updatedDates = dates.filter(d => d !== todayKey);
            localStorage.setItem(PRACTICE_DATES_KEY, JSON.stringify(updatedDates));
            
            const finalized = JSON.parse(localStorage.getItem(PRACTICE_FINALIZED_KEY) || '{}');
            delete finalized[todayKey];
            localStorage.setItem(PRACTICE_FINALIZED_KEY, JSON.stringify(finalized));
            
            if (!isFirebaseReady || !isFirebaseEnabled()) return;
            
            try {
                const { doc, setDoc } = window.firestoreFunctions;
                await setDoc(doc(db, 'attendance', 'records'), {
                    records: records,
                    lastUpdated: new Date().toISOString()
                });
                await setDoc(doc(db, 'attendance', 'practice-dates'), {
                    dates: updatedDates,
                    lastUpdated: new Date().toISOString()
                });
                await setDoc(doc(db, 'attendance', 'finalized'), {
                    finalized: finalized,
                    lastUpdated: new Date().toISOString()
                });
            } catch (error) {
                console.error('Error resetting today in Firebase:', error);
            }
        },

        // Check if Firebase is ready and enabled
        isReady: function() {
            return isFirebaseReady && isFirebaseEnabled();
        },

        // Get Firebase status
        getStatus: function() {
            return {
                ready: isFirebaseReady,
                enabled: isFirebaseEnabled(),
                hasConfig: window.firebaseConfig && window.firebaseConfig.apiKey !== 'YOUR_API_KEY_HERE'
            };
        }
    };

    // Initialize on page load
    window.addEventListener('DOMContentLoaded', async function() {
        const initialized = await initializeFirebase();
        if (initialized) {
            await migrateLocalStorageToFirebase();
            setupRealtimeListeners();
        }
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
        unsubscribeListeners.forEach(unsub => unsub());
    });

})();
