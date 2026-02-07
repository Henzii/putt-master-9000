# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FuDisc (Putt Master 9000) is a React Native/Expo mobile disc golf scorekeeping app. Players track scores, manage games with friends, and analyze performance via real-time GraphQL backend integration.

## Commands

```bash
npm start              # Start Expo dev server
npm run android        # Run on Android emulator
npm run ios            # Run on iOS simulator
npm run test           # Run Jest tests
npm run lint           # ESLint + TypeScript type checking
npm run eas:build      # Build Android APK via EAS
npm run eas:preview    # Build preview version
npm run eas:deploy     # Build + submit to Play Store
```

## Architecture

**Tech Stack:**
- React Native 0.79.5 + Expo 53
- TypeScript (strict mode)
- Apollo Client for GraphQL
- Redux + Zustand for state management
- React Router Native for navigation
- React Native Paper for UI components

**Provider Hierarchy (App.tsx):**
```
NativeRouter → ErrorBoundary → ReduxProvider → ApolloProvider →
BackButtonProvider → ThemeProvider → LocalSettingsProvider → SafeAreaProvider → Main
```

**Key Directories:**
- `src/screens/` - Main app screens (Game, Stats, Achievements, Settings, etc.)
- `src/components/` - Reusable React components
- `src/hooks/` - Custom hooks (`useGame`, `useCourses`, `useSession`, `useGPS`, etc.)
- `src/graphql/` - Apollo client setup, queries, mutations, subscriptions
- `src/reducers/` - Redux reducers (gameData, user, notification, common)
- `src/zustand/` - Zustand stores (gameStore, measurementsStore)
- `src/types/` - TypeScript type definitions

**TypeScript Path Aliases:**
- `@components/*` → `src/components/*`
- `@hooks/*` → `src/hooks/*`
- `@icons/*` → `assets/icons/*`

**API Configuration (src/graphql/apolloClient.ts):**
- Production: `https://fudisc-server.henzi.fi`
- Development: Local server (configure IP in apolloClient.ts)
- Backend repo `putt-master-9000-server` may be in parent directory
- Uses WebSocket subscriptions for real-time updates
- Token-based auth via AsyncStorage

## Testing

Tests are in `src/__tests__/` with mocks in `src/__tests__/mocks/`. Test files use `*.spec.tsx` pattern. Mock wrapper for Apollo is available at `mocks/MockApolloWrapper.tsx`.

## CI/CD

GitHub Actions workflow runs lint and tests on all branches. Main branch deployments automatically build and submit to Google Play Store.
