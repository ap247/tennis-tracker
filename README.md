# 🎾 Breakpoint

A mobile-first React web application for tracking tennis matches, opponents, and performance statistics.

## 🌐 Live Demo
**Try it now:** [https://tennis-tracker-558a4.web.app](https://tennis-tracker-558a4.web.app)

## Features

### 🔐 Multiple Authentication Options
- **Google Sign-In**: One-click OAuth authentication
- **Email/Password**: Custom account creation and sign-in
- **Guest Mode**: Try the app without creating an account (local storage only)

### 📊 Match Tracking & Analytics
- **Match Logging**: Record match details including date, opponent, score, location, and surface
- **Visual Scorekeeper**: Interactive set-by-set scoring with tiebreak support
- **Opponent Tracking**: Keep track of opponents and win/loss records against them
- **Performance Statistics**: Auto-calculated stats including win percentage, sets played, and performance by surface
- **Match History**: Searchable and filterable timeline of all matches
- **Notes & Reflection**: Add post-match notes for strategy and analysis

### 🎨 Modern Design & UX
- **Dual Themes**: Professional Greenhouse-inspired light mode & Hulu-style dark mode
- **Mobile-First Design**: Optimized for mobile devices with PWA capabilities
- **Responsive Layout**: Seamless experience across all device sizes
- **Motion Graphics**: Smooth animations and transitions

### 💾 Reliable Data Storage
- **Firebase Integration**: Cloud storage with real-time sync for authenticated users
- **Smart Fallback**: localStorage backup for offline functionality
- **User Isolation**: Each user's data is completely separate and secure

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Authentication**: Firebase Auth (Google OAuth + Email/Password)
- **Database**: Firebase Firestore with localStorage fallback
- **Styling**: CSS3 with CSS Variables for theming
- **Deployment**: Firebase Hosting
- **Build Tool**: Create React App
- **PWA**: Progressive Web App capabilities

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tennis-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Copy your Firebase config from Project Settings
   - Create a `.env` file in the root directory:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Firebase Security Rules

Add these rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /matches/{document} {
      allow read, write: if true; // Update with authentication rules as needed
    }
  }
}
```

## Usage

1. **Log a Match**: Fill out the match form with opponent, score, and other details
2. **View History**: Browse all past matches with search and filter options
3. **Check Stats**: View performance statistics and trends
4. **Offline Support**: The app works offline and syncs when connection is restored

## Data Storage

- Primary: Firebase Firestore for cloud storage and real-time sync
- Fallback: localStorage for offline functionality
- Automatic backup to localStorage for reliability

## Mobile Features

- Touch-friendly interface with 44px minimum touch targets
- Responsive design for all screen sizes
- PWA capabilities (installable on mobile devices)
- Optimized for portrait orientation

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run deploy`
Builds and deploys the app to Firebase Hosting

### `npm run deploy:vercel`
Builds and deploys the app to Vercel

## Deployment

The app is automatically deployed to Firebase Hosting. For manual deployment:

```bash
npm run deploy
```

For other deployment options, see [deploy.md](deploy.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own tennis tracking needs!