# Architecture Document

## 1. System Overview
**Smart Campus QuickFix** will be developed as a mobile application using React Native and Expo, connected to a custom REST API powered by Node.js, Express, and MongoDB. The architecture is designed to provide a seamless, single role-based mobile application experience, prioritizing rapid development and reliability for a hackathon.

## 2. Mobile Application Architecture (Frontend)
- **Framework:** React Native + Expo.
- **Language:** TypeScript.
- **Navigation:** React Navigation (Stack Navigators for Auth, Bottom Tab Navigators for User/Management roles).
- **State Management:** React Context API for global state (Auth Session, Role, Notifications) and local state for components.
- **Styling:** React Native StyleSheet (minimalist design matching `designe.md`).
- **Icons:** Expo vector icons / Lucide React Native.

## 3. Backend Architecture
- **Framework:** Node.js with Express.js.
- **Language:** TypeScript.
- **Architecture Pattern:** RESTful API.

## 4. Database Architecture
- **Database:** MongoDB.
- **ODM (Object Data Modeling):** Mongoose.

## 5. Authentication Architecture
- **Strategy:** Passwordless Email OTP.
- **Flow:**
  1. Client (Mobile App) sends email to `/api/auth/otp/send`.
  2. Backend generates a 6-digit OTP, stores it temporarily with an expiration, and emails it.
  3. Client submits email + OTP to `/api/auth/otp/verify`.
  4. Backend validates OTP. If valid, issues a JWT (JSON Web Token).
  5. Mobile App stores the JWT securely (e.g., `expo-secure-store`).

## 6. Role-Based Navigation Architecture
- The mobile app determines the user's role upon successful authentication (parsing the JWT or fetching the profile).
- **Routing:**
  - If `role === 'USER'`, load the `CampusUserNavigator` (Bottom Tabs: Home, Issues, Notifications, Profile).
  - If `role === 'AUTHORITY'`, load the `ManagementNavigator` (Bottom Tabs/Stacks: Dashboard, All Issues, Priority Queue).
- The user cannot access the other role's screens.

## 7. Identity Verification Flow
1. User uploads ID card image via Expo ImagePicker during registration.
2. App sends data + image to the backend.
3. Backend handles file upload and runs verification logic (Name/Institute matching).
4. `verification_status` is updated in MongoDB (`Pending`, `Verified`, `Rejected`, `Manual Review`).

## 8. API Communication
- Use `fetch` or `axios` in the React Native app.
- Include the JWT in the `Authorization: Bearer <token>` header for all protected routes.
- Implement interceptors to handle 401 Unauthorized responses (force logout/token refresh).

## 9. Issue Lifecycle
- `SUBMITTED`: Default state upon creation.
- `IN PROGRESS`: Set by Authority.
- `RESOLVED`: Set by Authority.

## 10. API Architecture (REST Endpoints)
**Auth:**
- `POST /api/auth/register` (Multipart/form-data for image)
- `POST /api/auth/otp/send`
- `POST /api/auth/otp/verify`
- `GET /api/user/profile`

**Issues:**
- `POST /api/issues` (Multipart/form-data for evidence)
- `GET /api/issues` (Filtered by `req.user` in backend)
- `GET /api/issues/:id`
- `PATCH /api/issues/:id/status` (Authority only)

## 11. Data Models (Mongoose Schemas)

**User Model:**
- `_id` (ObjectId)
- `email` (String, Unique)
- `fullName` (String)
- `phoneNumber` (String)
- `collegeName` (String)
- `idCardUrl` (String)
- `verificationStatus` (Enum: 'Pending', 'Verified', 'Rejected', 'Manual Review')
- `role` (Enum: 'USER', 'AUTHORITY')
- `createdAt`, `updatedAt`

**Issue Model:**
- `_id` (ObjectId)
- `userId` (ObjectId, ref: 'User')
- `category` (String)
- `location` (String)
- `description` (String)
- `photoUrl` (String, default: null)
- `status` (Enum: 'SUBMITTED', 'IN PROGRESS', 'RESOLVED')
- `priority` (Enum: 'LOW', 'MEDIUM', 'HIGH', default: null)
- `managementRemarks` (String, default: '')
- `createdAt`, `updatedAt`

## 12. File Storage Strategy
- Backend handles image uploads (using `multer`).
- Images are saved to a local `/uploads` directory (served statically by Express) or uploaded directly to a cloud provider (e.g., AWS S3, Cloudinary) from the backend.
- The resulting URL is saved in MongoDB (`idCardUrl`, `photoUrl`).

## 13. Error Handling
- **Backend:** Centralized error handling middleware. Standardized response: `{ success: false, error: "Message" }`.
- **Mobile App:** Catch API errors, display native alerts or toast notifications (e.g., `react-native-toast-message`). Handle offline scenarios gracefully.

## 14. Validation
- **Backend:** Request validation using Zod or Joi before hitting controllers.
- **Mobile App:** Form validation before dispatching API calls.

## 15. Testing Architecture
- Manual testing on physical mobile devices or simulators (iOS/Android) via Expo Go.
- Postman/Insomnia for API endpoint testing.
