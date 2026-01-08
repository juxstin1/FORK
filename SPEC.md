# RORK - AI App Development Assistant

## Vision

RORK is an AI-powered full-stack assistant that takes your app idea and ships it. Not an IDE you code in - an intelligent partner that handles the entire journey from concept to App Store.

```
IDEA → DESIGN → BUILD → TEST → DEBUG → SHIP
  ↑                                      |
  └──────── Iterate & Improve ───────────┘
```

**Core Philosophy:**
- **User-first**: Every decision optimized for end-user experience
- **No waiting**: Parallel workflows, no bottlenecks
- **Complete handoff**: Everything needed to ship, nothing left unclear
- **Simulated reality**: Test with AI users before real users find problems

---

## The RORK Flow

### Stage 1: IDEA → Requirements

```
User: "I want an app for tracking my workouts"
                    ↓
┌─────────────────────────────────────────────────────────┐
│  RORK IDEA PROCESSOR                                    │
│                                                         │
│  • What problem does this solve?                        │
│  • Who is the target user? (personas)                   │
│  • What are the core features? (MVP scope)              │
│  • What makes this different? (competitive analysis)    │
│  • What's the monetization? (if any)                    │
│  • What platforms? (iOS, Android, both)                 │
└─────────────────────────────────────────────────────────┘
                    ↓
        Structured Requirements Document
```

**Output: `requirements.md`**
- User personas with goals, frustrations, tech comfort
- Feature list prioritized (Must Have / Should Have / Nice to Have)
- User stories in standard format
- Success metrics defined
- Technical constraints identified

---

### Stage 2: DESIGN → UX/UI

```
        Requirements Document
                    ↓
┌─────────────────────────────────────────────────────────┐
│  RORK UX ENGINE                                         │
│                                                         │
│  1. Information Architecture                            │
│     └── Screen map, navigation flow, data relationships │
│                                                         │
│  2. User Flow Diagrams                                  │
│     └── Every path a user can take, edge cases          │
│                                                         │
│  3. Wireframes                                          │
│     └── Low-fidelity layouts for each screen            │
│                                                         │
│  4. UI Design                                           │
│     └── High-fidelity mockups, design system            │
│                                                         │
│  5. Interaction Specs                                   │
│     └── Animations, gestures, transitions               │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  SIMULATED USER TESTING (Pre-Build)                     │
│                                                         │
│  AI personas attempt to complete tasks using wireframes │
│                                                         │
│  "Sarah (35, busy mom) tries to log a quick workout     │
│   while her kid is in the car..."                       │
│                                                         │
│  → Identifies: Confusing navigation, too many taps,     │
│    missing quick-add feature, unclear icons             │
│                                                         │
│  → Recommendations: Add floating action button,         │
│    reduce onboarding to 2 screens, add haptic feedback  │
└─────────────────────────────────────────────────────────┘
                    ↓
           Refined Design + UX Report
```

**Output:**
- `design-system.md` - Colors, typography, spacing, components
- `screens/` - All screen designs with annotations
- `user-flows/` - Interactive flow diagrams
- `ux-report.md` - Simulated testing results + fixes applied

---

### Stage 3: BUILD → Production Code

```
           Approved Designs
                    ↓
┌─────────────────────────────────────────────────────────┐
│  RORK BUILD ENGINE                                      │
│                                                         │
│  PARALLEL EXECUTION:                                    │
│                                                         │
│  [Thread 1: Frontend]                                   │
│   • Expo/React Native scaffold                          │
│   • Navigation structure                                │
│   • Screen components from designs                      │
│   • Animations & interactions                           │
│   • Offline-first data layer                            │
│                                                         │
│  [Thread 2: Backend] (if needed)                        │
│   • API design (REST/GraphQL)                           │
│   • Database schema                                     │
│   • Authentication system                               │
│   • Business logic                                      │
│   • Cloud functions                                     │
│                                                         │
│  [Thread 3: Integration]                                │
│   • API client generation                               │
│   • State management                                    │
│   • Push notifications                                  │
│   • Analytics integration                               │
│   • Error tracking (Sentry)                             │
└─────────────────────────────────────────────────────────┘
                    ↓
              Working Application
```

