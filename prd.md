# Product Requirements Document (PRD)

## 1. Product Overview
**Smart Campus QuickFix** is a mobile application designed to help campus users report and track maintenance and infrastructure issues in a smart, transparent, and user-friendly manner. The application facilitates communication between students/staff and the campus maintenance authority to resolve problems like broken infrastructure, network issues, and cleanliness concerns. The product is delivered as a single role-based mobile application.

## 2. Problem Statement
Campus environments often suffer from inefficient issue reporting mechanisms. Students find broken equipment or facilities, but reporting them is tedious or lacks transparency. Maintenance authorities struggle to prioritize tasks, track progress, and communicate resolution status back to the reporters.

## 3. Problem Context
This project is developed as part of the **BPUT Tech Carnival 2026 T11 — Mobile App Development Contest**. The focus is on creating a functional mobile application prototype within a 3-hour development timeframe that demonstrates clear purpose, functional core features, and a modern mobile UI/UX.

## 4. Product Goal
Develop a minimal, robust, and functional mobile application where campus users can easily report issues with context (category, location, photo), and management can efficiently track, prioritize, and resolve these issues directly from their mobile devices.

## 5. Target Users
1. **Campus Users (Reporters):** Students, faculty, and staff who experience or observe campus issues.
2. **Maintenance / Authority:** Staff members responsible for reviewing, prioritizing, and fixing reported issues.

## 6. Roles
- **ROLE 1: Campus User / Reporter** (Standard user role for reporting and tracking personal issues)
- **ROLE 2: Maintenance / Authority** (Administrative role for managing all reported issues)
*(Project Design Decision: We will stick to these two roles to keep the MVP scope achievable and focused. There are no separate web applications; roles dictate the mobile experience).*

## 7. Core User Journey (Mobile)
1. **Campus User** registers using their details and identity card via the mobile app.
2. User verifies email via OTP and waits for identity verification.
3. User logs in (Passwordless via Email OTP).
4. App detects role and routes User to the Campus User Dashboard.
5. User reports an issue (selects category, describes, adds location, uploads optional photo via native picker).
6. Issue is stored in the system (Status: SUBMITTED).
7. **Maintenance/Authority** logs in and is routed to the Management Dashboard.
8. Authority reviews the issue, assigns priority, and updates status (Status: IN PROGRESS).
9. Authority completes the work, adds remarks, and resolves the issue (Status: RESOLVED).
10. Campus User receives updates and tracks the complete history on their mobile dashboard.

## 8. Core Functional Requirements
- **Authentication:** Passwordless OTP-based login.
- **Reporting:** Simple mobile form with Category, Location, Description, and Native Photo Upload.
- **Tracking:** View submitted issues and real-time status updates on mobile.
- **Management:** Mobile dashboard for authorities to view, filter, prioritize, and update issue statuses.

## 9. Authentication Requirements (Project Design Decision)
- **Registration Fields:** Full Name, Email, Phone Number, College/Institute Name, Identity Card Upload.
- **Login Mechanism:** Passwordless. Users input email -> Receive OTP -> Validate OTP -> App routes to Role-based Mobile Dashboard.

## 10. Identity Verification
- During registration, the uploaded identity card must be verified against the entered Name and College/Institute.
- **States:** Pending, Verified, Rejected, Manual Review.
- *Note:* Do not blindly require exact string equality; use normalization or allow fallback to Manual Review to avoid blocking legitimate users.

## 11. Issue Reporting (BPUT Requirement)
- **Input:** Select issue category, provide a short description, specify location.
- **Evidence:** Optional photograph or relevant evidence attachment (via mobile camera/gallery).
- **Submission:** Simple and functional mechanism to submit and record the issue.

## 12. Issue Tracking (BPUT Requirement)
- **Tracking:** Clear mechanism for users to view submitted issues and track status.
- **Statuses:** `SUBMITTED`, `IN PROGRESS`, `RESOLVED`.

## 13. Prioritization (BPUT Requirement)
- **Prioritization:** Mechanism for management to categorize or prioritize issues (e.g., Low, Medium, High).

## 14. Management Workflow
- View a consolidated list of all issues via the mobile interface.
- Filter and search issues.
- Update issue status.
- Assign priority.
- Add maintenance/update remarks.

## 15. Dashboard Requirements (BPUT Requirement)
- **User Dashboard:** Greeting, summary statistics (Total, Active, Resolved), quick 'Report Issue' CTA, list of recent issues.
- **Management Dashboard:** Summary statistics, priority issues overview, recent reports, basic analytics.

## 16. Notification Requirements (BPUT Requirement)
- Where appropriate, provide users with notifications or updates regarding their reported issues (e.g., status changes).

## 17. Core Pages (Mobile Screens)
**Authentication:**
1. Register
2. Email OTP Verification
3. Login (Email input) / OTP validation

**Campus User:**
4. User Dashboard
5. Report Issue
6. My Issues
7. Issue Details
8. Notifications
9. Profile

**Management:**
10. Management Dashboard
11. All Issues
12. Manage Issue
13. Priority / Work Queue
14. Analytics

## 18. Core MVP Scope
The MVP must perfectly execute the Core User Journey on a mobile device. This includes stable authentication, reliable issue creation with native uploads, accurate status tracking, and the management interface for updating issues. **Quality, relevance, and functionality of these core features take absolute precedence over advanced technologies.**

## 19. Out of Scope for MVP
- AI/ML features (unless explicitly part of a later stage).
- Complex multi-tier RBAC.
- Password-based authentication.
- Desktop web applications or responsive web apps.

## 20. Optional Future Features (BPUT 'Innovation' Category)
*These will ONLY be considered after Phase 14 (Core MVP Completion).*
- AI intelligent issue categorization.
- Duplicate issue detection.
- QR-based location identification.
- Smart priority/severity prediction.
- Voice-based reporting.
- Multilingual support.
- Offline reporting.
- Advanced analytics.

## 21. Success Criteria
- A user can register, verify, and log in seamlessly via the mobile app.
- A user can report an issue with a photo from their device in under 30 seconds.
- Management can see the issue immediately and update its status from their device.
- The user can see the status update reflected on their mobile dashboard.
- The UI perfectly matches the minimal, clean aesthetic of the reference design, optimized for touch.

## 22. Acceptance Criteria
- Mobile App runs without fatal crashes on devices/emulators.
- All forms have basic validation.
- Touch-friendly navigation (bottom tabs/stacks) works perfectly.
- No dummy data in core workflows (real backend integration).

## 23. Competition Constraints
- **Development Time:** 3 Hours.
- **Participation:** Individual.
- **Evaluation:** Problem Understanding, Functionality, UI/UX, Innovation, Performance, Demo.

## 24. Demo Requirements
- Must demonstrate a functional mobile application prototype with working core functionality.
- Clear purpose.
- Smooth navigation through the complete Core User Journey.
