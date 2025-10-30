// Main app script for displaying and managing athletes
(function() {
    let athletes = [];
    let currentFilter = 'all';
    const ATTENDANCE_STORAGE_KEY = 'attendanceRecordsV1';
    const PRACTICE_DATES_KEY = 'practiceDatesV1';

    // Initialize the app
        async function init() {
            // Try to load from Google Sheets first, fallback to test data
            if (window.fetchAthletesFromSheet) {
                showLoading();
                athletes = await window.fetchAthletesFromSheet();
                if (athletes.length === 0) {
                    athletes = window.testAthletes || [];
                } else {
                    setLastSyncDate(getTodayKey());
                }
            } else {
                athletes = window.testAthletes || [];
            }
        
            // Restore today's checked-in status from attendance history
            athletes.forEach(a => {
                a.checkedIn = getAttendanceForToday(buildAthleteKey(a));
            });

            setupEventListeners();
            renderAthletes();
            updateStats();
            scheduleDailyAutoRefresh();
        }

        // Helpers for daily auto-refresh
        function getTodayKey() {
            const d = new Date();
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }

        function getLastSyncDate() {
            try { return localStorage.getItem('sheetsLastSyncDate'); } catch (_) { return null; }
        }

        function setLastSyncDate(dateKey) {
            try { localStorage.setItem('sheetsLastSyncDate', dateKey); } catch (_) {}
        }

        // Refresh data from Google Sheets
        // isAuto: if true, show a different toast message
        window.refreshAthletes = async function(isAuto = false) {
            if (window.fetchAthletesFromSheet) {
                showLoading();
                const newAthletes = await window.fetchAthletesFromSheet();
                if (newAthletes.length > 0) {
                    athletes = newAthletes;
                    renderAthletes();
                    updateStats();
                    setLastSyncDate(getTodayKey());
                    showToast(isAuto ? '🔄 Auto-refreshed roster from Google Sheets' : '✨ Athlete list updated from Google Sheets!');
                }
            }
        };

        // Central time helpers (America/Chicago)
        function getCentralDateKey() {
            const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' });
            return fmt.format(new Date()); // YYYY-MM-DD
        }

        function getCentralTimeHM() {
            const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Chicago', hour12: false, hour: '2-digit', minute: '2-digit' });
            return fmt.format(new Date()); // HH:MM
        }

        // Schedule daily auto-refresh exactly at 5:00 PM Central
        function scheduleDailyAutoRefresh() {
            const doAutoRefreshIfNeeded = () => {
                const hm = getCentralTimeHM();
                const todayCentral = getCentralDateKey();
                const lastAutoCentral = (function(){ try { return localStorage.getItem('sheetsLastAutoCentralDate'); } catch (_) { return null; } })();
                if (hm === '17:00' && lastAutoCentral !== todayCentral) {
                    if (window.fetchAthletesFromSheet) {
                        window.refreshAthletes(true);
                        try { localStorage.setItem('sheetsLastAutoCentralDate', todayCentral); } catch (_) {}
                    }
                }
            };
            // Check every 30s to catch the minute
            setInterval(doAutoRefreshIfNeeded, 30 * 1000);
            // Also run once on load in case user opens at exactly 17:00
            doAutoRefreshIfNeeded();
        }
    
    // Show loading indicator
    function showLoading() {
        const loadingState = document.getElementById('loading-state');
        if (loadingState) {
            loadingState.classList.remove('hidden');
            loadingState.innerHTML = `
                <div class="text-center py-12">
                    <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mx-auto mb-4"></div>
                    <p class="text-xl font-semibold text-gray-700">Loading athletes from Google Sheets...</p>
                </div>
            `;
        }
    }

    // Remove duplicate simple refresh (kept enhanced refresh above)

    // Setup event listeners
    function setupEventListeners() {
        // Grade tab filtering
        const gradeTabs = document.querySelectorAll('.grade-tab');
        gradeTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                gradeTabs.forEach(t => {
                    t.classList.remove('active', 'bg-yellow-400', 'text-gray-800');
                    t.classList.add('bg-gray-200', 'text-gray-700');
                });
                
                // Add active class to clicked tab
                this.classList.add('active', 'bg-yellow-400', 'text-gray-800');
                this.classList.remove('bg-gray-200', 'text-gray-700');
                
                // Update filter
                currentFilter = this.dataset.grade;
                renderAthletes();
            });
        });

        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase();
                const filteredAthletes = athletes.filter(athlete => {
                    const fullName = `${athlete.firstName} ${athlete.lastName}`.toLowerCase();
                    return fullName.includes(searchTerm);
                });
                renderAthletes(filteredAthletes);
            });
        }
        
        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', window.refreshAthletes);
        }

        // Export CSV button
        const exportBtn = document.getElementById('export-csv-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportAttendanceCSV);
        }
    }

    // Render athletes to the grid
    function renderAthletes(athleteList = null) {
        const container = document.getElementById('athlete-list');
        const loadingState = document.getElementById('loading-state');
        const emptyState = document.getElementById('empty-state');
        
        if (loadingState) loadingState.classList.add('hidden');
        
        let displayAthletes = athleteList || athletes;
        
        // Filter by grade group if not "all"
        if (!athleteList && currentFilter !== 'all') {
            displayAthletes = athletes.filter(a => a.gradeGroup === currentFilter);
        }
        
        // Show empty state if no athletes
        if (displayAthletes.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }
        
        if (emptyState) emptyState.classList.add('hidden');
        
        // Sort by last name
        displayAthletes.sort((a, b) => a.lastName.localeCompare(b.lastName));
        
        // Generate HTML
        container.innerHTML = displayAthletes.map(athlete => {
            const key = buildAthleteKey(athlete);
            const summary = getAthleteAttendanceSummary(key);
            const summaryText = summary.total > 0 ? `Season: ${summary.present}/${summary.total} (${summary.percent}%)` : '';
            return `
            <div class="athlete-card ${athlete.checkedIn ? 'checked-in' : ''} bg-white p-5 rounded-xl shadow-md" data-id="${athlete.id}">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex-1">
                        <h3 class="font-bold text-lg text-gray-800">${athlete.firstName} ${athlete.lastName}</h3>
                        <p class="text-sm text-gray-600">Grade ${athlete.grade}${athlete.weight ? ' • ' + athlete.weight + ' lbs' : ''}</p>
                        ${summaryText ? `<p class=\"text-xs text-gray-500 mt-1\">${summaryText}</p>` : ''}
                    </div>
                    <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">
                        ${athlete.checkedIn ? '✅' : '🤼'}
                    </div>
                </div>
                <button class="check-in-btn w-full ${athlete.checkedIn ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'} text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200" 
                        onclick="toggleCheckIn(${athlete.id})">
                    ${athlete.checkedIn ? 'Check Out' : 'Check In'}
                </button>
            </div>`;
        }).join('');
    }

    // Toggle check-in status
    window.toggleCheckIn = function(athleteId) {
        const athlete = athletes.find(a => a.id === athleteId);
        if (athlete) {
            athlete.checkedIn = !athlete.checkedIn;
            // Persist today's attendance
            const key = buildAthleteKey(athlete);
            setAttendanceForToday(key, athlete.checkedIn);
            renderAthletes();
            updateStats();
            
            // Show toast notification
            showToast(`${athlete.firstName} ${athlete.lastName} ${athlete.checkedIn ? 'checked in' : 'checked out'}!`);
        }
    };

    // Update stats
    function updateStats() {
        const checkedInCount = athletes.filter(a => a.checkedIn).length;
        const totalCount = athletes.length;
        const attendanceRate = totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0;
        
        document.getElementById('checked-in-count').textContent = checkedInCount;
        document.getElementById('total-count').textContent = totalCount;
        document.getElementById('attendance-rate').textContent = attendanceRate + '%';

        // Update per-group counters (checked-in/total)
        updateGroupCounters();
    }

    function updateGroupCounters() {
        const groups = ['4k-1', '2-3', '4-5'];
        groups.forEach(g => {
            const total = athletes.filter(a => a.gradeGroup === g).length;
            const checked = athletes.filter(a => a.gradeGroup === g && a.checkedIn).length;
            const el = document.getElementById(`group-count-${g}`);
            if (el) {
                el.textContent = `(${checked}/${total})`;
            }

            // Apply heat gradient to the corresponding tab based on percent checked-in
            const tab = document.querySelector(`.grade-tab[data-grade="${g}"]`);
            if (tab) {
                const percent = total > 0 ? Math.max(0, Math.min(100, Math.round((checked / total) * 100))) : 0;

                // Desired mapping:
                // 0% => white; 1-49% => light red increasing; 50% => yellow; 51-99% => blend toward green; 100% => green
                let start, end, textColor = '#1f2937'; // default dark text

                if (total === 0 || percent === 0) {
                    // White start state
                    start = '#ffffff';
                    end = '#f8fafc'; // very light slate
                    textColor = '#1f2937';
                } else if (percent > 0 && percent < 50) {
                    // Light red that intensifies as percent approaches 50
                    const t = percent / 50; // 0..1
                    const sat = 30 + 40 * t; // 30%..70%
                    const light = 95 - 10 * t; // 95%..85%
                    start = `hsl(0, ${sat}%, ${Math.min(100, light + 4)}%)`;
                    end = `hsl(0, ${sat}%, ${light}%)`;
                    textColor = '#1f2937';
                } else if (percent === 50) {
                    // Yellow
                    start = 'hsl(50, 90%, 55%)';
                    end = 'hsl(45, 90%, 50%)';
                    textColor = '#1f2937';
                } else if (percent > 50 && percent < 100) {
                    // Transition from yellow toward green
                    const t = (percent - 50) / 50; // 0..1
                    const hue = 50 + 70 * t; // 50..120
                    const sat = 70; // keep vivid
                    const light = 55 - 10 * t; // 55%..45%
                    start = `hsl(${hue}, ${sat}%, ${light}%)`;
                    end = `hsl(${hue}, ${sat}%, ${Math.max(35, light - 5)}%)`;
                    textColor = percent >= 60 ? '#ffffff' : '#1f2937';
                } else {
                    // 100% green
                    start = 'hsl(120, 70%, 45%)';
                    end = 'hsl(120, 70%, 40%)';
                    textColor = '#ffffff';
                }

                tab.style.background = `linear-gradient(135deg, ${start} 0%, ${end} 100%)`;
                tab.style.color = textColor;
            }
        });
    }

    // Show toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast toast-success fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-sm z-50 border-l-4 border-green-500 animate-slide-in';
        toast.innerHTML = `
            <div class="flex items-center">
                <span class="text-2xl mr-3">✅</span>
                <span class="font-semibold">${message}</span>
            </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ---------- Attendance CSV export ----------
    function exportAttendanceCSV() {
        const records = (function(){ try { return JSON.parse(localStorage.getItem(ATTENDANCE_STORAGE_KEY) || '{}'); } catch(_) { return {}; } })();
        const dates = (function(){ try { return JSON.parse(localStorage.getItem(PRACTICE_DATES_KEY) || '[]'); } catch(_) { return []; } })();

        // Build a lookup from key to latest display info (name, grade)
        const info = new Map();
        athletes.forEach(a => {
            info.set(buildAthleteKey(a), { lastName: a.lastName, firstName: a.firstName, grade: a.grade });
        });

        // Get all unique athlete keys from current roster and historical records
        const allKeys = new Set([...Array.from(info.keys())]);
        for (const date of Object.keys(records)) {
            for (const key of Object.keys(records[date] || {})) {
                allKeys.add(key);
            }
        }

        // Sort athletes by last name
        const sortedKeys = Array.from(allKeys).sort((a, b) => {
            const aInfo = info.get(a) || keyToInfoFallback(a);
            const bInfo = info.get(b) || keyToInfoFallback(b);
            return aInfo.lastName.localeCompare(bInfo.lastName);
        });

        dates.sort();

        // Format dates as MM/DD/YYYY for header (e.g., 10/30/2025)
        function formatDateUS(dateKey) {
            try {
                const [y, m, d] = String(dateKey).split('-');
                if (!y || !m || !d) return dateKey;
                const mm = String(parseInt(m, 10)).padStart(2, '0');
                const dd = String(parseInt(d, 10)).padStart(2, '0');
                return `${mm}/${dd}/${y}`;
            } catch (_) {
                return dateKey;
            }
        }

        const formattedDates = dates.map(formatDateUS);

        // Build header: Athlete Name, Grade, then each formatted date
        const header = ['Athlete Name', 'Grade', ...formattedDates];
        const rows = [header];

        // Build each athlete row
        for (const key of sortedKeys) {
            const meta = info.get(key) || keyToInfoFallback(key);
            const athleteName = `${meta.firstName} ${meta.lastName}`;
            const row = [athleteName, meta.grade];
            
            // Add attendance for each date
            for (const date of dates) {
                const present = !!(records[date] && records[date][key]);
                row.push(present ? 'Y' : 'N');
            }
            
    rows.push(row);
}

const csv = rows.map(r => r.map(escapeCSV).join(',')).join('\n');
const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'attendance_export.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('📄 Attendance CSV exported');
    }

    function escapeCSV(val) {
        const s = String(val ?? '');
        if (s.includes(',') || s.includes('"') || s.includes('\n')) {
            return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
    }

    function keyToInfoFallback(key) {
        const [ln, fn, gr] = String(key).split('|');
        return { lastName: capitalize(ln), firstName: capitalize(fn), grade: gr };
    }

    function capitalize(s) {
        s = (s || '').toString();
        return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;
    }

    // ---------- Attendance persistence helpers ----------
    function buildAthleteKey(a) {
        const ln = (a.lastName || '').toString().trim().toLowerCase();
        const fn = (a.firstName || '').toString().trim().toLowerCase();
        const gr = (a.grade || '').toString().trim().toLowerCase();
        return `${ln}|${fn}|${gr}`;
    }

    function loadAttendanceRecords() {
        try {
            return JSON.parse(localStorage.getItem(ATTENDANCE_STORAGE_KEY) || '{}');
        } catch (_) { return {}; }
    }

    function saveAttendanceRecords(records) {
        try { localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(records)); } catch (_) {}
    }

    function loadPracticeDates() {
        try { return JSON.parse(localStorage.getItem(PRACTICE_DATES_KEY) || '[]'); } catch (_) { return []; }
    }

    function savePracticeDates(dates) {
        try { localStorage.setItem(PRACTICE_DATES_KEY, JSON.stringify(dates)); } catch (_) {}
    }

    function getTodayCentralKey() {
        const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' });
        return fmt.format(new Date());
    }

    function setAttendanceForToday(athleteKey, isCheckedIn) {
        const records = loadAttendanceRecords();
        const today = getTodayCentralKey();
        if (!records[today]) records[today] = {};
        records[today][athleteKey] = !!isCheckedIn;
        saveAttendanceRecords(records);
        // Track practice date if anyone is checked in today
        if (isCheckedIn) {
            const dates = loadPracticeDates();
            if (!dates.includes(today)) {
                dates.push(today);
                savePracticeDates(dates);
            }
        }
    }

    function getAttendanceForToday(athleteKey) {
        const records = loadAttendanceRecords();
        const today = getTodayCentralKey();
        return !!(records[today] && records[today][athleteKey]);
    }

    function getAthleteAttendanceSummary(athleteKey) {
        const records = loadAttendanceRecords();
        const dates = loadPracticeDates();
        const total = dates.length;
        let present = 0;
        for (const d of dates) {
            if (records[d] && records[d][athleteKey]) present++;
        }
        const percent = total > 0 ? Math.round((present / total) * 100) : 0;
        return { present, total, percent };
    }
})();
