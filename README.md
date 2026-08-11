# Bubli's Birthday Diary 💙

A flip-page, handwritten-diary style birthday web app — cute animal doodles, 3 mini games (blow the candles, basketball hoops, pop the balloons), personal facts, a nostalgia page, and a typewriter love letter. Pure HTML/CSS/JS, no build tools, installable as a PWA.

## Files
- `index.html` — all 13 pages/sections
- `style.css` — diary/paper aesthetic, flip animations
- `script.js` — page-flip logic + 3 mini-games + typewriter + confetti
- `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png` — PWA install support

## Before you launch
1. Open `script.js`, find `LETTER_TEXT` at the very top, and replace it with your real letter to Bubli.
2. (Optional) Swap `icon-192.png` / `icon-512.png` for a real photo-based icon.
3. (Optional) Add real photos: drop images in an `assets/` folder and reference them in `index.html`.

## Run locally
Just open `index.html` in a browser — no server needed. For PWA install testing, serve it locally:
```
npx serve .
```

## Push to GitHub
```
git init
git add .
git commit -m "Bubli's birthday diary 💙"
git branch -M main
git remote add origin https://github.com/<your-username>/bubli-birthday.git
git push -u origin main
```

## Deploy on Vercel
1. Go to vercel.com → New Project → Import the GitHub repo.
2. Framework preset: "Other" (static site) — no build command needed.
3. Deploy. You'll get a live link like `bubli-birthday.vercel.app`.

## Let her install it like an app
Send her the link → she opens it on her phone → browser menu → "Add to Home Screen". It'll sit on her home screen with its own icon, like a real app.
