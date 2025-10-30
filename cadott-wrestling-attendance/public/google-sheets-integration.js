// Google Sheets Integration for Cadott Wrestling Attendance
// This script fetches athlete data from Google Sheets and loads it into the app

const SHEET_CONFIG = {
    spreadsheetId: '1LUMFApWy_czJopgv5ArJJzFmRogqmbBnJCsNzWubG34',
    gid: '1428893538',
    // Column mapping - B: Last Name, C: First Name, D: Grade
    columns: {
        lastName: 1,     // Column B (0-indexed, so B=1)
        firstName: 2,    // Column C
        grade: 3         // Column D
    }
};

// Function to fetch data from Google Sheets
async function fetchAthletesFromSheet() {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_CONFIG.spreadsheetId}/export?format=csv&gid=${SHEET_CONFIG.gid}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch spreadsheet. Make sure it is publicly accessible.');
        }
        
        const csvText = await response.text();
        const athletes = parseCSV(csvText);
        
        return athletes;
    } catch (error) {
        console.error('Error fetching from Google Sheets:', error);
        showError('Could not load athletes from Google Sheets. Using test data instead.');
        return window.testAthletes || [];
    }
}

// Parse CSV data into athlete objects
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const athletes = [];
    
    // Skip header row (index 0), start from index 1
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines
        
        // Parse CSV line (handling quoted values)
        const values = parseCSVLine(line);
        
        const lastName = values[SHEET_CONFIG.columns.lastName]?.trim();
        const firstName = values[SHEET_CONFIG.columns.firstName]?.trim();
        const grade = values[SHEET_CONFIG.columns.grade]?.trim();
        
        // Skip if missing required fields
        if (!firstName || !lastName || !grade) continue;
        
        // Determine grade group for filtering
        const gradeGroup = determineGradeGroup(grade);
        
        athletes.push({
            id: i,
            firstName: firstName,
            lastName: lastName,
            grade: grade,
            gradeGroup: gradeGroup,
            checkedIn: false
        });
    }
    
    return athletes;
}

// Parse a single CSV line (handles quoted values with commas)
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current); // Add last value
    
    return values;
}

// Determine grade group for tab filtering
function determineGradeGroup(grade) {
    const gradeStr = grade.toLowerCase().trim();
    
    // 4K-1st group: 4K, Kindergarten, 1st
    if (gradeStr.includes('4k') || 
        gradeStr.includes('k') ||
        gradeStr.includes('kindergarten') ||
        gradeStr.includes('1st') || 
        gradeStr.includes('first') ||
        gradeStr === '1') {
        return '4k-1';
    } 
    // 2nd-3rd group
    else if (gradeStr.includes('2nd') || 
             gradeStr.includes('3rd') ||
             gradeStr.includes('second') || 
             gradeStr.includes('third') ||
             gradeStr === '2' || gradeStr === '3') {
        return '2-3';
    } 
    // 4th-5th group
    else if (gradeStr.includes('4th') || 
             gradeStr.includes('5th') ||
             gradeStr.includes('fourth') || 
             gradeStr.includes('fifth') ||
             gradeStr === '4' || gradeStr === '5') {
        return '4-5';
    }
    
    return 'all'; // Default
}

// Show error message to user
function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'toast fixed bottom-4 right-4 bg-red-50 rounded-lg shadow-xl p-4 max-w-sm z-50 border-l-4 border-red-500';
    toast.innerHTML = `
        <div class="flex items-center">
            <span class="text-2xl mr-3">⚠️</span>
            <span class="font-semibold text-red-800">${message}</span>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Export for use in main app
window.fetchAthletesFromSheet = fetchAthletesFromSheet;
