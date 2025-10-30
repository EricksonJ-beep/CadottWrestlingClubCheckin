// tests/ui.test.js
/**
 * @jest-environment jsdom
 */

describe('UI Module', () => {
    let ui;
    let rosterContainer;

    beforeEach(() => {
        // Set up DOM
        document.body.innerHTML = `
            <div id="roster-container"></div>
        `;
        
        rosterContainer = document.getElementById('roster-container');

        // Clear module cache and reimport to get fresh instance
        jest.resetModules();
        ui = require('../src/js/ui').default;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('renderRoster', () => {
        test('should render athlete list correctly', () => {
            const athletes = [
                { name: 'John Doe', status: 'Checked In' },
                { name: 'Jane Smith', status: 'Not Checked In' },
                { name: 'Bob Johnson', status: 'Checked In' }
            ];

            ui.renderRoster(athletes);

            const athleteItems = rosterContainer.querySelectorAll('.athlete-item');
            expect(athleteItems).toHaveLength(3);
            
            expect(rosterContainer.textContent).toContain('John Doe');
            expect(rosterContainer.textContent).toContain('Jane Smith');
            expect(rosterContainer.textContent).toContain('Bob Johnson');
            expect(rosterContainer.textContent).toContain('Checked In');
        });

        test('should clear previous content before rendering', () => {
            rosterContainer.innerHTML = '<div>Old content</div>';
            
            const athletes = [{ name: 'New Athlete', status: 'Present' }];
            ui.renderRoster(athletes);

            expect(rosterContainer.textContent).not.toContain('Old content');
            expect(rosterContainer.textContent).toContain('New Athlete');
        });

        test('should render empty list when no athletes provided', () => {
            ui.renderRoster([]);

            expect(rosterContainer.innerHTML).toBe('');
            expect(rosterContainer.children).toHaveLength(0);
        });

        test('should handle athletes with various statuses', () => {
            const athletes = [
                { name: 'Athlete 1', status: 'Checked In' },
                { name: 'Athlete 2', status: 'Not Checked In' },
                { name: 'Athlete 3', status: 'Late' },
                { name: 'Athlete 4', status: 'Absent' }
            ];

            ui.renderRoster(athletes);

            expect(rosterContainer.textContent).toContain('Checked In');
            expect(rosterContainer.textContent).toContain('Not Checked In');
            expect(rosterContainer.textContent).toContain('Late');
            expect(rosterContainer.textContent).toContain('Absent');
        });

        test('should create proper HTML structure for each athlete', () => {
            const athletes = [{ name: 'Test Wrestler', status: 'Present' }];

            ui.renderRoster(athletes);

            const athleteItem = rosterContainer.querySelector('.athlete-item');
            expect(athleteItem).toBeTruthy();
            
            const spans = athleteItem.querySelectorAll('span');
            expect(spans).toHaveLength(2);
            expect(spans[0].textContent).toBe('Test Wrestler');
            expect(spans[1].textContent).toBe('Present');
        });
    });

    describe('showLoading', () => {
        test('should display loading message', () => {
            ui.showLoading();

            expect(rosterContainer.textContent).toContain('Loading...');
            expect(rosterContainer.querySelector('p')).toBeTruthy();
        });

        test('should replace existing content with loading message', () => {
            rosterContainer.innerHTML = '<div>Existing content</div>';
            
            ui.showLoading();

            expect(rosterContainer.textContent).toBe('Loading...');
            expect(rosterContainer.textContent).not.toContain('Existing content');
        });
    });

    describe('showError', () => {
        test('should display error message', () => {
            const errorMessage = 'Failed to load data';
            
            ui.showError(errorMessage);

            expect(rosterContainer.textContent).toContain(errorMessage);
        });

        test('should apply error class to paragraph', () => {
            ui.showError('Error occurred');

            const errorParagraph = rosterContainer.querySelector('p.error');
            expect(errorParagraph).toBeTruthy();
            expect(errorParagraph.textContent).toBe('Error occurred');
        });

        test('should handle different error messages', () => {
            const messages = [
                'Network error',
                'Database connection failed',
                'Authentication required',
                'Permission denied'
            ];

            messages.forEach(message => {
                ui.showError(message);
                expect(rosterContainer.textContent).toContain(message);
            });
        });

        test('should replace existing content with error message', () => {
            rosterContainer.innerHTML = '<div>Some content</div>';
            
            ui.showError('Something went wrong');

            expect(rosterContainer.textContent).toBe('Something went wrong');
            expect(rosterContainer.textContent).not.toContain('Some content');
        });
    });

    describe('UI Module Integration', () => {
        test('should handle switching between different states', () => {
            // Show loading
            ui.showLoading();
            expect(rosterContainer.textContent).toContain('Loading...');

            // Show roster
            const athletes = [{ name: 'Test', status: 'Present' }];
            ui.renderRoster(athletes);
            expect(rosterContainer.textContent).toContain('Test');
            expect(rosterContainer.textContent).not.toContain('Loading...');

            // Show error
            ui.showError('Error message');
            expect(rosterContainer.textContent).toContain('Error message');
            expect(rosterContainer.textContent).not.toContain('Test');
        });

        test('should maintain consistent behavior across multiple calls', () => {
            const athletes = [{ name: 'Wrestler', status: 'Active' }];

            ui.renderRoster(athletes);
            const firstRender = rosterContainer.innerHTML;

            ui.renderRoster(athletes);
            const secondRender = rosterContainer.innerHTML;

            expect(firstRender).toBe(secondRender);
        });
    });
});
