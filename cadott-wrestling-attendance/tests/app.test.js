// tests/app.test.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

jest.mock('firebase/app');
jest.mock('firebase/auth');
jest.mock('firebase/firestore');

describe('Cadott Wrestling Attendance Tracker - Firebase Integration', () => {
    let mockApp;
    let mockAuth;
    let mockDb;

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockApp = { name: 'Cadott Wrestling' };
        mockAuth = { currentUser: null };
        mockDb = {};

        initializeApp.mockReturnValue(mockApp);
        getAuth.mockReturnValue(mockAuth);
        getFirestore.mockReturnValue(mockDb);
    });

    describe('Firebase Initialization', () => {
        test('should initialize Firebase app with config', () => {
            const config = {
                apiKey: 'test-key',
                authDomain: 'test.firebaseapp.com',
                projectId: 'test-project'
            };
            
            const app = initializeApp(config);
            
            expect(initializeApp).toHaveBeenCalledWith(config);
            expect(app).toBeDefined();
            expect(app.name).toBe('Cadott Wrestling');
        });

        test('should get auth instance', () => {
            const auth = getAuth();
            
            expect(getAuth).toHaveBeenCalled();
            expect(auth).toBeDefined();
        });

        test('should get firestore instance', () => {
            const db = getFirestore();
            
            expect(getFirestore).toHaveBeenCalled();
            expect(db).toBeDefined();
        });
    });

    describe('Authentication', () => {
        test('should sign in anonymously', async () => {
            const mockUserCredential = {
                user: { uid: 'test-user-123', isAnonymous: true }
            };
            signInAnonymously.mockResolvedValue(mockUserCredential);

            const result = await signInAnonymously(mockAuth);

            expect(signInAnonymously).toHaveBeenCalledWith(mockAuth);
            expect(result.user.uid).toBe('test-user-123');
            expect(result.user.isAnonymous).toBe(true);
        });

        test('should handle authentication errors', async () => {
            const error = new Error('Auth failed');
            signInAnonymously.mockRejectedValue(error);

            await expect(signInAnonymously(mockAuth)).rejects.toThrow('Auth failed');
        });
    });

    describe('Firestore Operations', () => {
        test('should fetch roster data', async () => {
            const mockDocs = [
                { id: '1', data: () => ({ name: 'John Doe', grade: 9, weight: 152 }) },
                { id: '2', data: () => ({ name: 'Jane Smith', grade: 10, weight: 145 }) }
            ];
            const mockSnapshot = { docs: mockDocs };
            
            getDocs.mockResolvedValue(mockSnapshot);
            collection.mockReturnValue('mock-collection');

            const snapshot = await getDocs(collection(mockDb, 'roster'));

            expect(collection).toHaveBeenCalledWith(mockDb, 'roster');
            expect(getDocs).toHaveBeenCalledWith('mock-collection');
            expect(snapshot.docs).toHaveLength(2);
            expect(snapshot.docs[0].data().name).toBe('John Doe');
        });

        test('should add new athlete to roster', async () => {
            const newAthlete = { 
                name: 'New Wrestler', 
                grade: 9, 
                weight: 150 
            };
            const mockDocRef = { id: 'new-doc-id' };
            
            addDoc.mockResolvedValue(mockDocRef);
            collection.mockReturnValue('mock-collection');

            const docRef = await addDoc(collection(mockDb, 'roster'), newAthlete);

            expect(collection).toHaveBeenCalledWith(mockDb, 'roster');
            expect(addDoc).toHaveBeenCalledWith('mock-collection', newAthlete);
            expect(docRef.id).toBe('new-doc-id');
        });

        test('should update athlete attendance', async () => {
            const athleteId = 'athlete-123';
            const attendanceData = { 
                checkedIn: true, 
                timestamp: new Date().toISOString() 
            };
            
            doc.mockReturnValue('mock-doc-ref');
            updateDoc.mockResolvedValue();

            await updateDoc(doc(mockDb, 'roster', athleteId), attendanceData);

            expect(doc).toHaveBeenCalledWith(mockDb, 'roster', athleteId);
            expect(updateDoc).toHaveBeenCalledWith('mock-doc-ref', attendanceData);
        });

        test('should handle firestore errors', async () => {
            const error = new Error('Firestore error');
            getDocs.mockRejectedValue(error);

            await expect(getDocs('mock-collection')).rejects.toThrow('Firestore error');
        });
    });
});