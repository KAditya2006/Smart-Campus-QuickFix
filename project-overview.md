# Smart Campus QuickFix - Complete Project Overview

## 1. Project Identity & Context
- **Name:** Smart Campus QuickFix
- **Context:** BPUT Tech Carnival 2026 T11 — Mobile App Development Contest
- **Objective:** Build a functional mobile application prototype within a 3-hour development timeframe that demonstrates a clear purpose, functional core features, and a modern mobile UI/UX.
- **Type:** Mobile Application
- **Platform:** iOS & Android (via React Native + Expo)
- **Target Audience:** Campus users (students/staff) and Maintenance Authorities.

## 2. Problem Statement & Solution
### The Problem
Campus environments often suffer from inefficient issue reporting mechanisms. Students and staff find broken equipment or facilities (plumbing, electrical, cleanliness, network), but reporting them is tedious, fragmented, or lacks transparency, often relying on paper forms or emails. Maintenance authorities struggle to prioritize tasks, track progress, and communicate resolution status back to the reporters.

### The Solution
Smart Campus QuickFix connects campus users directly with the responsible authority through a structured digital issue-reporting and tracking workflow. The goal is to provide a minimal, robust, and functional mobile application where campus users can easily report issues with context (category, location, photo), and management can efficiently track, prioritize, and resolve these issues directly from their mobile devices.

## 3. Technology Stack & Architecture
- **Frontend (Mobile Client):** React Native + Expo
  - **Language:** TypeScript
  - **Navigation:** React Navigation (Stack Navigators for Auth, Bottom Tab Navigators for User/Management roles).
  - **State Management:** React Context API for global state.
  - **Networking:** Axios (custom API Client, specifically bypassing Android OkHttp `FormData` boundary bugs for stable image uploads).
- **Backend API:** Node.js + Express.js REST API
  - **Language:** TypeScript
  - **File Uploads:** Multer middleware
  - **Validation:** Seamless request validation handled before hitting controllers.
- **Database:** MongoDB Atlas (Cloud)
  - **ODM:** Mongoose
  - **Core Models:** User, Issue, OTP, Notification
- **Authentication Strategy:** Passwordless Email OTP (JWT Session Tokens)
- **Architecture Pattern:** Strict single role-based mobile application experience communicating via REST endpoints.

## 4. Roles & Core User Journey
The system is built on a strict two-role architecture within a single mobile app:

1. **Campus User (Reporter)**
   - Registers using details and uploads a College Identity Card via Expo ImagePicker.
   - Verifies email via OTP and waits for identity verification (Name/Institute matching against ID).
   - Logs in passwordlessly via Email OTP (No passwords exist in the system).
   - Routes to **Campus User Dashboard** (Greeting, Stats, Recent Issues).
   - Reports issues by selecting a category, adding a description, location, and optional photographic evidence via native device picker.
   - Tracks the status of their issues via a detailed timeline ("My Issues" tab) and in-app notifications.

2. **Authority / Maintenance**
   - Logs in securely via passwordless Email OTP.
   - Routes to a specialized **Management Dashboard** (Overview stats, Priority Issues, Recent Reports).
   - Views an organized work queue of all reported issues ("All Issues" tab with search).
   - Updates issue priorities (Low, Medium, High).
   - Mutates issue statuses (`SUBMITTED` -> `IN PROGRESS` -> `RESOLVED`) and leaves management remarks.

## 5. UI/UX Design System
- **Philosophy:** "Show only what the user needs at that moment."
- **Visual Language:** Minimal, clean, professional, and mobile-first. Avoids heavy shadows, glassmorphism, 3D elements, or AI SaaS aesthetics. Focuses on readability and fast task completion.
- **Color System:** 
  - Primary: `#176B52`
  - Dark Slate: `#24332F`
  - Background: `#F7F8F6`
  - Surface: `#FFFFFF`
  - Statuses: Success (`#2E7D5B`), Warning (`#B7791F`), Error (`#C94A4A`), Info (`#3E6F8F`).
