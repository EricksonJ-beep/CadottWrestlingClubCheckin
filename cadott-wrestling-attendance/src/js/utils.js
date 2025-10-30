// This file includes utility functions, such as formatting timestamps and generating CSV data for export.

export function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

export function generateCSV(data) {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    for (const row of data) {
        csvRows.push(headers.map(header => JSON.stringify(row[header], (key, value) => value === null ? '' : value)).join(','));
    }

    return csvRows.join('\n');
}