**Output:**
- Complete, production-ready codebase
- Documentation for every module
- Environment configs (dev, staging, prod)
- CI/CD pipeline configuration

---

### Stage 4: TEST → Quality Assurance

```
              Working Application
                    ↓
┌─────────────────────────────────────────────────────────┐
│  RORK TEST ENGINE                                       │
│                                                         │
│  AUTOMATED TESTING:                                     │
│  ├── Unit tests (business logic)                        │
│  ├── Integration tests (API + database)                 │
│  ├── E2E tests (Detox/Maestro)                          │
│  └── Visual regression tests                            │
│                                                         │
│  SIMULATED USER TESTING:                                │
│  ┌─────────────────────────────────────────────────┐    │
│  │ AI Persona: "Mike, 28, gym enthusiast"          │    │
│  │                                                 │    │
│  │ Task: Create account and log first workout      │    │
│  │                                                 │    │
│  │ Actions:                                        │    │
│  │ 1. ✓ Opens app (2.1s load time - acceptable)   │    │
│  │ 2. ✓ Taps "Get Started"                        │    │
│  │ 3. ✗ Confused by "Continue with Apple" button  │    │
│  │      → Expected email option first             │    │
│  │ 4. ✓ Signs up with email                       │    │
│  │ 5. ✗ Onboarding too long (5 screens)           │    │
│  │      → Dropped off at screen 4                 │    │
│  │ 6. ...                                         │    │
│  │                                                 │    │
│  │ Friction Score: 6.2/10                         │    │
│  │ Completion Rate: 73%                           │    │
│  │ Time to Value: 4m 32s (target: < 2m)           │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  PERFORMANCE TESTING:                                   │
│  ├── App launch time                                    │
│  ├── Screen transition smoothness (60fps check)         │
│  ├── Memory usage patterns                              │
│  ├── Battery impact                                     │
│  └── Network efficiency                                 │
│                                                         │
│  ACCESSIBILITY TESTING:                                 │
│  ├── VoiceOver/TalkBack compatibility                   │
│  ├── Color contrast ratios                              │
│  ├── Touch target sizes                                 │
│  └── Dynamic type support                               │
└─────────────────────────────────────────────────────────┘
                    ↓
        Test Report + Auto-Generated Fixes
```

**Output:**
- `test-report.md` - Full test results
- `ux-friction-report.md` - Simulated user findings
- `performance-report.md` - Benchmarks
- `accessibility-report.md` - A11y audit
- **Automatic fixes applied** for issues found

---

### Stage 5: DEBUG → Issue Resolution

```
              Test Results
                    ↓
┌─────────────────────────────────────────────────────────┐
│  RORK DEBUG ENGINE                                      │
│                                                         │
│  Issue Classification:                                  │
│  ├── P0 (Blocker): Crash on workout save                │
│  ├── P1 (Critical): Auth token not refreshing           │
│  ├── P2 (Major): Calendar view misaligned on SE         │
│  └── P3 (Minor): Haptic missing on button press         │
│                                                         │
│  For each issue:                                        │
│  1. Root cause analysis                                 │
│  2. Impact assessment                                   │
│  3. Fix implementation                                  │
│  4. Regression test                                     │
│  5. Verification                                        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ DEBUG LOG: P0-001                               │    │
│  │                                                 │    │
│  │ Issue: App crashes when saving workout          │    │
│  │                                                 │    │
│  │ Root Cause: Attempting to write to Realm DB     │    │
│  │ on main thread with large exercise array        │    │
│  │                                                 │    │
│  │ Fix: Move write operation to background queue,  │    │
│  │ add chunked writes for arrays > 50 items        │    │
│  │                                                 │    │
│  │ Files Changed:                                  │    │
│  │ - src/services/WorkoutService.ts (lines 45-67) │    │
│  │ - src/hooks/useWorkout.ts (line 23)            │    │
│  │                                                 │    │
│  │ Status: FIXED ✓                                │    │
│  │ Regression Test: PASSED ✓                      │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                    ↓
              Ship-Ready Application
```

---

