# Serenity - Meditation & Sleep Tracking App

Serenity la ung dung thien dinh va theo doi giac ngu, giup nguoi dung cai thien suc khoe tinh than thong qua cac bai thien co huong dan, theo doi chat luong giac ngu, va phan tich du lieu suc khoe ca nhan.

Serenity is a meditation and sleep tracking application that helps users improve their mental health through guided meditation sessions, sleep quality tracking, and personal health data analytics.

## Tech Stack

- **Framework:** React Native Expo + TypeScript (strict mode)
- **Authentication & Backend:** Firebase Auth + Firestore + Firebase Test Lab
- **Local Database:** SQLite (via expo-sqlite)
- **Navigation:** React Navigation
- **State Management:** Zustand
- **Device APIs:** expo-sensors, expo-location, expo-camera, expo-battery, react-native-maps
- **Background Tasks:** expo-task-manager, expo-background-fetch, expo-notifications
- **Monetization:** Google Mobile Ads (AdMob)
- **Testing:** Jest + Firebase Test Lab

## Project Structure

```
src/
├── screens/        # Screen components (one per route)
├── components/     # Reusable UI components
├── services/       # External service integrations (Firebase, API clients)
├── hooks/          # Custom React hooks
├── navigation/     # React Navigation config & navigators
├── store/          # Zustand stores
├── utils/          # Pure utility functions & helpers
├── workers/        # Background task definitions (expo-task-manager)
├── config/         # App configuration & environment setup
```

## Features

- Guided meditation sessions with audio support
- Sleep quality tracking and analysis
- Personal health data analytics and insights
- Push notifications for meditation reminders
- Background task support for sleep tracking
- Offline-first with local SQLite database
- Cloud sync via Firebase Firestore
- Ad-supported with Google AdMob integration

## Setup

### Prerequisites

- Node.js (LTS)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio / Xcode (for native builds)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd serenity-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase and AdMob credentials.

4. Start the development server:

```bash
npm start
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the Expo development server |
| `npm run android` | Start on Android emulator/device |
| `npm run ios` | Start on iOS simulator/device |
| `npm run web` | Start on web browser |

## Path Aliases

The project uses TypeScript path aliases for clean imports:

```typescript
import { Component } from '@/components/Component';
import { useCustomHook } from '@/hooks/useCustomHook';
import { firebaseService } from '@/services/firebase';
```

## Environment Variables

See [.env.example](.env.example) for all required environment variables including Firebase and AdMob configuration.

## License

Private project - All rights reserved.
