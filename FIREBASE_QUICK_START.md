# Firebase Setup - Quick Start

## What I Did
✅ Created Firebase sync system for multi-device real-time updates  
✅ Both tablets will see check-ins instantly (1-2 second delay)  
✅ Falls back to localStorage if Firebase not configured or offline  
✅ Automatically migrates your existing data when you set it up  

## What You Need To Do

### 1. Create Firebase Project (5 minutes)
- Go to: https://console.firebase.google.com/
- Click "Add project"
- Name it (e.g., "cadott-wrestling")
- Click through to create

### 2. Enable Anonymous Auth (1 minute)
- In Firebase Console → Authentication
- Click "Get started"
- Enable "Anonymous" sign-in method

### 3. Create Firestore Database (2 minutes)
- In Firebase Console → Firestore Database
- Click "Create database"
- Choose "Start in production mode"
- Select location (us-central for midwest)

### 4. Get Your Config (2 minutes)
- Firebase Console → Project Settings (gear icon)
- Scroll to "Your apps"
- Click web icon `</>`
- Register app
- **Copy the firebaseConfig values**

### 5. Update firebase-config.js
Replace the placeholder values in `/public/firebase-config.js` with your actual values:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSy...",  // YOUR actual key
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123..."
};
```

### 6. Deploy Rules
From your terminal:
```bash
cd cadott-wrestling-attendance
firebase login
firebase init firestore  # Accept defaults
firebase deploy --only firestore:rules
```

### 7. Commit and Push
```bash
git add public/firebase-config.js
git commit -m "Add Firebase config"
git push
```

### 8. Test on Both Tablets
- Open site on both tablets after Vercel deploys
- Check in an athlete on Tablet A
- See it appear on Tablet B within 1-2 seconds!

## It's Working When...
✅ Browser console shows "✅ Firebase initialized successfully"  
✅ Check-ins on one tablet appear on the other automatically  
✅ Roster refreshes sync across both tablets  

## Troubleshooting
- **"Firebase not configured"** → Update firebase-config.js with real values
- **Permission denied** → Run `firebase deploy --only firestore:rules`
- **No sync** → Check both tablets have internet, verify Anonymous auth enabled

## Full Guide
See `FIREBASE_SETUP.md` for detailed instructions and troubleshooting.

## Free Tier Limits
- 50,000 reads/day ✅ You'll use ~200/day
- 20,000 writes/day ✅ You'll use ~50/day
- **Cost: $0** - You'll stay well within free limits

## Need Help?
1. Check browser console (F12) for errors
2. Verify Firebase config in firebase-config.js
3. Ensure Anonymous auth is enabled in Firebase Console