### Stage 6: SHIP → Store Submission

```
              Ship-Ready Application
                    ↓
┌─────────────────────────────────────────────────────────┐
│  RORK SHIP ENGINE                                       │
│                                                         │
│  BUILD GENERATION:                                      │
│  ├── iOS Production Build (.ipa)                        │
│  ├── Android Production Build (.aab)                    │
│  └── Build verification & signing                       │
│                                                         │
│  APP STORE ASSETS (Auto-Generated):                     │
│  ├── App Icon (all sizes)                               │
│  ├── Screenshots (all device sizes)                     │
│  ├── App Preview Video                                  │
│  ├── Feature Graphic (Android)                          │
│  └── Promotional images                                 │
│                                                         │
│  STORE LISTING CONTENT:                                 │
│  ├── App Name (with keyword research)                   │
│  ├── Subtitle                                           │
│  ├── Description (short + long)                         │
│  ├── Keywords                                           │
│  ├── Category recommendation                            │
│  ├── Age rating questionnaire answers                   │
│  ├── Privacy policy (generated)                         │
│  └── Support URL setup                                  │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  SUBMISSION PACKAGE                                     │
│                                                         │
│  📦 ship-package/                                       │
│  ├── builds/                                            │
│  │   ├── ios/                                           │
│  │   │   ├── FitTrack.ipa                               │
│  │   │   └── signing-certificate-info.txt               │
│  │   └── android/                                       │
│  │       ├── FitTrack.aab                               │
│  │       └── keystore-info.txt                          │
│  │                                                      │
│  ├── store-assets/                                      │
│  │   ├── ios/                                           │
│  │   │   ├── icon-1024.png                              │
│  │   │   ├── screenshots/                               │
│  │   │   │   ├── iphone-6.7/                            │
│  │   │   │   ├── iphone-6.5/                            │
│  │   │   │   ├── iphone-5.5/                            │
│  │   │   │   └── ipad-12.9/                             │
│  │   │   └── preview-video.mp4                          │
│  │   └── android/                                       │
│  │       ├── icon-512.png                               │
│  │       ├── feature-graphic.png                        │
│  │       └── screenshots/                               │
│  │                                                      │
│  ├── store-listing/                                     │
│  │   ├── app-store-connect.md                           │
│  │   ├── google-play-console.md                         │
│  │   ├── description-en.txt                             │
│  │   ├── keywords.txt                                   │
│  │   └── release-notes-v1.0.txt                         │
│  │                                                      │
│  ├── legal/                                             │
│  │   ├── privacy-policy.html                            │
│  │   ├── terms-of-service.html                          │
│  │   └── gdpr-compliance.md                             │
│  │                                                      │
│  └── SUBMISSION-GUIDE.md                                │
│      └── Step-by-step with screenshots                  │
└─────────────────────────────────────────────────────────┘
```

**SUBMISSION-GUIDE.md includes:**
```markdown
# App Store Submission Guide for FitTrack

## Apple App Store Connect

### Step 1: Create App Record
1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+"  → "New App"
3. Enter the following:
   - Platform: iOS
   - Name: FitTrack - Workout Logger
   - Primary Language: English (U.S.)
   - Bundle ID: com.yourname.fittrack
   - SKU: fittrack-001

### Step 2: Upload Build
1. Open Transporter app on your Mac
2. Drag `builds/ios/FitTrack.ipa` into Transporter
3. Click "Deliver"
4. Wait for processing (10-30 minutes)

### Step 3: App Information
Copy these values into App Store Connect:

**Subtitle:**
Log workouts in seconds

**Description:**
[Full description provided in store-listing/description-en.txt]

**Keywords:**
workout, fitness, gym, exercise, tracker, log, strength, training

**Support URL:**
https://fittrack.app/support

**Marketing URL:**
https://fittrack.app

### Step 4: Pricing
- Select: Free (or your chosen price tier)
- Availability: All territories (or select specific)

### Step 5: Screenshots
Upload from `store-assets/ios/screenshots/`:
- 6.7" Display: Use files from iphone-6.7/
- 6.5" Display: Use files from iphone-6.5/
[...]

### Step 6: Age Rating
Answer the questionnaire with these values:
- Cartoon or Fantasy Violence: None
- Realistic Violence: None
- [... all answers provided]

### Step 7: Review Information
- First Name: [Your name]
- Last Name: [Your name]
- Phone: [Your phone]
- Email: [Your email]
- Demo Account: Not required (no login needed)

### Step 8: Submit
1. Click "Add for Review"
2. Answer export compliance: NO (no encryption)
3. Answer advertising: [YES/NO based on your app]
4. Submit!

Expected review time: 24-48 hours

---

## Common Rejection Reasons (Pre-Addressed)

✓ Privacy policy included and linked
✓ All permissions have usage descriptions
✓ No placeholder content
✓ App completes its core function
✓ No crashes in submission build
✓ Screenshots match actual app
```

