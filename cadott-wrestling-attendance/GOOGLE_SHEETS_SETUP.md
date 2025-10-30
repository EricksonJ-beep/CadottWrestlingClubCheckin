# 📊 Google Sheets Integration Setup Guide

## Quick Setup (3 Steps)

### Step 1: Make Your Spreadsheet Public
1. Open your spreadsheet: [Your Registration Sheet](https://docs.google.com/spreadsheets/d/1LUMFApWy_czJopgv5ArJJzFmRogqmbBnJCsNzWubG34/edit)
2. Click the **Share** button (top right)
3. Under "General access" → Change to **"Anyone with the link"**
4. Set permission to **"Viewer"** (read-only)
5. Click **Done**

### Step 2: Tell Me Your Column Structure
Please describe what columns you have in your spreadsheet. For example:
- Column A = First Name
- Column B = Last Name  
- Column C = Grade
- Column D = Weight (optional)
- Column E = Parent Email (optional)

**OR** just tell me the column headers from Row 1!

### Step 3: Update Column Mapping
Once you tell me the columns, I'll update the configuration in `google-sheets-integration.js`

## How It Works

### Automatic Data Loading
- When the app loads, it tries to fetch data from your Google Sheet
- If it can't reach the sheet, it falls back to test data
- Athletes are automatically sorted and grouped by grade

### Refresh Button
- Click the green **Refresh** button in the header to reload data from the sheet
- Perfect for when parents submit new registrations!
- Updates happen instantly

### Grade Grouping
The app automatically groups athletes:
- **K-2nd**: Kindergarten, 1st, 2nd grade
- **3rd-4th**: 3rd and 4th grade  
- **5th-6th**: 5th and 6th grade

### What Gets Loaded
For each athlete, the app loads:
- ✅ First Name (required)
- ✅ Last Name (required)
- ✅ Grade (required)
- 📋 Weight (optional)
- 📋 Email (optional)

## Testing the Integration

### Test #1: Check Console
1. Open browser Developer Tools (F12)
2. Go to the **Console** tab
3. Refresh the page
4. Look for:
   - ✅ "Loaded X athletes from Google Sheets"
   - ❌ "Failed to fetch spreadsheet" (means permissions issue)

### Test #2: Click Refresh
1. Click the green **Refresh** button in the header
2. You should see a toast notification: "✨ Athlete list updated from Google Sheets!"

### Test #3: Add New Registration
1. Have someone fill out your Google Form
2. Wait for it to appear in the spreadsheet
3. Click **Refresh** in the app
4. New athlete should appear!

## Troubleshooting

### ❌ "Could not load athletes from Google Sheets"
**Problem**: Spreadsheet is not publicly accessible  
**Solution**: Follow Step 1 above to make it public

### ❌ Athletes not showing up
**Problem**: Column mapping might be wrong  
**Solution**: Tell me your column structure so I can fix the mapping

### ❌ Wrong grade grouping
**Problem**: Grade format doesn't match expected patterns  
**Solution**: Tell me what format your grades are in (e.g., "5", "5th", "Fifth")

## Current Configuration

```javascript
// These will be updated based on your column structure
columns: {
    firstName: 0,    // Column A
    lastName: 1,     // Column B
    grade: 2,        // Column C
    weight: 3,       // Column D (optional)
    email: 4         // Column E (optional)
}
```

## Next Steps

1. ✅ Make spreadsheet public (Step 1)
2. ✅ Tell me your columns (Step 2)
3. ✅ I'll update the configuration
4. ✅ Refresh the app and test!

## Need Help?

Just ask! Common questions:
- "How do I make the sheet public?"
- "My columns are: [list them]"
- "Athletes aren't loading, what's wrong?"
- "Can I update the data automatically every X minutes?"
