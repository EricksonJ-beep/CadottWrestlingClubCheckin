# Coaches Corner PIN

**Default PIN:** `1234`

## How It Works
- Coaches must enter the PIN to access Coaches Corner admin tools
- PIN is validated using SHA-256 hashing (secure, not stored in plain text)
- Session lasts 8 hours after successful login
- Logout button in header clears session and returns to PIN screen

## Changing the PIN

To change the PIN:

1. Open `public/coaches-corner.html`
2. Find the line with `CORRECT_PIN_HASH`
3. Replace the hash with a new one

To generate a new hash:
```javascript
// Run this in browser console:
const newPin = "5678"; // Your new PIN
crypto.subtle.digest('SHA-256', new TextEncoder().encode(newPin))
  .then(buffer => {
    const hash = Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    console.log('New hash:', hash);
  });
```

Copy the hash output and replace the value in `CORRECT_PIN_HASH`.

## Security Notes
- This is **client-side protection** - suitable for casual access control
- Not cryptographically secure (PIN hash visible in page source)
- Appropriate for wrestling club attendance (non-sensitive data)
- For higher security needs, consider Vercel password protection or Firebase Auth