---

## Simulated User Testing System

### How It Works

```
┌─────────────────────────────────────────────────────────┐
│  USER SIMULATION ENGINE                                 │
│                                                         │
│  Input: App screens + interaction definitions           │
│                                                         │
│  Persona Generation:                                    │
│  Based on target demographics, generate diverse users:  │
│                                                         │
│  ┌─────────────────┐ ┌─────────────────┐               │
│  │ SARAH           │ │ MARCUS          │               │
│  │ 35, Working Mom │ │ 22, College     │               │
│  │ Tech: Medium    │ │ Tech: High      │               │
│  │ Patience: Low   │ │ Patience: Med   │               │
│  │ Goals: Quick    │ │ Goals: Track    │               │
│  │ workouts during │ │ progressive     │               │
│  │ lunch break     │ │ overload        │               │
│  └─────────────────┘ └─────────────────┘               │
│                                                         │
│  ┌─────────────────┐ ┌─────────────────┐               │
│  │ JAMES           │ │ ELENA           │               │
│  │ 58, Retiree     │ │ 29, Fitness     │               │
│  │ Tech: Low       │ │ Instructor      │               │
│  │ Patience: High  │ │ Tech: High      │               │
│  │ Goals: Stay     │ │ Goals: Track    │               │
│  │ active, simple  │ │ client workouts │               │
│  │ tracking        │ │ efficiently     │               │
│  └─────────────────┘ └─────────────────┘               │
│                                                         │
│  Task Execution:                                        │
│  Each persona attempts defined tasks, considering:      │
│  • Their tech comfort level                             │
│  • Their patience threshold                             │
│  • Their specific goals                                 │
│  • Common mistakes for their demographic                │
│  • Accessibility needs                                  │
│                                                         │
│  Output:                                                │
│  • Friction points identified                           │
│  • Drop-off predictions                                 │
│  • Confusion hotspots                                   │
│  • Feature discovery issues                             │
│  • Recommended improvements                             │
└─────────────────────────────────────────────────────────┘
```

### Simulation Report Example

