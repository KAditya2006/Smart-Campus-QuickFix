# Smart Campus QuickFix - Complete Project Overview

## 1. Project Identity & Context
- **Name:** Smart Campus QuickFix
- **Context:** BPUT Tech Carnival 2026 T11 — Mobile App Development Contest
- **Objective:** Build a functional mobile application prototype within a 3-hour development timeframe that demonstrates a clear purpose, functional core features, and a modern mobile UI/UX.
- **Type:** Mobile Application (React Native + Expo)
- **Backend:** Node.js + Express (REST API)
- **Database:** MongoDB Atlas (Cloud)
- **Language:** TypeScript
- **Target Audience:** Campus users (students/staff) and Maintenance Authorities.

## 2. Problem Statement
Campus users often find it difficult to report, track, and process infrastructure issues (plumbing, electrical, cleanliness, etc.) efficiently. Existing solutions are fragmented, lack transparency, rely on manual paper forms or emails, and make it hard for authorities to prioritize tasks.

## 3. Solution & Product Goal
Smart Campus QuickFix connects campus users directly with the responsible authority through a structured digital issue-reporting and tracking workflow. The goal is to provide a minimal, robust, and functional mobile application where campus users can easily report issues with context (category, location, photo), and management can efficiently track, prioritize, and resolve these issues directly from their mobile devices.

## 4. Roles & Core User Journey
The system is built on a strict two-role architecture (no complex multi-tier RBAC for the MVP):

1. **Campus User (Reporter)**
   - Registers using details and uploads a College Identity Card.
   - Verifies email via OTP and waits for identity verification.
   - Logs in passwordlessly via Email OTP.
   - Reports issues by selecting a category, adding a description, location, and optional photographic evidence via native device picker.
   - Tracks the status of their issues via a detailed timeline and in-app notifications.

2. **Authority / Maintenance**
   - Logs in securely (passwordless OTP).
   - Routes to a specialized Management Dashboard.
   - Views an organized work queue of all reported issues.
   - Updates issue priorities (Low, Medium, High).
   - Mutates issue statuses (`SUBMITTED` -> `IN PROGRESS` -> `RESOLVED`) and leaves remarks.

## 5. Core Features Implemented
- **Authentication**: Passwordless OTP login, session management via JWT. No passwords exist in the system.
- **Real Email Integration**: Live OTPs are securely delivered to user emails using `nodemailer` and Gmail SMTP App Passwords.
- **Identity Verification**: Name and College/Institute matching against uploaded ID documents during registration.
- **Issue Reporting**: Submission of issues with categories, descriptions, locations, and robust image evidence uploads (handling Android `FormData` native objects flawlessly).
- **Issue Tracking**: Detailed timelines mapping status changes.
- **Authority Workflow**: Work queue management, sorting, filtering, priority management, and one-click quick-action buttons (Approve, Resolve, Reject).
- **In-App Notifications**: Real-time notifications for users when an issue's status or priority changes.
- **Role-based Security**: Strict API routing and data protection ensuring users cannot mutate authority endpoints and vice-versa.

## 6. UI/UX & Design Philosophy
- **Philosophy:** "Show only what the user needs at that moment."
- **Style:** Minimal, clean, professional, and mobile-first. Avoids heavy shadows, 3D elements, or AI SaaS aesthetics.
- **Color System:** Primary (`#176B52`), Dark Slate (`#24332F`), Background (`#F7F8F6`), Surface (`#FFFFFF`), with semantic colors for statuses (Success: `#2E7D5B`, Warning: `#B7791F`, Error: `#C94A4A`).
- **Touch-Friendly:** Uses native interactions like bottom sheets, standard safe areas, and minimum 44x44 points for touch targets.

## 7. Architecture Highlights
- **Mobile Client (Frontend):** Expo (React Native), React Navigation (Stack Navigators for Auth, Bottom Tab Navigators for roles). React Context API for global state.
- **Networking:** `Axios` implemented as a custom API Client. Axios specifically bypasses the notorious Android OkHttp `FormData` boundary bugs, ensuring highly stable image uploads across all physical devices.
- **Backend API:** Node.js + Express REST API. Middleware for Auth and File Uploads (`multer`). Controllers strictly separated from services. Request validation is handled seamlessly.
- **Database (Mongoose Schemas):** 
  - **User:** Stores email, full name, phone, college, ID card URL, verification status, and role.
  - **Issue:** Stores category, location, description, photo URL, status, priority, and management remarks.
- **Deployment-Ready:** Environment variables properly isolated (e.g., `EXPO_PUBLIC_API_URL` for mobile, `MONGODB_URI` and `SMTP` credentials for server). No hardcoded secrets, robust CORS configuration.

## 8. Recent Bug Fixes & Polish
- **Admin Panel UI/UX**: Overhauled the `AuthorityDashboardScreen` layout to a responsive 2x2 grid for summary boxes, making them fully clickable to route to the Issues tab. Added a Notification Bell to the admin header reflecting unread counts.
- **One-Click Operational Actions**: Revamped the `AuthorityIssueDetailsScreen` to include quick-action buttons (Approve, Resolve, Reject) for seamless status updates.
- **Evidence Rendering Fix**: Replaced hardcoded `localhost` IPs with a dynamic `API_BASE_URL` resolution strategy in the Issue Details screens, ensuring uploaded evidence photos render correctly.
- **Security & Network**: Removed all development OTP bypasses. The system strictly relies on the real Gmail SMTP service for OTP delivery. Added detailed backend server logging to facilitate offline local testing.

## 9. Development Phases & Current State
The project has successfully completed Phases 0 through 11, encompassing mobile setup, authentication, identity verification, dashboards, issue reporting/tracking, management workflows, priorities, and notifications.

**Status:** MVP REFINED & POLISHED. (Core MVP Freeze)
All core workflows are complete, fully tested on physical devices, and working synchronously. The UI aligns with modern mobile standards and the system is production-ready for demonstration. There are 0 TypeScript compilation errors on both backend and frontend.

## 10. Future Roadmap & Upcoming Features (Deferred)
To take the application to the next level (BPUT 'Innovation' Category), the following advanced capabilities are planned:
- **AI-based Issue Categorization**: Automatically classify issues based on descriptions.
- **Duplicate Issue Detection**: Prevent multiple reports of the same issue.
- **Smart Priority/Severity Prediction**: AI-driven priority assignment.
- **Voice-based Reporting**: Speech-to-Text capabilities allowing users to describe complaints verbally.
- **QR-based Location Identification**: Scanning physical QR codes across campus to auto-fill locations.
- **External Multi-channel Communication**: Email, SMS, and WhatsApp alerts for critical updates.
- **Multilingual Support & Offline Reporting**: Enhance accessibility and reliability.
- **Advanced Analytics**: Deeper insights for the management dashboard.
