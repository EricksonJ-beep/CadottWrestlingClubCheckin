// tests/CheckInTabletView.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CheckInTabletView from '../src/components/CheckInTabletView';

describe('CheckInTabletView Component', () => {
    const mockAthletes = [
        { id: '1', name: 'John Doe', grade: 9, weight: 152 },
        { id: '2', name: 'Jane Smith', grade: 10, weight: 145 },
        { id: '3', name: 'Bob Johnson', grade: 11, weight: 165 }
    ];

    let mockOnCheckIn;

    beforeEach(() => {
        mockOnCheckIn = jest.fn();
    });

    test('should render tablet view header', () => {
        render(<CheckInTabletView athletes={mockAthletes} onCheckIn={mockOnCheckIn} />);

        expect(screen.getByText('Check-In for Practice')).toBeInTheDocument();
    });

    test('should render all athletes', () => {
        render(<CheckInTabletView athletes={mockAthletes} onCheckIn={mockOnCheckIn} />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    test('should render check-in button for each athlete', () => {
        render(<CheckInTabletView athletes={mockAthletes} onCheckIn={mockOnCheckIn} />);

        const checkInButtons = screen.getAllByText('Check In');
        expect(checkInButtons).toHaveLength(3);
    });

    test('should call onCheckIn with correct athlete id when button clicked', () => {
        render(<CheckInTabletView athletes={mockAthletes} onCheckIn={mockOnCheckIn} />);

        const buttons = screen.getAllByText('Check In');
        fireEvent.click(buttons[0]); // Click first button

        expect(mockOnCheckIn).toHaveBeenCalledWith('1');
        expect(mockOnCheckIn).toHaveBeenCalledTimes(1);
    });

    test('should handle multiple check-ins', () => {
        render(<CheckInTabletView athletes={mockAthletes} onCheckIn={mockOnCheckIn} />);

        const buttons = screen.getAllByText('Check In');
        
        fireEvent.click(buttons[0]);
        fireEvent.click(buttons[1]);
        fireEvent.click(buttons[2]);

        expect(mockOnCheckIn).toHaveBeenCalledTimes(3);
        expect(mockOnCheckIn).toHaveBeenNthCalledWith(1, '1');
        expect(mockOnCheckIn).toHaveBeenNthCalledWith(2, '2');
        expect(mockOnCheckIn).toHaveBeenNthCalledWith(3, '3');
    });

    test('should render with proper Tailwind CSS classes', () => {
        const { container } = render(<CheckInTabletView athletes={mockAthletes} onCheckIn={mockOnCheckIn} />);

        // Check for main container classes
        expect(container.querySelector('.flex.flex-col.items-center')).toBeInTheDocument();
        expect(container.querySelector('.h-screen.bg-gray-100')).toBeInTheDocument();

        // Check for button styling
        const buttons = container.querySelectorAll('button');
        buttons.forEach(button => {
            expect(button.classList.contains('bg-blue-500')).toBe(true);
            expect(button.classList.contains('text-white')).toBe(true);
        });
    });

    test('should render empty state when no athletes provided', () => {
        render(<CheckInTabletView athletes={[]} onCheckIn={mockOnCheckIn} />);

        expect(screen.getByText('Check-In for Practice')).toBeInTheDocument();
        expect(screen.queryByText('Check In')).not.toBeInTheDocument();
    });

    test('should handle undefined onCheckIn gracefully', () => {
        // Should not throw an error even without onCheckIn
        expect(() => {
            render(<CheckInTabletView athletes={mockAthletes} />);
        }).not.toThrow();
    });

    test('should apply hover styles to buttons', () => {
        const { container } = render(<CheckInTabletView athletes={mockAthletes} onCheckIn={mockOnCheckIn} />);

        const buttons = container.querySelectorAll('button');
        buttons.forEach(button => {
            expect(button.classList.contains('hover:bg-blue-600')).toBe(true);
        });
    });

    test('should use grid layout for athlete cards', () => {
        const { container } = render(<CheckInTabletView athletes={mockAthletes} onCheckIn={mockOnCheckIn} />);

        const gridContainer = container.querySelector('.grid.grid-cols-1');
        expect(gridContainer).toBeInTheDocument();
        expect(gridContainer.classList.contains('gap-4')).toBe(true);
    });

    test('should render athlete cards with proper styling', () => {
        const { container } = render(<CheckInTabletView athletes={mockAthletes} onCheckIn={mockOnCheckIn} />);

        const athleteCards = container.querySelectorAll('.bg-white.p-4.rounded.shadow-md');
        expect(athleteCards).toHaveLength(3);
    });
});