```markdown
# UX Simulation Report - FitTrack v1.0

## Executive Summary
- Overall UX Score: 7.2/10
- Predicted Day-1 Retention: 62%
- Time to First Value: 3m 42s (Target: < 2m)
- Critical Issues Found: 3
- Recommendations: 12

## Persona Results

### Sarah (Working Mom, Medium Tech)
**Task: Log a quick lunch workout**

| Step | Action | Result | Time | Notes |
|------|--------|--------|------|-------|
| 1 | Open app | ✓ | 1.8s | Good load time |
| 2 | Find quick add | ✗ | 23s | Looked in wrong place first |
| 3 | Select workout type | ✓ | 4s | |
| 4 | Add exercises | ~ | 45s | Wanted templates, had to add manually |
| 5 | Save | ✓ | 2s | |

**Friction Score: 6.5/10**
**Key Issues:**
- Quick add button not prominent enough
- No workout templates for common routines
- Required fields not obvious

**Recommendations:**
1. Add FAB (floating action button) for quick add
2. Create "Quick Workouts" section with templates
3. Highlight required fields with asterisk

### James (Retiree, Low Tech)
**Task: Create account and log first workout**

| Step | Action | Result | Time | Notes |
|------|--------|--------|------|-------|
| 1 | Open app | ✓ | 1.8s | |
| 2 | Read onboarding | ✓ | 34s | Read carefully, good |
| 3 | Sign up | ✗ | 67s | Confused by social login buttons |
| 4 | Enter details | ~ | 89s | Font too small for age input |
| 5 | Complete onboarding | ✗ | -- | Gave up at step 4/5 |

**Friction Score: 4.2/10**
**Key Issues:**
- Social login buttons confusing for non-tech users
- Font sizes too small
- Too many onboarding steps

**Recommendations:**
1. Make "Sign up with Email" the primary button
2. Increase minimum font size to 16px
3. Reduce onboarding to 3 steps max
4. Add "Skip" option for onboarding

## Critical Issues (P0)

### 1. Onboarding Drop-off
- **Impact:** 34% of simulated users didn't complete onboarding
- **Cause:** Too many steps (5), unclear progress indicator
- **Fix:** Reduce to 3 steps, add progress bar, allow skip

### 2. Core Action Hidden
- **Impact:** Quick workout logging takes 3 taps instead of 1
- **Cause:** Primary action buried in menu
- **Fix:** Add prominent FAB on home screen

### 3. Accessibility Failure
- **Impact:** 15% of users (low vision, motor issues)
- **Cause:** Touch targets 38px (should be 44px), low contrast
- **Fix:** Increase touch targets, improve contrast ratios

## Recommended Changes (Priority Order)

1. **[P0]** Reduce onboarding to 3 screens
2. **[P0]** Add floating action button for quick add
3. **[P0]** Fix touch target sizes (44px minimum)
4. **[P1]** Add workout templates
5. **[P1]** Increase base font size
6. **[P1]** Make email signup primary CTA
7. **[P2]** Add progress indicators
8. **[P2]** Improve empty states
9. **[P2]** Add haptic feedback
10. **[P3]** Animate transitions
11. **[P3]** Add celebration on workout complete
12. **[P3]** Dark mode support
```

---

## Architecture

### System Components

```
┌────────────────────────────────────────────────────────────────┐
│                         RORK ASSISTANT                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   IDEATION   │  │    DESIGN    │  │    BUILD     │         │
│  │    MODULE    │──│    MODULE    │──│    MODULE    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                 │                 │                  │
│         ▼                 ▼                 ▼                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Requirements │  │  UX Patterns │  │   Code Gen   │         │
│  │   Engine     │  │   Library    │  │    Engine    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │     TEST     │  │    DEBUG     │  │     SHIP     │         │
│  │    MODULE    │──│    MODULE    │──│    MODULE    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                 │                 │                  │
│         ▼                 ▼                 ▼                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   User Sim   │  │  Auto-Fix    │  │  Store Prep  │         │
│  │    Engine    │  │   Engine     │  │    Engine    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                      EXPO / REACT NATIVE                       │
├────────────────────────────────────────────────────────────────┤
│                        EAS BUILD / OTA                         │
└────────────────────────────────────────────────────────────────┘
```

### Project Output Structure

Every RORK project produces:

```
my-app/
├── .rork/                          # RORK metadata
│   ├── project.json                # Project config
│   ├── requirements.md             # Original requirements
│   ├── design-decisions.md         # Why decisions were made
│   ├── simulation-results/         # All test results
│   └── debug-log.md                # Issue resolution history
│
├── src/                            # Application source
│   ├── app/                        # Expo Router screens
│   ├── components/                 # Reusable components
│   ├── hooks/                      # Custom hooks
│   ├── services/                   # API/business logic
│   ├── stores/                     # State management
│   ├── utils/                      # Utilities
│   └── types/                      # TypeScript types
│
├── assets/                         # Images, fonts, etc.
│
├── tests/                          # Test suites
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/                           # Documentation
│   ├── architecture.md
│   ├── api.md
│   └── deployment.md
│
├── ship-package/                   # Everything for store submission
│   ├── builds/
│   ├── store-assets/
│   ├── store-listing/
│   ├── legal/
│   └── SUBMISSION-GUIDE.md
│
├── app.json                        # Expo config
├── package.json
├── tsconfig.json
└── README.md
```

