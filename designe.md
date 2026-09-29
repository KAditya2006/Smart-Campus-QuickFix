# UI/UX Design Specification (Mobile)

## 1. Design Philosophy
**"Show only what the user needs at that moment."**
The design is minimal, clean, professional, and mobile-first. It feels like a real, reliable campus utility application, not an AI-generated SaaS concept. The focus is on readability, touch-friendly interactions, and fast task completion on a mobile device.

## 2. Visual Language
- **Mobile-first:** Explicitly designed for iOS and Android form factors.
- **Safe Areas:** Content must respect device notches and bottom indicators.
- **Low Text Density:** Clear, concise labeling.
- **Structured Space:** Intentional use of whitespace, dividers, and simple lists.
- **Flat & Clean:** Avoid glassmorphism, heavy shadows, and 3D elements.

## 3. Color Palette
Strictly adhere to these colors:
- **Primary:** `#176B52` (Buttons, active tabs, key icons)
- **Dark Slate:** `#24332F` (Headers, strong emphasis)
- **Background:** `#F7F8F6` (App background)
- **Surface:** `#FFFFFF` (Cards, bottom nav, inputs)
- **Primary Text:** `#17201D` (Main typography)
- **Secondary Text:** `#66736E` (Subtitles, helper text, inactive states)
- **Border:** `#DDE3DF` (Dividers, input borders)
- **Success:** `#2E7D5B` (Resolved status, success alerts)
- **Warning:** `#B7791F` (In Progress status, pending items)
- **Error:** `#C94A4A` (Form errors, critical alerts)
- **Info:** `#3E6F8F` (Informational badges)

## 4. Typography
- **Font Family:** `Inter` (or system default clean sans-serif like San Francisco/Roboto).
- **Style:** Clean, modern, readable.
- **Hierarchy:** Distinct font weights (bold for titles, regular for body, medium for buttons) and sizes to guide the eye.

## 5. Mobile Spacing & Touch
- **Base unit:** `4px` or `8px`.
- **Screen Margins:** Consistent horizontal padding (`16px` or `20px`) for screen edges.
- **Touch Targets:** Minimum 44x44 points for all interactive elements (buttons, icons).

## 6. Border Radius
- Moderate rounding. Not entirely pill-shaped, not sharp corners.
- Buttons & Inputs: `8px` or `12px`
- Cards/Containers: `12px` or `16px`

## 7. Shadows
- Extremely subtle, native-feeling shadows (using React Native `elevation` on Android and `shadow*` props on iOS).
- Primarily for lifting the bottom navigation bar or floating action buttons (if any).

## 8. Mobile UI Components

**Buttons:**
- Primary: Solid `#176B52` background, white text. Full width in forms.
- Secondary/Outlined: Transparent background, `#176B52` border and text.
- Disabled: Grayed out background (`#DDE3DF`), unclickable.

**Inputs & Forms:**
- Light border (`#DDE3DF`), white background.
- Keyboard-aware: Inputs must scroll into view above the keyboard.
- Clear labels above the input.

**Cards & Lists:**
- Use white `#FFFFFF` surface on the slightly off-white `#F7F8F6` background.
- Scrollable FlatLists with thin dividers or subtle card boundaries.

**Navigation:**
- **Bottom Navigation:** Primary paradigm for both roles. Icons with tiny text labels. Active state highlighted in Primary color.
- **Header:** Simple top headers with screen titles and native back buttons where appropriate.

**Upload Component:**
- Native image picker integration (Expo ImagePicker).
- Shows a placeholder icon, replaces with a thumbnail preview once selected.

**Status Indicators (Badges):**
- Small pill shape with text and a tiny dot.
- Submitted/Pending: Gray/Info
- In Progress: Warning (`#B7791F`)
- Resolved: Success (`#2E7D5B`)

## 9. Core Mobile Screens

**1. Splash Screen**
- **Purpose:** App loading entry.
- **Elements:** Centered QuickFix Logo, "QuickFix", "Smart Campus Issue Management".

**2. Registration**
- **Elements:** Scrollable form (Name, Email, Phone, College), Native Image Picker area (Identity Card), sticky "Continue" button at bottom.

**3. Email OTP Verification**
- **Elements:** Instructions, numeric keypad triggered, 6-digit OTP input boxes, "Verify" button.

**4. Login**
- **Elements:** Email input, "Send OTP" button, Register link.

**5. User Dashboard (Tab)**
- **Elements:** Greeting, Summary stats blocks, prominent "+ Report Issue" button, vertical list of "Recent Issues".

**6. Report Issue (Stack Screen)**
- **Elements:** Category native picker/bottom sheet, Location input, Description textarea, Native Photo upload button, "Submit Issue".

**7. My Issues (Tab)**
- **Elements:** Segmented control/tabs (All, Active, Resolved), FlatList of issue items.

**8. Issue Details (Stack Screen)**
- **Elements:** Issue Title, Category, Location, Photo thumbnail (expandable), Vertical Timeline of status.

**9. Notifications (Tab)**
- **Elements:** FlatList of alerts with timestamps.

**10. Profile (Tab)**
- **Elements:** User details, Verification status badge, "Logout" button.

**11. Management Dashboard (Tab)**
- **Elements:** Overview stats, Priority Issues list, Recent Reports summary.

**12. All Issues (Tab)**
- **Elements:** Search bar, List of all issues.

**13. Manage Issue (Stack Screen)**
- **Elements:** Issue details, Reporter info, Priority picker, Status picker, Remarks textarea, "Add Update" button.

## 10. Mobile States
- **Empty States:** Simple centered icon, brief text ("No issues reported yet").
- **Loading States:** React Native `ActivityIndicator` centered on screen or over buttons.
- **Error States:** Native alerts or in-app toast messages in red (`#C94A4A`).
- **Modal/Bottom Sheet:** Use bottom sheets for pickers (e.g., selecting issue category or priority) instead of full-page transitions where appropriate.
