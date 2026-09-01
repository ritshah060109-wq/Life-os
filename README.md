# LifeOS

A premium mobile-first Personal Operating System for discipline, habit mastery, productivity, and self-improvement.

## Features
- 🎯 Habit tracking and discipline management
- 📊 Progress analytics and insights
- 💰 Custom economy system
- 🎮 Gamified self-improvement
- 📱 Mobile-first design with Capacitor

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun
- Java 17+ (for Android builds)
- Android SDK

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Building APK

### Automatic Builds (GitHub Actions)
Push to `main` branch or create a release tag (e.g., `v1.0.0`) to trigger automated APK builds.

APKs will be available in:
- **Actions tab** → View run artifacts
- **Releases tab** → Download from release page

### Manual APK Build

```bash
# Setup Capacitor (first time only)
npx capacitor init --web-dir dist --bundle com.lifeos.app --app-name LifeOS

# Add Android platform
npx capacitor add android

# Build the web app
npm run build

# Copy to Android
npx capacitor copy android

# Build APK
cd android
./gradlew assembleDebug    # Debug APK
./gradlew assembleRelease  # Release APK

# Open in Android Studio
npx capacitor open android
```

### APK Locations
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

## Download APK

### Option 1: GitHub Actions
1. Go to **Actions** tab
2. Click latest workflow run
3. Download APK from **Artifacts** section

### Option 2: GitHub Releases
1. Create a git tag: `git tag v1.0.0`
2. Push to GitHub: `git push --tags`
3. APK will be automatically attached to release
4. Download from **Releases** tab

### Option 3: Direct APK Installation
Once you have the APK file:
```bash
adb install path/to/app-debug.apk
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build React app for production
npm run lint         # Check TypeScript
npm run cap:build    # Build web + prepare for Android
npm run cap:open     # Open Android Studio
```

## Tech Stack
- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Capacitor** - Mobile wrapper
- **Firebase** - Backend services
- **TypeScript** - Type safety

## Environment Variables
Create `.env.local` file:
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
# ... other Firebase config
```

## Contributing
Contributions are welcome! Please create a pull request with your changes.

## License
MIT
