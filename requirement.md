# Requirements Guide: Sundora Web to Mobile Migration

## 1. Project Objective
Migrate the Sundora real-time file-sharing web app to a mobile app using React Native and Expo, preserving all core features and adding mobile-specific enhancements.

---

## 2. Core Features to Implement

### 2.1 Session Management
- Generate 4-digit repeated codes (e.g., 4444, 7777)
- Create and join sessions using these codes
- Maintain real-time session state and file sync

### 2.2 File Sharing
- Upload files (max 5MB)
- Support image and document types
- Display image previews
- Copy images/files to clipboard (mobile clipboard)
- Download files from session
- Auto-refresh/poll session every 3 seconds for updates

### 2.3 API Integration
- Use the following endpoints:
  - `POST /api/session` — Create session
  - `GET /api/session/{code}` — Poll session for files
  - `POST /api/session/{code}/upload` — Upload file
  - `GET /api/session/{code}/file/{id}` — Download file
- All API calls must handle errors and loading states

### 2.4 Mobile-Specific Features
- Clipboard access (text and images) via Expo Clipboard
- Camera and gallery integration via Expo Image Picker
- File system access via Expo File System
- Mobile navigation using React Navigation
- Mobile-optimized UI (touch-friendly, responsive)

---

## 3. Technical Stack
- React Native (Expo)
- TypeScript
- expo-clipboard
- expo-image-picker
- expo-file-system
- @react-navigation/native
- axios or fetch for API calls

---

## 4. Implementation Steps

### 4.1 Project Setup
- [ ] Initialize Expo project (TypeScript)
- [ ] Install dependencies
- [ ] Set up navigation

### 4.2 Core Logic Migration
- [ ] Port session code generation logic
- [ ] Adapt API call logic for React Native
- [ ] Implement polling for real-time updates

### 4.3 UI Migration & Adaptation
- [ ] Replace web components with React Native components
- [ ] Design mobile-friendly layouts
- [ ] Add file/image preview components

### 4.4 Mobile Features
- [ ] Integrate clipboard (expo-clipboard)
- [ ] Integrate camera/gallery (expo-image-picker)
- [ ] Integrate file system (expo-file-system)

### 4.5 Testing & Optimization
- [ ] Test on Android and iOS
- [ ] Optimize for performance and UX
- [ ] Handle edge cases and errors

---

## 5. Acceptance Criteria
- All web features are available and functional on mobile
- Mobile-specific features (camera, clipboard, file system) are implemented
- UI is responsive and touch-friendly
- No critical bugs or crashes

---

## 6. References
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Backend API Docs] (add link if available)

---

## 7. Next Steps for Cursor/Developers
- Follow the checklist above in order
- For each feature, adapt logic from the web version, replacing browser APIs with Expo/React Native equivalents
- Test each feature on device/emulator before moving to the next
- Update this file as requirements evolve 