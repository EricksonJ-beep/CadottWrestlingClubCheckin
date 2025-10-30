# 🎨 Cadott Wrestling Club - Customization Guide

## Current Design Overview

Your application now features a **modern, wrestling-themed design** with:

### Color Scheme
```
Primary Colors:
🔴 Maroon/Red: #800000 (Wrestling red - headers, accents)
🟡 Gold:       #FFD700 (School gold - highlights, active states)
🟢 Green:      #10B981 (Success - check-ins)
⚫ Dark Gray:  #1F2937 (Text, professional look)
⚪ Light Gray: #F3F4F6 (Backgrounds, subtle elements)
```

### Current Look
- **Header**: Maroon gradient with wrestling emoji 🤼 and date display
- **Stats Bar**: 3 cards showing Checked In, Total Athletes, and Attendance %
- **Grade Tabs**: Horizontal scrollable tabs with gold active state
- **Search Bar**: Large, prominent search with focus effects
- **Athlete Cards**: Grid layout with hover effects and check-in buttons
- **Responsive**: Optimized for tablets with large touch targets

---

## 🎨 How to Customize

### 1. Change Colors

####Option A: Edit Tailwind Config
File: `tailwind.config.js`

```javascript
theme: {
  extend: {
    colors: {
      // Change these to your preferred colors
      wrestling: {
        primary: '#YOUR_COLOR',    // Main brand color
        secondary: '#YOUR_COLOR',  // Secondary brand color
        accent: '#YOUR_COLOR',     // Accent highlights
      },
      cadott: {
        maroon: '#YOUR_COLOR',     // School color 1
        gold: '#YOUR_COLOR',       // School color 2
      },
    },
  },
}
```

#### Option B: Edit HTML Inline Styles
File: `public/index.html`

Find and modify the `<style>` section:

```css
.wrestling-header {
    background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
}

.grade-tab.active {
    background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
}
```

### 2. Change Fonts

#### Add Custom Fonts
In `public/index.html` `<head>` section:

```html
<!-- Current: Roboto -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet">

<!-- Wrestling-style options: -->
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet">

<!-- Professional options: -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
```

Then update in `tailwind.config.js`:

```javascript
fontFamily: {
  'wrestling': ['Bebas Neue', 'Impact', 'sans-serif'],
  'body': ['Roboto', 'Arial', 'sans-serif'],
},
```

And apply in CSS:

```css
body {
    font-family: 'Roboto', sans-serif;  /* Change to your font */
}

h1 {
    font-family: 'Bebas Neue', sans-serif;  /* Bold header font */
}
```

### 3. Customize Header

File: `public/index.html`

```html
<!-- Current header -->
<h1 class="text-3xl md:text-4xl font-black tracking-tight">
    🤼 CADOTT WRESTLING
</h1>

<!-- Customization ideas: -->
<!-- Option 1: Add logo -->
<div class="flex items-center space-x-4">
    <img src="logo.png" alt="Logo" class="h-12 w-12">
    <h1 class="text-3xl font-black">CADOTT WRESTLING</h1>
</div>

<!-- Option 2: Different emoji or no emoji -->
<h1 class="text-3xl font-black">CADOTT WRESTLING CLUB</h1>

<!-- Option 3: Add tagline -->
<div>
    <h1 class="text-4xl font-black">CADOTT WRESTLING</h1>
    <p class="text-sm italic">"Train Hard, Win Harder"</p>
</div>
```

### 4. Modify Grade Tabs

File: `public/index.html` - Find `#grade-tabs` section

```html
<!-- Current: K-2nd, 3rd-4th, 5th-6th, 7th-8th, High School -->

<!-- Option 1: Weight classes instead of grades -->
<button class="grade-tab" data-grade="106">106 lbs</button>
<button class="grade-tab" data-grade="113">113 lbs</button>
<button class="grade-tab" data-grade="120">120 lbs</button>
<!-- etc -->

<!-- Option 2: Age groups -->
<button class="grade-tab" data-grade="youth">Youth (5-8)</button>
<button class="grade-tab" data-grade="junior">Junior (9-12)</button>
<button class="grade-tab" data-grade="varsity">Varsity (13+)</button>

<!-- Option 3: Teams -->
<button class="grade-tab" data-team="a">Team A</button>
<button class="grade-tab" data-team="b">Team B</button>
```

### 5. Customize Athlete Cards

File: `public/index.html` - Find `.athlete-card` example

```html
<!-- Current card structure -->
<div class="athlete-card bg-white p-4 rounded-lg shadow-md">
    <div class="flex items-center justify-between mb-3">
        <div>
            <h3 class="font-bold text-lg">Athlete Name</h3>
            <p class="text-sm text-gray-600">Grade 9 • 152 lbs</p>
        </div>
        <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
            🤼
        </div>
    </div>
    <button class="check-in-btn w-full">Check In</button>
</div>

<!-- Option 1: Add photo -->
<img src="athlete-photo.jpg" class="w-12 h-12 rounded-full object-cover">

<!-- Option 2: Add win/loss record -->
<p class="text-xs text-gray-500">Record: 15-3</p>

<!-- Option 3: Add attendance streak -->
<div class="flex items-center text-xs text-green-600 mt-1">
    🔥 5 day streak
</div>

<!-- Option 4: Larger cards for tablet -->
<div class="athlete-card p-6">  <!-- Increase padding -->
    <h3 class="text-2xl font-bold">  <!-- Larger text -->
```

