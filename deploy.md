# 🚀 Deployment Guide for Breakpoint Tennis Tracker

## Option 1: Firebase Hosting (Recommended)

### Prerequisites
- Firebase CLI installed ✅
- Firebase project setup ✅
- Build files ready ✅

### Steps:
```bash
# 1. Build the project
npm run build

# 2. Login to Firebase (opens browser)
firebase login

# 3. Initialize Firebase hosting (if not done)
firebase init hosting

# 4. Deploy to Firebase
firebase deploy --only hosting
```

### Benefits:
- ✅ Free tier available
- ✅ Custom domain support
- ✅ SSL certificates included
- ✅ CDN for fast loading
- ✅ Already integrated with your Firebase backend

---

## Option 2: Vercel (Very Easy)

### Steps:
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel --prod
```

### Benefits:
- ✅ Instant deployments
- ✅ Automatic SSL
- ✅ Custom domains
- ✅ Great for React apps

---

## Option 3: Netlify (Beginner Friendly)

### Steps:
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your `build` folder
3. Get instant URL

### Benefits:
- ✅ Easiest deployment
- ✅ Drag & drop interface
- ✅ Custom domains
- ✅ Form handling

---

## Option 4: GitHub Pages + Actions

### Setup GitHub Actions for auto-deploy:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        REACT_APP_FIREBASE_API_KEY: ${{ secrets.REACT_APP_FIREBASE_API_KEY }}
        REACT_APP_FIREBASE_AUTH_DOMAIN: ${{ secrets.REACT_APP_FIREBASE_AUTH_DOMAIN }}
        REACT_APP_FIREBASE_PROJECT_ID: ${{ secrets.REACT_APP_FIREBASE_PROJECT_ID }}
        REACT_APP_FIREBASE_STORAGE_BUCKET: ${{ secrets.REACT_APP_FIREBASE_STORAGE_BUCKET }}
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.REACT_APP_FIREBASE_MESSAGING_SENDER_ID }}
        REACT_APP_FIREBASE_APP_ID: ${{ secrets.REACT_APP_FIREBASE_APP_ID }}
        REACT_APP_FIREBASE_MEASUREMENT_ID: ${{ secrets.REACT_APP_FIREBASE_MEASUREMENT_ID }}
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
```

---

## Environment Variables Setup

For any deployment, you'll need to set these environment variables:

```
REACT_APP_FIREBASE_API_KEY=AIzaSyC3Ioc0vQWGupZbaPWWCJ_5VUangerSZr0
REACT_APP_FIREBASE_AUTH_DOMAIN=tennis-tracker-558a4.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tennis-tracker-558a4
REACT_APP_FIREBASE_STORAGE_BUCKET=tennis-tracker-558a4.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=259557408657
REACT_APP_FIREBASE_APP_ID=1:259557408657:web:26e09396bf87d7e68c2430
REACT_APP_FIREBASE_MEASUREMENT_ID=G-QHDLZ5MWKB
```

---

## Quick Start Commands

### Firebase (Recommended):
```bash
npm run build
firebase login
firebase deploy --only hosting
```

### Vercel:
```bash
npm run build
npx vercel --prod
```

### Netlify:
```bash
npm run build
# Then drag build folder to netlify.com
```

---

## Custom Domain Setup

After deployment, you can add a custom domain like `breakpoint.yourdomain.com`:

1. **Firebase**: Go to Firebase Console > Hosting > Add custom domain
2. **Vercel**: Go to Vercel Dashboard > Project > Domains
3. **Netlify**: Go to Netlify Dashboard > Domain settings

---

## Security Notes

- ✅ Firebase API keys are safe to expose (they're restricted by domain)
- ✅ Enable Firebase Authentication domain restrictions
- ✅ Set up proper Firestore security rules
- ✅ Enable HTTPS redirect (automatic on all platforms)