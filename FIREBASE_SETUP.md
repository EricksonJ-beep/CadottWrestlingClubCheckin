# Firebase Cloud Sync Setup Guide

## Overview
This guide will help you set up Firebase for real-time multi-device sync across your wrestling club attendance tablets.

## What You'll Get
✅ Real-time sync across multiple devices  
✅ Both tablets see check-ins instantly  
✅ No data loss if a device fails  
✅ Automatic backup in the cloud  

---

## Step 1: Create a Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Sign in** with your Google account (or create one)
3. **Click "Add project"**
4. **Enter project name**: `cadott-wrestling-attendance` (or your preferred name)
5. **Disable Google Analytics** (not needed for this app)
6. **Click "Create project"**
7. Wait for project creation to complete, then click **"Continue"**

---

## Step 2: Enable Anonymous Authentication

1. In your Firebase project, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Click the **"Sign-in method"** tab
4. Find **"Anonymous"** in the list and click it
5. **Toggle "Enable"** to ON
6. Click **"Save"**

---

## Step 3: Create Firestore Database

1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll upload custom rules)
4. Select a location closest to you (e.g., `us-central` for midwest USA)
5. Click **"Enable"**

---

## Step 4: Deploy Security Rules

Open a terminal in your project and run:

```bash
cd cadott-wrestling-attendance
firebase login
firebase init firestore
```

When prompted:
- Select your Firebase project
- Accept default firestore.rules file
- Accept default firestore.indexes.json file

Then deploy the rules:

```bash
firebase deploy --only firestore:rules
```

---

## Step 5: Get Your Firebase Configuration

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"**
4. Click the **web icon** `</>` to add a web app
5. **Enter app nickname**: "Wrestling Attendance Web App"
6. **DO NOT check** "Also set up Firebase Hosting"
7. Click **"Register app"**
8. **Copy the configuration values** that appear

You'll see something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

---

## Step 6: Update Your Configuration File

1. Open `public/firebase-config.js` in your code editor
2. **Replace the placeholder values** with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

3. **Save the file**

---

## Step 7: Deploy and Test

1. **Commit and push your changes:**
```bash
git add public/firebase-config.js
git commit -m "Add Firebase configuration"
git push origin main
```

2. **Wait for Vercel to deploy** (2-3 minutes)

3. **Open your site on both tablets**

4. **Test sync:**
   - On Tablet 1: Check in an athlete
   - On Tablet 2: You should see the check-in appear within 1-2 seconds
   - Try vice versa to confirm both directions work

---

## Step 8: Migrate Existing Data

If you already have attendance data on one tablet:

1. Open that tablet's browser
2. Go to Coaches Corner (enter PIN)
3. The system will **automatically migrate** your existing localStorage data to Firebase
4. Check the browser console (F12) - you should see:
   ```
   ✅ Athletes migrated to Firebase
   ✅ Attendance records migrated to Firebase
   ✅ Practice dates migrated to Firebase
   ```

5. Refresh the other tablet - it should now have all the data!

---

## Troubleshooting

### "Firebase not configured" message
- Check that you replaced ALL placeholder values in `firebase-config.js`
- Make sure the file was saved and deployed

### Data not syncing between tablets
- Open browser console (F12) on both tablets
- Look for error messages
- Verify both tablets have internet connection
- Check Firebase Console > Firestore Database to see if data is being written

### "Permission denied" errors
- Run `firebase deploy --only firestore:rules` again
- Check that Anonymous auth is enabled in Firebase Console

### One tablet has data, the other doesn't
- On the tablet WITHOUT data: refresh the page
- Check browser console for sync messages
- Manually trigger sync: Go to Coaches Corner > Click "Refresh Roster"

---

## How It Works

### Real-time Sync
- When Tablet A checks in an athlete, the data is instantly written to Firebase
- Tablet B has a real-time listener that detects the change within 1-2 seconds
- The change is automatically applied to Tablet B's display

### Offline Fallback
- If internet goes down, the app continues working with localStorage
- When internet returns, changes sync automatically
- No data is lost

### Data Storage
Your data is stored in Firestore with this structure:
```
/roster/athletes          → List of all athletes
/attendance/records       → All check-in records by date
/attendance/practice-dates → List of practice dates
/attendance/finalized     → Which dates are finalized
```

---

## Security Notes

- **Anonymous Authentication**: Each device gets a unique anonymous user ID
- **Firestore Rules**: Only authenticated users (anonymous or otherwise) can read/write
- **No personal data collection**: We only store names, grades, and attendance
- **PIN Protection**: Coaches Corner still requires PIN (client-side)

---

## Cost Considerations

Firebase free tier includes:
- ✅ 50,000 reads per day
- ✅ 20,000 writes per day  
- ✅ 1 GB storage
- ✅ 10 GB/month network egress

**Your expected usage:**
- ~50 athletes × 2 tablets × 2 practices/week = ~200 writes/week
- Reads: ~1,000/week (very conservative estimate)

**Verdict**: You'll stay well within the free tier. No charges expected.

---

## Support

If you run into issues:
1. Check browser console (F12) for error messages
2. Verify Firebase configuration values
3. Check Firestore security rules are deployed
4. Ensure Anonymous auth is enabled

---

## Rolling Back (If Needed)

If you want to disable Firebase sync temporarily:

1. Open browser console (F12)
2. Run: `localStorage.setItem('firebaseSyncEnabled', 'false')`
3. Refresh the page
4. The app will work with localStorage only

To re-enable:
```javascript
localStorage.setItem('firebaseSyncEnabled', 'true')
```

Then refresh the page.
