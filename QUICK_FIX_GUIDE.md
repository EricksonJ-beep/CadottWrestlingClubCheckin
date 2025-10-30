# Quick Test Fix Guide

This guide explains how to fix the 5 failing tests in the Cadott Wrestling Club Check-in application.

## Problem Summary

The failing tests are caused by **module-level Firebase initialization** in `db.js`. When tests try to mock Firebase, the real Firebase instance has already been created at import time.

## Solution: Refactor for Dependency Injection

### Option 1: Factory Function Pattern (Recommended)

Modify `src/js/db.js`:

```javascript
// Before (current - problematic)
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = { /* ... */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const loadRoster = async () => {
    const rosterCollection = collection(db, "roster"); // Uses module-level db
    // ...
};

// After (fixed)
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

let dbInstance = null;

export const initializeDatabase = (firebaseApp) => {
    dbInstance = getFirestore(firebaseApp);
    return dbInstance;
};

export const getDb = () => {
    if (!dbInstance) {
        throw new Error('Database not initialized. Call initializeDatabase first.');
    }
    return dbInstance;
};

export const loadRoster = async () => {
    const db = getDb();
    const rosterCollection = collection(db, "roster");
    // ... rest of the code
};
```

### Option 2: Pass Database as Parameter

```javascript
export const loadRoster = async (database) => {
    const db = database || getDb(); // Use provided or default
    const rosterCollection = collection(db, "roster");
    const rosterSnapshot = await getDocs(rosterCollection);
    return rosterSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
```

### Option 3: Use Jest's Module Mock Factory

Modify the test file to completely replace the module:

```javascript
// At the top of db.test.js
jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(() => ({})),
    collection: jest.fn((db, name) => ({ _collectionName: name })),
    getDocs: jest.fn(),
    addDoc: jest.fn(),
    updateDoc: jest.fn(),
    doc: jest.fn()
}));

// Mock the entire db module BEFORE importing
jest.mock('../src/js/db', () => {
    const actualModule = jest.requireActual('../src/js/db');
    return {
        ...actualModule,
        // Override specific functions if needed
    };
});
```

## Quick Fixes for Each Failing Test

### Fix for `db.test.js` Tests

Update the test setup:

```javascript
// tests/db.test.js
import { getFirestore } from 'firebase/firestore';

// Add this before tests
jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(() => ({ name: 'test-app' }))
}));

// In beforeEach
beforeEach(() => {
    jest.clearAllMocks();
    mockDb = { name: 'mock-firestore' };
    getFirestore.mockReturnValue(mockDb);
});
```

### Fix for `AttendanceList.test.js`

Create a proper mock for the db module:

```javascript
// tests/AttendanceList.test.js
jest.mock('../src/js/db', () => {
    const mockCollection = jest.fn();
    const mockGet = jest.fn();
    
    mockCollection.mockReturnValue({
        get: mockGet
    });

    return {
        db: {
            collection: mockCollection
        }
    };
});

// In test
test('should render athletes after loading', async () => {
    const { db } = require('../src/js/db');
    
    const mockDocs = [
        { id: '1', data: () => ({ name: 'John Doe', checkedIn: true }) }
    ];
    
    db.collection.mockReturnValue({
        get: jest.fn().mockResolvedValue({ docs: mockDocs })
    });

    render(<AttendanceList />);
    
    await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
});
```

## Alternative: Accept Mocking Limitations

If refactoring is not immediately possible, you can:

1. **Mark tests as TODO** temporarily:
   ```javascript
   test.todo('should load and map roster data correctly');
   ```

2. **Skip problematic tests**:
   ```javascript
   test.skip('should load and map roster data correctly', async () => {
       // Test code
   });
   ```

3. **Run only integration tests** that test the real Firebase connection (requires Firebase emulator).

## Verification Steps

After implementing fixes:

1. Run tests:
   ```bash
   npm test
   ```

2. Check coverage:
   ```bash
   npm test -- --coverage
   ```

3. Verify all tests pass:
   ```bash
   npm test -- --verbose
   ```

Expected result: **63/63 tests passing (100%)**

## Long-term Recommendations

1. **Use Firebase Emulator** for integration testing
2. **Implement dependency injection** throughout the application
3. **Add TypeScript** for better type safety and refactoring support
4. **Create test utilities** for common Firebase mock patterns
5. **Set up CI/CD** to run tests automatically on commits

---

Need help? Check the main TEST_REPORT.md for more details.
