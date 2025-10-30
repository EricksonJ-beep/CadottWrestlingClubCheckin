// This file contains functions for updating the user interface, including rendering the roster and handling user interactions.

const ui = (() => {
    const rosterContainer = document.getElementById('roster-container');

    const renderRoster = (athletes) => {
        rosterContainer.innerHTML = '';
        athletes.forEach(athlete => {
            const athleteDiv = document.createElement('div');
            athleteDiv.className = 'athlete-item';
            athleteDiv.innerHTML = `
                <span>${athlete.name}</span>
                <span>${athlete.status}</span>
            `;
            rosterContainer.appendChild(athleteDiv);
        });
    };

    const showLoading = () => {
        rosterContainer.innerHTML = '<p>Loading...</p>';
    };

    const showError = (message) => {
        rosterContainer.innerHTML = `<p class="error">${message}</p>`;
    };

    return {
        renderRoster,
        showLoading,
        showError
    };
})();

export default ui;