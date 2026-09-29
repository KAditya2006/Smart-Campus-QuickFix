# Smart Campus QuickFix

Smart Campus QuickFix connects campus users with the responsible authority through a structured digital issue-reporting and tracking workflow.

## 1. Problem
Campus issues (electrical, plumbing, infrastructure) are often difficult to report, track, and process efficiently. Traditional methods rely on paper forms or emails, leading to a lack of transparency and slow resolution times.

## 2. Solution
A mobile application that streamlines the entire workflow:
1. **Report**: Campus users submit issues with categories, descriptions, and photo evidence.
2. **Track**: Users track issue progress via a transparent status timeline.
3. **Process**: Authorities manage their work queue, prioritizing and resolving issues.
4. **Notify**: Users receive in-app notifications whenever their issue is updated.

## 3. Technology Stack
- **Mobile Frontend**: React Native, Expo, TypeScript, React Navigation
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (Mongoose)
- **Authentication**: Passwordless OTP flow with JWT session tokens

## 4. Features & Roles

### Campus User
- Register with Identity Verification (Document Upload)
- Passwordless OTP Login
- Personalized Dashboard
- Report Issues (Upload Photo Evidence)
- View "My Issues"
- Real-time Notifications & Status Timeline

### Authority / Maintenance
- Secure Passwordless OTP Login
- Authority Dashboard
- Manage Work Queue
- Mutate Issue Priorities (Low, Medium, High)
- Mutate Issue Statuses (Submitted -> In Progress -> Resolved)
- Add Remarks to Status Changes

## 5. Local Development Setup

### Backend Setup
1. `cd server`
2. `npm install`
3. Create a `.env` file based on `.env.example` with local values. Do NOT commit real credentials.
4. `npm run dev`

### Mobile Setup
1. `cd mobile`
2. `npm install`
3. Create a `.env` file based on `.env.example`:
   ```env
   EXPO_PUBLIC_API_URL=http://<YOUR_IP_ADDRESS>:3000/api
   ```
4. `npx expo start`

## 6. Production Environment Requirements

To run this application in production, you must set the following environment variables. Ensure that `.env` files are in `.gitignore`.

**Backend (.env)**
- `PORT`: (Optional, defaults to 3000)
- `NODE_ENV`: Must be `production`
- `MONGODB_URI`: Your MongoDB Atlas connection string (e.g. `mongodb+srv://...`)
- `JWT_SECRET`: A strong, unpredictable secret for signing JWTs.
- `SMTP_HOST`: e.g. `smtp.gmail.com`
- `SMTP_PORT`: e.g. `587`
- `SMTP_USER`: The email address used for sending OTPs.
- `SMTP_PASS`: App Password (do not use the standard email password).

**Mobile (.env)**
- `EXPO_PUBLIC_API_URL`: The production API domain, e.g. `https://api.yourdomain.com/api`

## 7. Security Notes & CORS
- **OTP Delivery**: Handled purely via SMTP. Ensure `SMTP_PASS` is kept secret. Development OTP bypasses have been stripped out of production code.
- **JWT Protection**: All JWTs are signed with the strict `JWT_SECRET`.
- **Uploads**: The `/uploads` route uses `requireAuth` to ensure sensitive files like student Identity Cards are not accessible to unauthenticated users. The mobile application injects the Authorization headers into its native `Image` components.
- **CORS**: Currently unrestricted (`*`), which is standard for a mobile-only API. If deploying a web panel in the future, configure CORS to the specific domains in `app.ts`.

## 8. Privacy & Data Handling Preparation
To comply with user privacy regulations, an eventual Privacy Policy must address the following:
- **What data is collected**: Full Name, Email, Phone Number, College/Institute Name, College Identity Document (photo), and Issue Evidence (photos/location).
- **Why it is collected**: To authenticate users securely and to enable the maintenance team to locate, evaluate, and prioritize reported physical issues on campus.
- **Who can access it**: User profiles and Identity Documents are strictly accessible by system authorities. Issue evidence is restricted to authenticated users.
- **Data storage**: Hosted securely on MongoDB Atlas with token-based access.

## 9. Build for Production
To build the Android application:
1. `cd mobile`
2. Install EAS CLI: `npm install -g eas-cli`
3. Login: `eas login`
4. Build: `eas build -p android --profile production`
