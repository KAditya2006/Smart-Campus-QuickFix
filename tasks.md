# Implementation Roadmap & Tasks

## PHASE 0 — Mobile Project Setup
- [x] TASK-SETUP-001: Initialize Expo React Native project with TypeScript.
- [x] TASK-SETUP-002: Initialize backend Node.js + Express + TypeScript repository.
- [x] TASK-SETUP-003: Set up MongoDB connection (Mongoose) in the backend.
- [x] TASK-SETUP-004: Configure React Navigation (Stack and Bottom Tabs).
- [x] TASK-SETUP-005: Create base React Native UI components (Button, Input, Card) applying design system colors.
- [x] TASK-SETUP-006: Set up API communication layer (`axios` or `fetch`) in the mobile app.

## PHASE 1 — Authentication
- [x] TASK-AUTH-001: Implement Login Mobile UI (Email input).
- [x] TASK-AUTH-002: Implement OTP Verification Mobile UI.
- [x] TASK-AUTH-003: Implement Registration Mobile UI.
- [x] TASK-AUTH-004: Backend API: Create `/auth/otp/send` logic (generate and store OTP).
- [x] TASK-AUTH-005: Backend API: Create `/auth/otp/verify` logic (validate OTP, return JWT).
- [x] TASK-AUTH-006: Backend API: Create `/auth/register` logic.
- [x] TASK-AUTH-007: Implement JWT secure storage (`expo-secure-store`) and role-based navigation routing in app.

## PHASE 2 — Identity Verification (MVP Core)
- [x] TASK-ID-001: Implement `expo-image-picker` for ID Card upload in Registration.
- [x] TASK-ID-002: Backend API: Handle multipart form data (`multer`) and save ID card images.
- [x] TASK-ID-003: Backend API: Implement basic verification logic (compare name/college, set status).

## PHASE 3 — User Dashboard
- [x] TASK-UDASH-001: Implement Campus User Bottom Tab Navigator layout.
- [x] TASK-UDASH-002: Implement Dashboard UI (Greeting, Stats).
- [x] TASK-UDASH-003: Backend API: Create endpoint to fetch user stats and recent issues.
- [x] TASK-UDASH-004: Connect Dashboard UI to backend API.

## PHASE 4 — Issue Reporting
- [x] TASK-REP-001: Implement Report Issue UI form with keyboard-aware scrolling.
- [x] TASK-REP-002: Implement `expo-image-picker` for issue evidence photo.
- [x] TASK-REP-003: Backend API: Create `/issues` POST endpoint to store issues and handle image uploads.
- [x] TASK-REP-004: Handle form submission, loading state (`ActivityIndicator`), and navigation back to Dashboard.

## PHASE 5 — Issue Tracking
- [x] TASK-TRK-001: Implement "My Issues" FlatList UI with filtering tabs.
- [x] TASK-TRK-002: Backend API: Create endpoint to fetch user-specific issues.
- [x] TASK-TRK-003: Implement "Issue Details" Stack Screen UI with timeline.

## PHASE 6 — Management Dashboard
- [x] TASK-MDASH-001: Implement Authority Bottom Tab Navigator layout.
- [x] TASK-MDASH-002: Implement Management Dashboard UI with overview statistics.
- [x] TASK-MDASH-003: Backend API: Create endpoint to fetch global issue stats.

## PHASE 7 — Issue Management
- [x] TASK-MNG-001: Implement "All Issues" FlatList UI with search bar.
- [x] TASK-MNG-002: Backend API: Create endpoint to fetch all issues (Authority only).
- [x] TASK-MNG-003: Implement "Manage Issue" detail Stack Screen UI.
- [x] TASK-MNG-004: Backend API: Create PATCH endpoint to update issue status, priority, and remarks.
- [x] TASK-MNG-005: Connect Manage Issue UI to PATCH endpoint.

## PHASE 8 — Priority / Work Queue
- [x] TASK-PRI-001: Implement UI for viewing issues sorted by priority on the Management Dashboard.

## PHASE 9 — Notifications
- [x] TASK-NOT-001: Implement Notifications FlatList UI.
- [x] TASK-NOT-002: Backend API: Logic to generate notification records when an issue is updated.
- [x] TASK-NOT-003: Fetch and display notifications.

## PHASE 10 — Final Polish & Documentation
- [x] TASK-POL-001: End-to-end bug testing and final Core Integration.
- [x] TASK-POL-002: Refine styling and UX consistency across screens.
- [x] TASK-DOC-001: Update README.md with setup and architecture.
- [x] TASK-DOC-002: Create project-overview.md with high-level summary.
- [x] TASK-QA-001: Run Backend TS compilation and fix type errors.
- [x] TASK-QA-002: Run Frontend TS compilation and fix type errors.

## PHASE 11 — MVP Core Freeze
- [x] TASK-MVP-001: Core MVP completion. Application is ready for final demo.

## PHASE 11.5 — Production Readiness Preparation
- [x] TASK-PROD-001: Separate environment configurations (Dev vs Prod).
- [x] TASK-PROD-002: Secure database connection (MongoDB Atlas setup ready, dynamic URI).
- [x] TASK-PROD-003: Configure real SMTP credentials safely and remove OTP console logs in production.
- [x] TASK-PROD-004: Validate JWT_SECRET usage and remove default insecure secrets.
- [x] TASK-PROD-005: Protect /uploads directory and ensure evidence/images handle authorization.
- [x] TASK-PROD-006: Clean up hardcoded localhost and development IPs from mobile app.
- [x] TASK-PROD-007: Document privacy and data handling categories.

---

## PHASE 12+ — OPTIONAL FEATURES (DEFERRED)
- [ ] TASK-OPT-001: AI issue categorization.
- [ ] TASK-OPT-002: Duplicate issue detection.
- [ ] TASK-OPT-003: QR-based location identification.
- [ ] TASK-OPT-004: Smart severity prediction.
- [ ] TASK-OPT-005: Voice-based reporting.
- [ ] TASK-OPT-006: Multilingual support.
- [ ] TASK-OPT-007: Offline reporting.
