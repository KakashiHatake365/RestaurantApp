# RestaurantApp

A reusable Expo Router restaurant mobile app starter. It keeps the existing restaurant-app layout while using generic public starter branding.

## Overview

RestaurantApp keeps the same mobile structure and screen layout:

- `app` for Expo Router routes and screens
- `components` for shared UI building blocks
- `context` for authentication and order state
- `data` for local seed menu, rewards, orders, and store content
- `lib` for theme, local demo persistence, and optional remote API helpers

The app includes these primary flows:

- Home dashboard
- Menu browsing and dish detail pages
- Rewards
- Location and store hours
- Reorder history
- Checkout and order status
- Profile, addresses, notifications, and biometric login settings

## Tech Stack

- Expo SDK 54
- Expo Router
- React Native
- TypeScript
- Local in-memory demo persistence

## Project Structure

```text
RestaurantApp/
|-- app/
|   |-- _layout.tsx
|   |-- checkout.tsx
|   |-- (tabs)/
|   |-- dish/
|   |-- order-status/
|   `-- profile/
|-- components/
|-- context/
|-- data/
|-- lib/
|-- app.json
|-- babel.config.js
|-- package.json
`-- tsconfig.json
```

## Getting Started

Install dependencies:

```bash
npm install
```

Start the Expo dev server:

```bash
npm run start
```

Run on Android:

```bash
npm run android
```

Run on iOS:

```bash
npm run ios
```

Run on web:

```bash
npm run web
```

## Demo Login

The starter seeds a local demo account:

```text
Email: guest@restaurantapp.local
Password: welcome123
```

The app can run without a backend. If you later add a server, set this environment variable:

```bash
EXPO_PUBLIC_RESTAURANT_API_BASE=https://your-api.example.com
```

Expected API routes are currently referenced in `lib/api.ts`.

## Checks

Run TypeScript validation:

```bash
npx tsc --noEmit
```

Run Expo Doctor:

```bash
npx expo-doctor
```

## GitHub Notes

Generated folders and local secrets are ignored by `.gitignore`, including:

- `node_modules/`
- `.expo/`
- `.env`
- native build outputs: `android/` and `ios/`

Commit the source files, `package.json`, `package-lock.json`, and this README.


