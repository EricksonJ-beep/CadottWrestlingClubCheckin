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

        // Build header: Athlete Name, Grade, then each date
        const header = ['Athlete Name', 'Grade', ...dates];
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