---

## Conversation Interface

### How Users Interact with RORK

```
┌─────────────────────────────────────────────────────────────────┐
│  RORK - App Development Assistant                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  You: I want to build an app for tracking my daily water intake │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  RORK: Great idea! Let me understand your vision better.        │
│                                                                 │
│  📋 QUICK QUESTIONS:                                            │
│                                                                 │
│  1. Who is this for?                                            │
│     □ Just me (personal use)                                    │
│     □ General public (App Store)                                │
│     □ Specific group (e.g., fitness enthusiasts)                │
│                                                                 │
│  2. Core features (pick your must-haves):                       │
│     □ Quick add buttons (250ml, 500ml, etc.)                    │
│     □ Daily goal setting                                        │
│     □ Reminders/notifications                                   │
│     □ History/statistics                                        │
│     □ Widget for home screen                                    │
│     □ Apple Health integration                                  │
│                                                                 │
│  3. Design vibe:                                                │
│     □ Minimal & clean                                           │
│     □ Colorful & playful                                        │
│     □ Dark & modern                                             │
│     □ Let RORK decide based on best practices                   │
│                                                                 │
│  [Continue →]                                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Progress View

```
┌─────────────────────────────────────────────────────────────────┐
│  RORK - Building: HydroTrack                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PROGRESS: ████████████░░░░░░░░ 60%                             │
│                                                                 │
│  ✓ IDEA        Requirements defined                             │
│  ✓ DESIGN      12 screens designed                              │
│  ✓ UX TEST     Simulated with 4 personas                        │
│  → BUILD       Generating code... (8/12 screens)                │
│  ○ TEST        Pending                                          │
│  ○ DEBUG       Pending                                          │
│  ○ SHIP        Pending                                          │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  LIVE LOG:                                                      │
│  [14:23:45] Creating HomeScreen component...                    │
│  [14:23:47] Implementing water intake quick-add...              │
│  [14:23:52] Connecting to local storage...                      │
│  [14:23:58] Building history chart component...                 │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  💡 While building, I noticed your app could benefit from:      │
│     • Haptic feedback on water add (improves satisfaction)      │
│     • Celebration animation on goal completion                  │
│     Add these? [Yes] [No] [Decide later]                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Ship Ready View

```
┌─────────────────────────────────────────────────────────────────┐
│  RORK - HydroTrack Ready to Ship! 🚀                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✓ All stages complete                                          │
│  ✓ 0 critical issues                                            │
│  ✓ UX Score: 8.4/10                                             │
│  ✓ Performance: 98/100                                          │
│  ✓ Accessibility: AA compliant                                  │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📦 YOUR SHIP PACKAGE IS READY                                  │
│                                                                 │
│  Contains:                                                      │
│  • iOS build (.ipa) - Signed & ready                            │
│  • Android build (.aab) - Signed & ready                        │
│  • All App Store screenshots (6 device sizes)                   │
│  • App preview video (15 seconds)                               │
│  • Store listing copy (optimized for ASO)                       │
│  • Privacy policy & Terms of Service                            │
│  • Step-by-step submission guide                                │
│                                                                 │
│  [Download Ship Package]  [Open Submission Guide]               │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📱 TEST ON YOUR DEVICE FIRST                                   │
│                                                                 │
│  Scan with Expo Go:        Or install TestFlight build:         │
│  ┌─────────────┐           [Send TestFlight Invite]             │
│  │ [QR CODE]   │                                                │
│  │             │                                                │
│  └─────────────┘                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technical Implementation

### Core Technologies

| Component | Technology | Reason |
|-----------|------------|--------|
| Framework | Expo SDK 52+ | Best RN tooling, EAS for builds |
| Navigation | Expo Router | File-based, web-compatible |
| Styling | NativeWind v4 | Tailwind for RN, fast iteration |
| State | Zustand | Simple, fast, no boilerplate |
| Local DB | Expo SQLite / MMKV | Offline-first |
| Backend | Supabase | Auth, DB, storage, realtime |
| Build | EAS Build | Cloud iOS/Android builds |
| OTA | EAS Update | Instant updates post-launch |

### AI Components

| Component | Purpose |
|-----------|---------|
| Requirements Extraction | Parse natural language into structured requirements |
| UX Pattern Matching | Match requirements to proven UX patterns |
| Code Generation | Generate production React Native code |
| User Simulation | AI personas that test the app |
| Auto-Debug | Identify and fix issues automatically |
| Store Copy | Generate ASO-optimized app store content |

---

## Quality Gates

Each stage must pass before proceeding:

### IDEA → DESIGN Gate
- [ ] All core features defined
- [ ] Target user identified
- [ ] Success metrics established
- [ ] Scope is achievable (MVP)

### DESIGN → BUILD Gate
- [ ] All screens designed
- [ ] User flows complete
- [ ] Simulated UX score ≥ 7/10
- [ ] No critical UX issues

### BUILD → TEST Gate
- [ ] All screens implemented
- [ ] Core features functional
- [ ] No TypeScript errors
- [ ] Builds successfully

### TEST → DEBUG Gate
- [ ] Unit test coverage ≥ 70%
- [ ] E2E tests pass
- [ ] Simulated testing complete
- [ ] Performance benchmarks met

### DEBUG → SHIP Gate
- [ ] Zero P0/P1 issues
- [ ] UX score ≥ 7.5/10
- [ ] Accessibility AA compliant
- [ ] All store assets ready

---

## Commands

```
/rork new                    Start a new app project
/rork status                 Show current project status
/rork simulate               Run user simulation tests
/rork build                  Generate production builds
/rork ship                   Prepare ship package
/rork iterate <feedback>     Apply user feedback and improve
/rork export                 Export complete project
```

---

## Example Session

```
User: /rork new

