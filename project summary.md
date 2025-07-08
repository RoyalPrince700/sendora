# Project Summary: Share - Web to Mobile Migration

## Overview
This project migrates the InstantShare real-time file-sharing web app to a mobile app using React Native and Expo.

## Web Version Features
- **Frontend:** React + Vite + TypeScript
- **Backend:** Node.js + Express
- **Deployment:** Frontend on Vercel, Backend on Render

### Core Functionality
1. **Session Management:**
   - 4-digit repeated codes (e.g., 4444, 7777)
   - Create/join sessions
   - Real-time file sync
2. **File Sharing:**
   - Drag & drop uploads
   - Clipboard image pasting (desktop)
   - 5MB file size limit
   - Auto-refresh every 3 seconds
   - Image previews, copy-to-clipboard
3. **API Endpoints:**
   - `POST /api/session` (create)
   - `GET /api/session/{code}` (poll)
   - `POST /api/session/{code}/upload` (upload)
   - `GET /api/session/{code}/file/{id}` (download)

## Migration Goals
- Extract/adapt session management and API logic
- Replace browser APIs with React Native/Expo equivalents
- Add mobile features: clipboard, camera, file system
- Mobile-optimized UI

## Mobile Tech Stack
- **React Native + Expo**
- **expo-clipboard** (clipboard access)
- **expo-image-picker** (camera/gallery)
- **expo-file-system** (file handling)
- **@react-navigation/native** (navigation)

## Status
- [ ] Expo project initialized
- [ ] Dependencies installed
- [ ] Core logic migrated
- [ ] Mobile UI implemented
- [ ] Mobile features integrated 