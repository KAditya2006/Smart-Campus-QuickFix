# Development Rules

## 1. General Coding Rules
- Write clean, self-documenting code.
- Prioritize simplicity and readability over cleverness.
- Do not over-engineer solutions. Keep it functional for a fast hackathon environment.
- Strictly adhere to the Core MVP scope. **Do not implement Phase 15+ features during Phase 1-14.**
- **CRITICAL:** Do not implement Smart Campus QuickFix as a responsive web application. The core deliverable is a React Native mobile application.

## 2. Naming Conventions
- Variables, functions, methods: `camelCase`
- React Native Components, Interfaces/Types: `PascalCase`
- Constants, Environment variables: `UPPER_SNAKE_CASE`
- MongoDB collections: `plural, lowercase`

## 3. React Native Component Rules
- Components must be functional and use Hooks.
- Keep components small and focused.
- Extract reusable UI elements (Buttons, Inputs, Cards) into a shared `/components` directory early.
- Always use React Native primitives (`View`, `Text`, `TouchableOpacity`, `TextInput`). Do not use HTML tags (`div`, `span`).

## 4. Mobile Navigation Rules
- Use React Navigation.
- Handle physical back buttons (Android) properly.
- Use Stack Navigation for flows (Auth, Issue Creation) and Bottom Tabs for main dashboards.

## 5. Safe-Area & Touch Rules
- Wrap main screens in `SafeAreaView` to avoid notches and bezels.
- Ensure all interactive elements (`TouchableOpacity`, `Pressable`) have a minimum touch target size of 44x44 points.
- Provide visual feedback on press (e.g., `activeOpacity` on `TouchableOpacity`).

## 6. Mobile Forms & Keyboard Rules
- Use `KeyboardAvoidingView` or libraries like `react-native-keyboard-aware-scroll-view` to ensure inputs are not hidden by the keyboard.
- Set appropriate `keyboardType` for inputs (e.g., `email-address`, `phone-pad`).
- Use `returnKeyType` to guide users through forms.

## 7. Native Interactions & Pickers
- Use `expo-image-picker` for uploading Identity Cards and Issue Photos. Do not build custom camera UIs.
- Request appropriate device permissions (Camera, Media Library) before accessing them.

## 8. Network & Loading States
- Always show loading indicators (`ActivityIndicator`) during API calls.
- Handle offline/network errors gracefully (e.g., "Network error, please try again").
- Do not ignore empty states (e.g., "No issues found") or error states in the UI.

## 9. API & Backend Rules
- All API routes must return standardized JSON responses.
- Success: `{ success: true, data: { ... } }`
- Error: `{ success: false, error: "Description" }` with appropriate HTTP status codes.
- Do not create duplicate endpoints.

## 10. Database Rules
- Never store dummy/fake data in production workflows.
- Use Mongoose schemas to strictly type database documents.

## 11. Authentication & Security Rules
- Passwordless ONLY. Do not introduce password fields.
- Securely store the JWT on the device using `expo-secure-store` or `@react-native-async-storage/async-storage`.
- Protect all private API routes on the backend using JWT middleware.

## 12. UI/UX Rules (CRITICAL)
- **Strict Adherence to Reference:** The UI must match the provided reference image's minimal, clean aesthetic, adapted for mobile.
- **No Over-designing:** Avoid excessive gradients, shadows, 3D elements, or neon colors.
- **Colors:** Use ONLY the defined color palette in `designe.md`.
- **Show Only What's Needed:** Keep text minimal. Do not add excessive helper text.
- No web-only UI patterns (e.g., hover states, desktop sidebars).

## 13. Mobile Accessibility
- Use semantic accessibility labels (`accessibilityLabel`, `accessibilityRole`) for screen readers.
- Ensure sufficient color contrast.

## 14. Testing Rules
- Ensure the Core User Journey can be completed on a mobile simulator without errors before marking a phase complete.
- Test form submissions with valid and invalid data.

## 15. Scope Control Rules (AI AGENT DIRECTIVES)
- **DO NOT** add random features not listed in the PRD.
- **DO NOT** change finalized requirements (roles, auth flow, mobile stack) without explicit user permission.
- **DO NOT** change the architecture without documenting it in `architecture.md` first.
- **DO NOT** replace working functionality unnecessarily.
- **DO NOT** implement optional features (Phase 15+) before Core MVP completion (Phase 14).
