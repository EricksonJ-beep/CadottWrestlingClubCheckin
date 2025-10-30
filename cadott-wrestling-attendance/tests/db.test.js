// tests/db.test.js
import { loadRoster, updateAttendance, addAthlete } from '../src/js/db';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

jest.mock('firebase/app');
jest.mock('firebase/firestore');

describe('Database Operations', () => {
    let mockDb;

    beforeEach(() => {
        jest.clearAllMocks();
        mockDb = {};
        getFirestore.mockReturnValue(mockDb);
    });

    describe('loadRoster', () => {
        test('should load and map roster data correctly', async () => {
            const mockDocs = [
                { id: 'id1', data: () => ({ name: 'Wrestler 1', grade: 9, weight: 150 }) },
                { id: 'id2', data: () => ({ name: 'Wrestler 2', grade: 10, weight: 165 }) },
                { id: 'id3', data: () => ({ name: 'Wrestler 3', grade: 11, weight: 175 }) }
            ];
            
            getDocs.mockResolvedValue({ docs: mockDocs });
            collection.mockReturnValue('roster-collection');

            const roster = await loadRoster();

            expect(collection).toHaveBeenCalledWith(mockDb, 'roster');
            expect(getDocs).toHaveBeenCalledWith('roster-collection');
            expect(roster).toHaveLength(3);
            expect(roster[0]).toEqual({ id: 'id1', name: 'Wrestler 1', grade: 9, weight: 150 });
            expect(roster[1].name).toBe('Wrestler 2');
        });

        test('should return empty array when no roster data exists', async () => {
            getDocs.mockResolvedValue({ docs: [] });
            collection.mockReturnValue('roster-collection');

            const roster = await loadRoster();

            expect(roster).toEqual([]);
            expect(roster).toHaveLength(0);
        });

        test('should handle errors when loading roster', async () => {
            const error = new Error('Database connection failed');
            getDocs.mockRejectedValue(error);
            collection.mockReturnValue('roster-collection');

            await expect(loadRoster()).rejects.toThrow('Database connection failed');
        });
    });

    describe('updateAttendance', () => {
        test('should update attendance for specific athlete', async () => {
            const athleteId = 'athlete-456';
            const attendanceData = {
                checkedIn: true,
                checkInTime: '2025-10-30T10:00:00Z',
                sessionId: 'session-123'
            };

            doc.mockReturnValue('athlete-doc-ref');
            updateDoc.mockResolvedValue();

            await updateAttendance(athleteId, attendanceData);

            expect(doc).toHaveBeenCalledWith(mockDb, 'roster', athleteId);
            expect(updateDoc).toHaveBeenCalledWith('athlete-doc-ref', attendanceData);
        });

        test('should handle update errors gracefully', async () => {
            const athleteId = 'athlete-789';
            const attendanceData = { checkedIn: true };
            const error = new Error('Update failed');

            doc.mockReturnValue('athlete-doc-ref');
            updateDoc.mockRejectedValue(error);

            await expect(updateAttendance(athleteId, attendanceData)).rejects.toThrow('Update failed');
        });
    });

    describe('addAthlete', () => {
        test('should add new athlete with complete data', async () => {
            const athleteData = {
                name: 'New Wrestler',
                grade: 9,
                weight: 145,
                contactInfo: 'parent@email.com'
            };
            const mockDocRef = { id: 'new-athlete-id' };

            collection.mockReturnValue('roster-collection');
            addDoc.mockResolvedValue(mockDocRef);

            const result = await addAthlete(athleteData);

            expect(collection).toHaveBeenCalledWith(mockDb, 'roster');
            expect(addDoc).toHaveBeenCalledWith('roster-collection', athleteData);
        });

        test('should handle adding athlete with minimal data', async () => {
            const minimalData = { name: 'Minimal Wrestler' };
            const mockDocRef = { id: 'minimal-id' };

            collection.mockReturnValue('roster-collection');
            addDoc.mockResolvedValue(mockDocRef);

            await addAthlete(minimalData);

            expect(addDoc).toHaveBeenCalledWith('roster-collection', minimalData);
        });

        test('should handle errors when adding athlete', async () => {
            const athleteData = { name: 'Error Wrestler' };
            const error = new Error('Failed to add athlete');

            collection.mockReturnValue('roster-collection');
            addDoc.mockRejectedValue(error);

            await expect(addAthlete(athleteData)).rejects.toThrow('Failed to add athlete');
        });
    });
});
