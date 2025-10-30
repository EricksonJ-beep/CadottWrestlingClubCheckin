// tests/auth.test.js
import { signIn, getCurrentUser, signOutUser } from '../src/js/auth';
import { getAuth, signInAnonymously } from 'firebase/auth';

jest.mock('firebase/auth');

describe('Authentication Functions', () => {
    let mockAuth;
    let consoleLogSpy;
    let consoleErrorSpy;

    beforeEach(() => {
        jest.clearAllMocks();
        mockAuth = {
            currentUser: null,
            signOut: jest.fn()
        };
        getAuth.mockReturnValue(mockAuth);
        
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    describe('signIn', () => {
        test('should sign in anonymously and log success', async () => {
            const mockUserCredential = {
                user: { uid: 'anon-user-123', isAnonymous: true }
            };
            signInAnonymously.mockResolvedValue(mockUserCredential);

            await signIn();

            expect(signInAnonymously).toHaveBeenCalled();
            expect(consoleLogSpy).toHaveBeenCalledWith('User signed in:', mockUserCredential.user);
        });

        test('should handle sign in errors', async () => {
            const error = new Error('Authentication failed');
            signInAnonymously.mockRejectedValue(error);

            await signIn();

            expect(signInAnonymously).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error signing in:', error);
        });

        test('should accept initial auth token parameter', async () => {
            const mockUserCredential = {
                user: { uid: 'test-123' }
            };
            signInAnonymously.mockResolvedValue(mockUserCredential);

            await signIn('initial-token');

            expect(signInAnonymously).toHaveBeenCalled();
        });
    });

    describe('getCurrentUser', () => {
        test('should return current user when authenticated', () => {
            const mockUser = { uid: 'user-456', email: null, isAnonymous: true };
            mockAuth.currentUser = mockUser;

            const user = getCurrentUser();

            expect(user).toEqual(mockUser);
            expect(user.uid).toBe('user-456');
        });

        test('should return null when no user is authenticated', () => {
            mockAuth.currentUser = null;

            const user = getCurrentUser();

            expect(user).toBeNull();
        });
    });

    describe('signOutUser', () => {
        test('should sign out user successfully', async () => {
            mockAuth.signOut = jest.fn().mockResolvedValue();

            await signOutUser();

            expect(mockAuth.signOut).toHaveBeenCalled();
            expect(consoleLogSpy).toHaveBeenCalledWith('User signed out');
        });

        test('should handle sign out errors', async () => {
            const error = new Error('Sign out failed');
            mockAuth.signOut = jest.fn().mockRejectedValue(error);

            await signOutUser();

            expect(mockAuth.signOut).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error signing out:', error);
        });
    });
});
