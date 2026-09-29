# Project Memory & Context

## 1. Project Identity
- **Name:** Smart Campus QuickFix
- **Context:** BPUT Tech Carnival 2026 T11 — Mobile App Development Contest.
- **Objective:** Build a mobile app prototype for reporting, tracking, and managing campus issues efficiently.

## 2. Problem Statement Summary
Campus users need a simple mobile app to report infrastructure/maintenance issues with location and evidence. Management needs a mobile dashboard to prioritize, track, and update the status of these issues, providing transparency to the users.

## 3. Current Development Stage
**[COMPLETED]** Phase 0 - Mobile Project Setup.
**[COMPLETED]** Phase 1 - Authentication.
**[COMPLETED]** Phase 2 - Identity Verification & Verification Pipeline.
**[COMPLETED]** Phase 3 - User Dashboard.
**[COMPLETED]** Phase 4 - Issue Reporting.
**[COMPLETED]** Phase 5 - Issue Tracking.
**[COMPLETED]** Phase 6 - Authority/Maintenance Management Dashboard.
**[COMPLETED]** Phase 7 - Priority + Status Management + Work Queue.
**[COMPLETED]** Phase 8 - Notifications & Communication Layer.
**[COMPLETED]** Phase 9 - Final Core Integration & Validation.
**[COMPLETED]** Phase 10 - Final Demo, Deployment & Challenge Readiness.
**[COMPLETED]** Phase 11.5 - Production Readiness Preparation (Env config, SMTP, JWT security, Upload protection).

## 4. Finalized Roles [FINALIZED] [DO NOT CHANGE]
1. **Campus User / Reporter:** Submits and tracks issues.
2. **Maintenance / Authority:** Manages, prioritizes, and resolves issues.
*Do not introduce additional roles. Both roles use the same mobile app.*

## 5. Finalized Authentication [FINALIZED] [DO NOT CHANGE]
- Passwordless Authentication via Email OTP.
- No password fields exist in the system.

## 6. Finalized Registration [FINALIZED]
- Required fields: Full Name, Email, Phone Number, College/Institute Name, Identity Card Upload.

## 7. Identity Verification Logic [FINALIZED]
- User uploads ID card.
- System checks Name and College against ID card data.
- States: Pending, Verified, Rejected, Manual Review.
- Fallback to Manual Review instead of blocking users for uncertain matches.

## 8. Issue Lifecycle [FINALIZED]
- `SUBMITTED` -> `IN PROGRESS` -> `RESOLVED`

## 9. Product Structure [FINALIZED]
- **One mobile application** with role-based experiences. App routes to the correct navigator after authentication.

## 10. Page Structure (Mobile Screens)
- **User:** Dashboard (Tab), Report Issue (Stack), My Issues (Tab), Issue Details (Stack), Notifications (Tab), Profile (Tab).
- **Management:** Dashboard (Tab), All Issues (Tab), Manage Issue (Stack), Priority Queue, Analytics.

## 11. UI/UX Decisions [FINALIZED] [DO NOT CHANGE]
- **Style:** Minimal, clean, mobile-first. No AI SaaS aesthetics.
- **Rule:** Show only what the user needs at that moment. Native interactions (bottom sheets, pickers).

## 12. Color System [FINALIZED]
- Primary: `#176B52`, Dark Slate: `#24332F`, Background: `#F7F8F6`, Surface: `#FFFFFF`.

## 13. Architecture Decisions [FINALIZED]
- **PROJECT TYPE:** Mobile Application
- **FRONTEND:** React Native + Expo + TypeScript
- **BACKEND:** Node.js + Express + TypeScript
- **DATABASE:** MongoDB + Mongoose
- **API:** REST

## 14. Development Rules [FINALIZED]
- **Core MVP absolutely must be completed and tested before ANY Phase 15+ optional features are touched.**
- The application MUST be built as a React Native mobile application, NOT a responsive web app.

## 15. Optional Features Backlog [OPTIONAL]
*Deferred until Core MVP is complete and tested.*
- AI categorization, Duplicate detection, QR locations, Smart priority prediction, Voice reporting, Offline mode, Advanced analytics.

## 16. Current Priority
- Await actual production deployment and store release.

## 17. Decisions That Must Not Be Changed Casually
- The technology stack (React Native, Node, MongoDB).
- Authentication type (Passwordless OTP).
- Role structure (Only 2 roles in one app).

## 18. FINAL MVP & PRODUCTION READINESS STATUS
- **Core functionality complete**: Yes
- **Core E2E flow validated**: Yes
- **Mobile build validated**: Yes (TS compilation clean)
- **Deployment configuration validated**: Yes (Env config separated, Secrets protected)
- **Security Check**: Yes (OTP logs removed, Uploads protected, SMTP dynamic)
- **Demo flow prepared**: Yes (Demo users identified in README)
- **Documentation updated**: Yes (project-overview.md, privacy policies in README.md)

### Known limitations
- Uploaded identity verification is visually shown/approved immediately as a mock for the demo since no true government API is linked.

### Deferred Features
- AI-based issue categorization
- Voice-based issue reporting
- Push notifications
- Advanced analytics
- Offline support

## 19. Completed Work
- Fully built the React Native mobile app and Node/Express backend.
- Implemented and secured auth, issue lifecycle, timelines, priorities, and notifications.
- Polished the mobile UI ensuring clean design.
- Documented everything and completed TS compilations with 0 errors.
- Completed Production Readiness Preparation (Environment variables, database Atlas setup checks, SMTP fixes).

## 20. Pending Work
- NONE. Core MVP is complete and PRODUCTION PREPARATION COMPLETE — DEPLOYMENT NOT YET PERFORMED.
