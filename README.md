# Sundora

Sundora is a real-time file sharing mobile app built with React Native and Expo. Seamlessly share images and documents between devices using a simple session code.

## Features

- Create or join sessions with a 4-digit code
- Real-time file sync and sharing
- Share images and documents (max 5MB)
- Image previews and downloads
- Clipboard, camera, and file system integration
- Mobile-optimized UI

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/RoyalPrince700/sendora.git
   cd sendora
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

## Building for Production

- Android:  
  ```bash
  eas build --platform android
  ```
- iOS:  
  ```bash
  eas build --platform ios
  ```

## License

MIT