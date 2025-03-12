# FuDisc - Putt Master 9000

FuDisc is a disc golf scorekeeping app designed to help players track their scores, manage their games, and enhance their disc golf experience. Built with React Native, Expo, and TypeScript, the app provides an intuitive interface for users to log their scores, view game stats, and more. The app connects seamlessly with a backend powered by Apollo Client to keep your data synced and up-to-date.

## Key Features

- **Scorekeeping**: Easily record and track your disc golf game scores.
- **Game Management**: Manage multiple games, track scores, and analyze performance.
- **Simultaneous Score Entry**: Multiple players can add their scores simultaneously in the same game, making it easier to track scores in real-time.
- **Backend Integration**: Sync game data in real-time with a backend powered by Apollo Client.
- **Mobile App**: Available on Android via [Google Play](https://play.google.com/store/apps/details?id=com.henzisoft.puttmaster9000).

## Technologies

- **React Native**: Cross-platform mobile application framework.
- **Expo**: Framework and platform for universal React applications.
- **TypeScript**: Strongly typed programming language for improved developer productivity and code quality.
- **Apollo Client**: Used to connect to the backend GraphQL API for seamless data fetching and management.

## Installation

To install and run the app locally, follow the steps below.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (version 14 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (for easier development workflow)
- [Yarn](https://yarnpkg.com/) (optional, but recommended for package management)

### Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Henzii/putt-master-9000
   cd putt-master-9000
   ```

2. **Install dependencies**:

   If you're using npm:

   ```bash
   npm install
   ```

   Or with Yarn:

   ```bash
   yarn install
   ```

3. **Run the app**:

   For Android, you can use Expo to run the app:

   ```bash
   npx expo start
   ```

   This will open a development server. You can then use the Expo Go app on your Android device to scan the QR code and run the app.

### Running the App on Your Device

You can also download the app from the Google Play Store:

[Download FuDisc from Google Play](https://play.google.com/store/apps/details?id=com.henzisoft.puttmaster9000)

## Backend

The backend for FuDisc is located in a separate repository. You can find the backend code and instructions here: [Putt Master 9000 Server](https://github.com/Henzii/putt-master-9000-server).

The backend uses Apollo Server and GraphQL to handle the game data, providing an API that FuDisc interacts with to fetch and store scores.
