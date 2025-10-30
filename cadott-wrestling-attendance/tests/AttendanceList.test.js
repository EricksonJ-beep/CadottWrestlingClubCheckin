// tests/AttendanceList.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AttendanceList from '../src/components/AttendanceList';

// Mock the db module
jest.mock('../src/js/db', () => ({
    db: {
        collection: jest.fn(() => ({
            get: jest.fn()
        }))
    }
}));

describe('AttendanceList Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should render loading state initially', () => {
        const { db } = require('../src/js/db');
        db.collection().get.mockImplementation(() => new Promise(() => {})); // Never resolves

        render(<AttendanceList />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('should render athletes after loading', async () => {
        const mockAthletes = [
            { id: '1', name: 'John Doe', checkedIn: true },
            { id: '2', name: 'Jane Smith', checkedIn: false },
            { id: '3', name: 'Bob Johnson', checkedIn: true }
        ];

        const { db } = require('../src/js/db');
        db.collection().get.mockResolvedValue({
            docs: mockAthletes.map(athlete => ({
                id: athlete.id,
                data: () => ({ name: athlete.name, checkedIn: athlete.checkedIn })
            }))
        });

        render(<AttendanceList />);

        await waitFor(() => {
            expect(screen.getByText('Attendance List')).toBeInTheDocument();
        });

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    test('should display check-in status correctly', async () => {
        const mockAthletes = [
            { id: '1', name: 'Checked In Wrestler', checkedIn: true },
            { id: '2', name: 'Not Checked In Wrestler', checkedIn: false }
        ];

        const { db } = require('../src/js/db');
        db.collection().get.mockResolvedValue({
            docs: mockAthletes.map(athlete => ({
                id: athlete.id,
                data: () => ({ name: athlete.name, checkedIn: athlete.checkedIn })
            }))
        });

        render(<AttendanceList />);

        await waitFor(() => {
            expect(screen.getByText('Checked In')).toBeInTheDocument();
            expect(screen.getByText('Not Checked In')).toBeInTheDocument();
        });
    });

    test('should handle empty athlete list', async () => {
        const { db } = require('../src/js/db');
        db.collection().get.mockResolvedValue({ docs: [] });

        render(<AttendanceList />);

        await waitFor(() => {
            expect(screen.getByText('Attendance List')).toBeInTheDocument();
        });

        // Should render the header but no athletes
        expect(screen.queryByText('Checked In')).not.toBeInTheDocument();
    });

    test('should handle fetch errors gracefully', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        const { db } = require('../src/js/db');
        db.collection().get.mockRejectedValue(new Error('Fetch failed'));

        render(<AttendanceList />);

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error fetching athletes: ',
            expect.any(Error)
        );

        consoleErrorSpy.mockRestore();
    });

    test('should render with proper CSS classes', async () => {
        const { db } = require('../src/js/db');
        db.collection().get.mockResolvedValue({ docs: [] });

        const { container } = render(<AttendanceList />);

        await waitFor(() => {
            expect(container.querySelector('.attendance-list')).toBeInTheDocument();
        });

        expect(container.querySelector('.text-xl')).toBeInTheDocument();
        expect(container.querySelector('.font-bold')).toBeInTheDocument();
    });
});