### 6. Stats Dashboard Customization

File: `public/index.html` - Find stats grid

```html
<!-- Add more stats -->
<div class="grid grid-cols-4 gap-4 mb-6">  <!-- Changed from 3 to 4 -->
    <div class="stat-card">
        <div class="text-2xl font-bold text-green-600" id="checked-in-count">0</div>
        <div class="text-sm text-gray-600">Checked In</div>
    </div>
    <div class="stat-card">
        <div class="text-2xl font-bold text-gray-700" id="total-count">0</div>
        <div class="text-sm text-gray-600">Total</div>
    </div>
    <div class="stat-card">
        <div class="text-2xl font-bold text-amber-600" id="attendance-rate">0%</div>
        <div class="text-sm text-gray-600">Rate</div>
    </div>
    <!-- NEW STAT -->
    <div class="stat-card">
        <div class="text-2xl font-bold text-blue-600" id="late-count">0</div>
        <div class="text-sm text-gray-600">Late</div>
    </div>
</div>
```

### 7. Background Customization

#### Solid Color
```css
body {
    background: #F3F4F6;  /* Light gray */
}
```

#### Gradient
```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

#### Pattern
```css
body {
    background-color: #f5f5f5;
    background-image: 
        repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px);
}
```

#### Wrestling Mat Pattern
```css
body {
    background: radial-gradient(circle, #e74c3c 0%, #c0392b 100%);
}
```

### 8. Button Styles

File: `public/index.html` - Inline styles

```css
/* Current: Green gradient */
.check-in-btn {
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
}

/* Option 1: Solid color */
.check-in-btn {
    background: #10B981;
}

/* Option 2: School colors */
.check-in-btn {
    background: linear-gradient(135deg, #800000 0%, #FFD700 100%);
}

/* Option 3: Pulse animation */
.check-in-btn {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}
```

### 9. Add Custom Icons/Emojis

Replace wrestling emoji (🤼) with:
- 🥇 Gold medal
- 💪 Flexed biceps
- 🏆 Trophy
- ⭐ Star
- 🔥 Fire (for streaks)
- ✅ Check mark (for checked in)
- 📅 Calendar

### 10. Responsive Adjustments

File: `src/styles/input.css`

```css
/* Mobile (phones) */
@media (max-width: 640px) {
    .athlete-card {
        @apply p-4;  /* Smaller padding */
    }
    h1 {
        @apply text-2xl;  /* Smaller header */
    }
}

/* Tablet (default) */
@media (min-width: 641px) and (max-width: 1024px) {
    .athlete-card {
        @apply p-6;  /* Larger padding */
    }
    .check-in-button {
        @apply py-5 text-xl;  /* Bigger buttons */
    }
}

/* Desktop */
@media (min-width: 1025px) {
    .container {
        @apply max-w-7xl;  /* Wider container */
    }
}
```

---

## 🎨 Pre-made Color Schemes

### Option 1: Classic Wrestling (Current)
```
Primary:   #800000 (Maroon)
Secondary: #FFD700 (Gold)
Success:   #10B981 (Green)
```

### Option 2: School Spirit
```
Primary:   #003366 (Navy Blue)
Secondary: #FFC72C (School Gold)
Success:   #2E7D32 (Forest Green)
```

### Option 3: Modern Dark
```
Primary:   #1F2937 (Dark Gray)
Secondary: #3B82F6 (Blue)
Success:   #10B981 (Green)
Background: #111827 (Almost Black)
```

### Option 4: Energetic
```
Primary:   #EF4444 (Bright Red)
Secondary: #F59E0B (Orange)
Success:   #10B981 (Green)
```

### Option 5: Professional
```
Primary:   #4F46E5 (Indigo)
Secondary: #06B6D4 (Cyan)
Success:   #10B981 (Green)
```

---

## 📱 Tablet Optimization Tips

1. **Larger Touch Targets**: Minimum 44x44px for buttons
2. **Simplified Navigation**: Fewer clicks to check in
3. **Clear Visual Feedback**: Animations on button press
4. **High Contrast**: Easy to read from distance
5. **Orientation**: Test both portrait and landscape

---

## 🔧 Quick Customization Commands

```bash
# Rebuild CSS after changes
npm run build-css

# Watch for changes (auto-rebuild)
npx tailwindcss -i ./src/styles/input.css -o ./public/styles.css --watch

# Start development server
npm start
```

---

## 📸 To Preview Your Changes

1. Make your customization changes
2. Run: `npm run build-css`
3. Open `public/index.html` in a browser
4. Or run: `npm start` to use Firebase hosting

---

## 💡 Pro Tips

1. **Test on actual tablet** - simulator may not match real device
2. **Use high contrast** - gyms have varied lighting
3. **Keep it simple** - coaches need quick check-ins
4. **Add sound effects** - satisfying feedback on check-in
5. **Consider landscape mode** - tablets often mounted horizontally

---

Need help with a specific customization? Let me know what you want to change!