- **Typography:** `Inter` (or system default clean sans-serif like San Francisco/Roboto).
- **Touch-Friendly:** Uses native interactions like bottom sheets, standard safe areas, and minimum 44x44 points for touch targets. Moderate border radius (8px - 16px).

## 6. Core Features Implemented
- **Authentication**: Passwordless OTP login, session management via JWT. Live OTPs are securely delivered to user emails using the **Resend HTTPS API**, completely bypassing traditional SMTP port blocks on strict cloud environments like Render.
- **Identity Verification**: Name and College/Institute matching against uploaded ID documents during registration.
- **Issue Reporting**: Submission of issues with categories, descriptions, locations, and robust image evidence uploads.
- **Issue Tracking**: Detailed timelines mapping status changes.
- **Authority Workflow**: Work queue management, sorting, filtering, priority management, and one-click quick-action buttons.
- **In-App Notifications**: Real-time notifications for users when an issue's status or priority changes.
- **Role-based Navigation & Security**: The app detects the user role upon authentication and routes to strictly segregated navigators (CampusUserNavigator vs ManagementNavigator). API routing protects endpoints based on roles.

## 7. Security, Privacy & Production Readiness (Phase 11.5)
The application has undergone a comprehensive production-readiness hardening phase:
- **Environment Isolation:** All sensitive credentials (`MONGODB_URI`, `JWT_SECRET`, `RESEND_API_KEY`, `EXPO_PUBLIC_API_URL`) are injected via `.env` files which are securely git-ignored.
- **Upload Protection:** The backend `/uploads` directory is secured with the `requireAuth` JWT verification middleware. Unauthenticated actors cannot access sensitive uploaded identity documents or evidence photos. Mobile `Image` components securely inject `Authorization: Bearer <token>` headers to retrieve images.
- **Hardcoded Secrets Removed:** Stripped fallback backend connection strings and dummy frontend URLs.
- **OTP Log Hiding:** OTP generation console logs are strictly suppressed in `production` environments to prevent sensitive data leaks.
- **Privacy & Data Handling:** Prepared policies covering data collection (Name, Email, Phone, College, ID Card, Evidence Photos), purpose (auth and maintenance location), access restrictions (auth-based), and secure MongoDB storage.

## 8. Development Roadmap & Current State
The project has successfully completed Phases 0 through 11.5, encompassing:
- **Phase 0:** Mobile Project Setup
- **Phase 1:** Authentication
- **Phase 2:** Identity Verification
- **Phase 3:** User Dashboard
- **Phase 4:** Issue Reporting
- **Phase 5:** Issue Tracking
- **Phase 6:** Management Dashboard
- **Phase 7:** Priority + Status Management + Work Queue
- **Phase 8:** Notifications & Communication Layer
- **Phase 9-11:** Final Core Integration, Testing, MVP Freeze
- **Phase 11.5:** Production Readiness Preparation

**Status:** MVP REFINED & PRODUCTION-READY.
All core workflows are complete, fully tested on physical devices, securely guarded, and working synchronously. The UI aligns with modern mobile standards and the system is ready for live production demonstration. There are 0 TypeScript compilation errors on both backend and frontend.

## 9. Future Roadmap (Deferred Innovation Features)
To take the application to the next level (BPUT 'Innovation' Category), the following advanced capabilities are planned for future phases (Phase 12+):
- **AI-based Issue Categorization**: Automatically classify issues based on descriptions.
- **Duplicate Issue Detection**: Prevent multiple reports of the same issue.
- **Smart Priority/Severity Prediction**: AI-driven priority assignment.
- **Voice-based Reporting**: Speech-to-Text capabilities allowing users to describe complaints verbally.
- **QR-based Location Identification**: Scanning physical QR codes across campus to auto-fill locations.
- **External Multi-channel Communication**: Email, SMS, and WhatsApp alerts for critical updates.
- **Multilingual Support & Offline Reporting**: Enhance accessibility and reliability.
- **Advanced Analytics**: Deeper insights for the management dashboard.
