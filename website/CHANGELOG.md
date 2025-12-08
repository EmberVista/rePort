# EmberVista Site Changelog

## 2025-11-28: Hero Section Updates & Git Setup

### Changes Made

#### 1. Fixed Background Pattern Behind Logo
**Problem:** A faint dot/square pattern was appearing behind the logo on the homepage.

**Cause:** The site has an SVG circuit board background pattern (`.circuit-bg`) that covers the entire page at 3% opacity. This pattern includes small circles, lines, and shapes that were visible behind the transparent areas of the logo.

**Solution:** Added a solid background color to the `.hero` section so it covers the circuit pattern:
```css
.hero {
    position: relative;
    background: var(--bg-primary);
}
```

**File:** `index.html` (lines 107-113)

#### 2. Removed Subheadline
**Change:** Removed the tagline paragraph from the hero section.

**Before:**
```html
<section class="hero">
    <img src="assets/logo-full.png" alt="EmberVista" class="hero-logo">
    <p>Software solutions built to solve real workflow problems. Clean code, refined execution.</p>
</section>
```

**After:**
```html
<section class="hero">
    <img src="assets/logo-full.png" alt="EmberVista" class="hero-logo">
</section>
```

#### 3. Reduced Hero Padding
**Change:** Shrunk the hero section padding for a more compact layout.

**Before:** `padding: 120px 0 80px;`
**After:** `padding: 60px 0 40px;`

---

### Git Repository Setup

#### Repository Details
- **GitHub URL:** https://github.com/EmberVista/embervista.com.git
- **Server Path:** `/var/www/embervista.com`
- **Local Dev Path:** `/Volumes/Shared/embervista-site`

#### Authentication Method
Using HTTPS with Personal Access Token (PAT):
- Username: `embervista`
- Password: Personal Access Token (not GitHub password)

#### Setup Commands (for future reference)

**Initialize a folder and connect to existing repo:**
```bash
git init
git remote add origin https://github.com/EmberVista/embervista.com.git
git fetch origin
git branch -M main
git reset --soft origin/main
```

**Standard commit and push workflow:**
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

**Sync local folder with remote (destructive - overwrites local changes):**
```bash
git fetch origin
git reset --hard origin/main
```

#### Commit Reference
- **Commit Hash:** `6963535`
- **Message:** "Fix hero section: remove dot pattern, remove subheadline, reduce padding"
- **Parent Commit:** `ef6e706`

---

### Architecture Notes

#### File Structure
```
/var/www/embervista.com/
├── index.html          # Main homepage (all CSS is inline in <style> tag)
├── assets/
│   └── logo-full.png   # Main logo file
└── report/
    └── index.html      # Report subpage
```

#### CSS Variables (defined in :root)
```css
--bg-primary: #0a0a0a;
--bg-secondary: #111111;
--bg-card: #161616;
--text-primary: #ffffff;
--text-secondary: #a0a0a0;
--text-muted: #666666;
--accent: #ffffff;
--border: #222222;
--border-hover: #333333;
```

#### Background Pattern
The site uses an SVG circuit board pattern (`.circuit-bg`) as a decorative background:
- Fixed position, covers entire viewport
- 3% opacity (`opacity: 0.03`)
- Contains animated traces with `tracePulse` keyframe animation
- Pattern repeats every 200x200 pixels

To hide the pattern behind any section, add:
```css
.your-section {
    position: relative;
    background: var(--bg-primary);
}
```
