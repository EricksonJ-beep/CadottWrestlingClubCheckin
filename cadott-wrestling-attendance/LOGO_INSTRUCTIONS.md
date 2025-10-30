# 📸 How to Add Your Logo

## Quick Instructions

1. **Prepare Your Logo**
   - Recommended format: PNG with transparent background
   - Recommended size: 200x200 pixels (or larger, it will scale down)
   - Square or circular logos work best

2. **Upload Your Logo**
   - Save your logo file as `logo.png`
   - Place it in: `/workspaces/CadottWrestlingClubCheckin/cadott-wrestling-attendance/public/`
   - The file path should be: `public/logo.png`

3. **Alternative Names**
   If you want to use a different filename or format:
   - Edit `public/index.html`
   - Find the line: `<img src="logo.png" alt="Cadott Wrestling Logo" ...`
   - Change `logo.png` to your filename (e.g., `cadott-logo.jpg`)

## Current Logo Setup

- **Location**: Header, left side next to "CADOTT WRESTLING"
- **Size**: 64x64 pixels (4rem)
- **Fallback**: If logo isn't found, it will hide automatically (no broken image icon)

## Logo Size Customization

To make the logo bigger or smaller, edit the class in `public/index.html`:

```html
<!-- Current (64x64) -->
<img src="logo.png" alt="Cadott Wrestling Logo" class="h-16 w-16 object-contain">

<!-- Smaller (48x48) -->
<img src="logo.png" alt="Cadott Wrestling Logo" class="h-12 w-12 object-contain">

<!-- Larger (80x80) -->
<img src="logo.png" alt="Cadott Wrestling Logo" class="h-20 w-20 object-contain">

<!-- Extra Large (96x96) -->
<img src="logo.png" alt="Cadott Wrestling Logo" class="h-24 w-24 object-contain">
```

## Tips

- **PNG with transparency** looks cleanest
- **JPG** works but will have a background
- **SVG** is ideal for scaling but may need different handling
- Keep file size under 500KB for fast loading

---

Once you upload your logo to `public/logo.png`, just refresh the browser to see it!
