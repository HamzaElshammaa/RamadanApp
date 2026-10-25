<div align="center">

# Ramadan Companion App 🌙✨

### **Cross-Platform Prayer Countdown, Hijri Calendar & Spiritual Companion**

[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-Router-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Reanimated](https://img.shields.io/badge/React_Native-Reanimated-FF6B6B?style=for-the-badge)](https://docs.swmansion.com/react-native-reanimated/)

*A serene, distraction-free mobile app for iOS and Android that provides real-time prayer countdowns, GPS-accurate daily prayer schedules, Hijri calendar conversion, and customizable Adhan audio notifications.*

</div>

---

## ✨ Key Features

- ⏱️ **Live Next-Prayer Hero Countdown (`hooks/useCountdown.ts`):** Second-by-second countdown timer to the upcoming prayer (Fajr, Dhuhr, Asr, Maghrib/Iftar, Isha) with automatic roll-over.
- 📅 **Dual Gregorian & Astronomical Hijri Date Calculation:** Computes the current Islamic Hijri date alongside the Gregorian calendar directly on-device.
- 🔔 **Customizable Adhan & Notification Sound Sheet (`components/SoundSheet.tsx`):** Interactive bottom sheet allowing users to preview and select their preferred prayer alert audio.
- 🎨 **Fluid Spring Animations:** Staggered `FadeInUp` and `FadeInDown` entry animations powered by `react-native-reanimated`.

---

## 📂 Project Structure

```text
├── app/
│   ├── _layout.tsx         # Root Expo Router stack & theme provider
│   ├── index.tsx           # Main dashboard: live countdown hero, Hijri date & prayer grid
│   └── modal.tsx           # Settings & detail modal screen
├── components/
│   └── SoundSheet.tsx      # Interactive Adhan sound picker bottom sheet
├── constants/
│   └── store.ts            # Global state store for prayer schedules & user preferences
├── hooks/
│   └── useCountdown.ts     # Precision countdown hook for upcoming prayer transitions
└── theme/
    └── colors.ts           # Warm spiritual color palette & surface tokens
```

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the Expo development server
npx expo start

# 3. Run on iOS Simulator or Android Emulator
npx expo run:ios
# or
npx expo run:android
```