RORK: Welcome! Let's build your app. What's your idea?

User: A meditation app for beginners

RORK: Love it! Meditation apps are popular but there's room for
      differentiation. Let me ask a few questions...

[Questions about target audience, features, style]

User: [Answers questions]

RORK: Perfect! Here's what I understand:

      📱 MindEase - Meditation for Beginners

      Target: Adults 25-45 new to meditation
      Core Features:
      • Guided meditations (5-15 min)
      • Daily reminders
      • Streak tracking
      • Breathing exercises

      Design: Calm, minimal, soft colors

      Ready to proceed? [Yes, let's go] [Make changes]

User: Yes, let's go

RORK: Starting the RORK pipeline...

      [IDEA ✓] Requirements locked
      [DESIGN →] Designing screens...

      ━━━━━━━━━━ Progress ━━━━━━━━━━
      Home Screen.............. ✓
      Meditation Player........ ✓
      Browse Library........... ✓
      Settings................. ✓
      Onboarding (3 screens)... ✓
      Stats & Streaks.......... ✓

      Running UX simulation with 4 personas...

      ⚠️  Found 2 issues in simulation:

      1. "Start meditating" button not visible without scrolling
         → Fixed: Moved above fold

      2. Breathing exercise instructions unclear for James (58, low-tech)
         → Fixed: Added animated visual guide

      [DESIGN ✓] UX Score: 8.1/10
      [BUILD →] Generating code...

[Continues through all stages]

RORK: 🎉 MindEase is ready to ship!

      Final Stats:
      • 12 screens, 34 components
      • UX Score: 8.4/10
      • Performance: 97/100
      • 0 critical bugs

      Your ship package is ready. Want me to walk you through
      the App Store submission process?
```

---

## What Makes RORK Different

| Traditional Development | RORK |
|------------------------|------|
| Weeks to first prototype | Hours to working app |
| Hire designers separately | Design integrated |
| Manual QA testing | AI-simulated user testing |
| Debug by stack traces | Auto-diagnosis and fix |
| Figure out App Store yourself | Complete submission package |
| Hope users like it | Validated before launch |

---

## Success Metrics

For RORK itself:

| Metric | Target |
|--------|--------|
| Idea to First Build | < 2 hours |
| Idea to Ship-Ready | < 24 hours |
| App Store Approval Rate | > 95% |
| User Simulation Accuracy | > 80% match to real user feedback |
| Auto-Fix Success Rate | > 90% |
