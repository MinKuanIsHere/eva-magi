# MAGI Decision System MVP Specification

## 1. Document Purpose

This document defines the implementation-ready MVP scope for the MAGI Decision System, a web product inspired by the MAGI console from *Neon Genesis Evangelion*.

The goal of this specification is to give engineers and designers a shared blueprint for building a functional, polished, and user-friendly MVP with clear product goals, technical decisions, and acceptance criteria.

## 2. Product Summary

MAGI Decision System is an interactive decision-simulation web application. A user submits a natural-language motion, the system classifies the motion, simulates deliberation across three persona-based MAGI nodes, and displays the result in a high-impact NERV-inspired interface.

The MVP is not a real AI governance engine. It is a productized simulation focused on:

- strong visual identity
- satisfying interaction flow
- deterministic narrative logic for critical motions
- responsive UI for desktop and mobile

## 3. Product Goals

### 3.1 Primary Goals

- Deliver a visually distinctive web experience that clearly evokes the MAGI/NERV control console.
- Allow users to enter motions in natural language and receive a simulated MAGI decision.
- Recreate the iconic three-node deliberation flow with clear persona differences.
- Provide a smooth, product-quality UI/UX rather than a prototype or raw demo.
- Support mobile and desktop usage without losing readability or interaction quality.

### 3.2 MVP Success Criteria

- A new user can understand how to use the product within 5 seconds.
- The full submit-to-result flow completes within 3 seconds including intentional animation delay.
- The interface remains legible and usable on both mobile and desktop.
- The `Self-Destruct` flow consistently produces the expected dramatic result:
  - `MELCHIOR-1`: approve
  - `BALTHASAR-2`: approve
  - `CASPER-3`: dissent
  - final result: rejected due to non-unanimous vote

## 4. Non-Goals for MVP

- No real LLM integration.
- No user authentication.
- No persistent history, account system, or cloud save.
- No multi-user collaboration.
- No multilingual localization system beyond static UI copy and accepted query keywords.
- No backend-dependent infrastructure unless needed for deployment or future extension.

## 5. Target Users

### 5.1 Primary User

A general web user who wants to experience a stylish MAGI-inspired decision interface.

### 5.2 Secondary User

A fan or creative user who wants to input dramatic motions and observe the system's response.

## 6. MVP User Experience

### 6.1 Core User Story

As a user, I can type a motion into the MAGI console, submit it, watch the system process the request, and see a final decision with individual node votes in a dramatic and readable interface.

### 6.2 Expected Interaction Flow

1. User opens the app and immediately sees a live MAGI console UI.
2. User enters a motion such as `Initiate self-destruct sequence`.
3. User submits with `Enter` or a visible action button.
4. The UI transitions into a processing state with motion labeling, system status, and animated feedback.
5. The three nodes reveal their votes.
6. The final decision is shown with strong visual emphasis.
7. The user can submit a new motion without refreshing the page.

## 7. Functional Scope

### 7.1 Motion Input

The system must provide:

- a single prominent text input
- keyboard submit via `Enter`
- a visible submit button
- disabled input/button state while processing
- placeholder copy that teaches the expected input format

### 7.2 Motion Classification

For MVP, motion detection will use client-side rule matching.

The system must:

- normalize input to lowercase
- detect `self-destruct` intent using keyword matching
- support at minimum these trigger variants:
  - `self-destruct`
  - `self destruct`
  - `自爆`
  - `自律自爆`
- classify all other inputs as `general motion`

### 7.3 Voting Simulation

The system must simulate three nodes:

- `MELCHIOR-1`
  - persona: Scientist
  - bias: logical / procedural
- `BALTHASAR-2`
  - persona: Mother
  - bias: ethical / protective
- `CASPER-3`
  - persona: Woman
  - bias: intuitive / emotional / self-protective

#### Self-Destruct Rules

For any self-destruct motion:

- `MELCHIOR-1` returns `APPROVE`
- `BALTHASAR-2` returns `APPROVE`
- `CASPER-3` returns `DISSENT`
- final result is `REJECTED`

This behavior is deterministic in the MVP and should not be randomized.

#### General Motion Rules

For non-self-destruct motions:

- votes may be generated using weighted random logic
- each node should have a distinct probability profile
- final result should be calculated from the 3 votes

Suggested default probabilities:

- `MELCHIOR-1`: 85% approve
- `BALTHASAR-2`: 70% approve
- `CASPER-3`: 60% approve

### 7.4 Decision Rule

The final motion result follows unanimous approval logic.

- If all three nodes approve, final result is `APPROVED`.
- In every other case, final result is `REJECTED`.

MVP should not implement partial outcomes such as `split vote` as the primary result label. That logic may still exist internally, but the final user-facing outcome should remain simple and strong.

### 7.5 Result Presentation

The result screen must display:

- current motion label
- processing or final system status
- three node panels
- each node's final vote
- one prominent overall decision state
- decorative system metadata to enrich the fiction

### 7.6 Audio Feedback

Audio is in scope for MVP if implemented with browser-safe interaction rules.

The system should support:

- startup or interface activation sound after first user interaction
- looping processing sound during deliberation
- final decision sound based on result type

If browser autoplay policies interfere, the app must still function correctly without audio.

## 8. UX and Interface Requirements

### 8.1 UX Principles

- Immediate clarity: users should instantly know where to type and what to do.
- Dramatic feedback: processing and result states should feel ceremonial, not flat.
- Readability first: styling must not compromise legibility.
- Mobile resilience: visual identity should survive smaller screens.
- Low friction: one input, one submit action, one clear outcome.

### 8.2 Layout Structure

The page should contain:

- top status bar
- central MAGI identity block
- three node vote panels
- motion input area
- decorative technical metadata
- optional background overlays such as scanlines, grid, or hazard stripes

### 8.3 Responsive Behavior

Desktop:

- three vote panels displayed in one row
- metadata can occupy peripheral space

Mobile:

- vote panels stack vertically
- input stays fixed in a clear reachable position
- typography and spacing scale down without collapsing visual hierarchy

### 8.4 Accessibility Baseline

The product is highly stylized, but minimum accessibility standards still apply:

- sufficient color contrast for critical text
- visible focus states on interactive elements
- semantic button and input elements
- support for keyboard-only submission
- reduced-motion fallback for users with motion sensitivity

## 9. Visual Design Direction

### 9.1 Design Intent

The UI should feel like a theatrical control system, not a generic dashboard. It should preserve the MAGI tone while remaining clean enough for mainstream users to understand.

### 9.2 Visual Characteristics

- dark industrial background
- orange-red system text and alert surfaces
- controlled use of red for warning and rejection
- green or cyan reserved for approval and active system states
- geometric panel framing
- scanline, grid, and hazard-stripe motifs used sparingly and intentionally

### 9.3 Typography

Use a condensed or technical-looking display font for headings and system labels, paired with a highly readable sans-serif for body and input text.

The font choice must prioritize:

- sci-fi personality
- strong uppercase labels
- clean rendering on web and mobile

## 10. Recommended Technical Architecture

### 10.1 Stack Decision

The MVP should be built as a frontend-first web application with no required backend.

Recommended stack:

- `React`
- `TypeScript`
- `Vite`
- `Tailwind CSS`
- `Framer Motion` for controlled UI transitions

Why this stack:

- fast to implement and iterate
- excellent for interactive UI-heavy products
- strong component model for node panels and system states
- easy deployment to static hosting
- avoids unnecessary backend complexity for an MVP whose logic is local and deterministic

### 10.2 Why Not Flask for MVP

A Python/Flask stack is technically viable, but it introduces more overhead for this specific MVP because:

- the main value is in frontend interaction and visual execution
- the logic is lightweight and does not require server computation
- richer UI iteration is faster in a modern frontend workflow

Flask or another backend can be added later if the product evolves into:

- real AI-powered analysis
- persistent session history
- analytics
- content management

### 10.3 High-Level Architecture

Frontend-only architecture:

`User Input -> Motion Classifier -> Vote Simulation Engine -> UI State Renderer -> Audio/Animation Feedback`

Suggested module breakdown:

- `App`
  - top-level layout and state orchestration
- `components/SystemHeader`
  - status bar and metadata
- `components/MotionInput`
  - text field, submit button, input validation
- `components/NodePanel`
  - individual node identity and vote display
- `components/DecisionSummary`
  - final resolution block
- `components/DecorativeOverlay`
  - scanlines, stripes, background texture
- `lib/classifyMotion`
  - motion keyword matching
- `lib/simulateVotes`
  - deterministic and weighted vote logic
- `lib/audio`
  - sound loading and playback wrappers

## 11. State Model

Recommended UI states:

- `idle`
  - no active result
- `input-ready`
  - user can submit
- `processing`
  - animation and simulated deliberation running
- `resolved`
  - votes and final result displayed
- `error`
  - optional fallback state if audio or internal logic fails

Suggested core state shape:

```ts
type MotionType = "self_destruct" | "general";
type Vote = "APPROVE" | "DISSENT";
type FinalDecision = "APPROVED" | "REJECTED";
type UiPhase = "idle" | "processing" | "resolved";

interface NodeResult {
  id: "MELCHIOR-1" | "BALTHASAR-2" | "CASPER-3";
  persona: "Scientist" | "Mother" | "Woman";
  vote: Vote;
}

interface DeliberationResult {
  input: string;
  motionType: MotionType;
  motionLabel: string;
  nodes: NodeResult[];
  finalDecision: FinalDecision;
}
```

## 12. Implementation Details

### 12.1 Motion Classification Logic

Use a pure utility function.

```ts
export function classifyMotion(input: string): MotionType {
  const normalized = input.trim().toLowerCase();
  const selfDestructKeywords = [
    "self-destruct",
    "self destruct",
    "自爆",
    "自律自爆",
  ];

  return selfDestructKeywords.some((keyword) => normalized.includes(keyword))
    ? "self_destruct"
    : "general";
}
```

### 12.2 Vote Simulation Logic

Use deterministic logic for `self_destruct` and weighted random logic for `general`.

The simulation delay should be intentional and UI-driven, not computationally necessary.

Recommended delay:

- minimum 1200ms
- target 1800ms to 2500ms

### 12.3 Audio Implementation

Recommended implementation:

- preload local audio assets after first user interaction
- use `HTMLAudioElement` for simplicity
- optionally switch to Web Audio API later if mixing or synthesis is needed

Required behavior:

- no blocking if audio fails
- all audio playback wrapped in safe `try/catch`
- processing loop stops when result resolves

## 13. Suggested Project Structure

```text
src/
  app/
    App.tsx
    main.tsx
  components/
    DecisionSummary.tsx
    MotionInput.tsx
    NodePanel.tsx
    SystemHeader.tsx
    DecorativeOverlay.tsx
  lib/
    classifyMotion.ts
    simulateVotes.ts
    audio.ts
    constants.ts
  styles/
    globals.css
  assets/
    sounds/
    textures/
```

## 14. MVP Acceptance Criteria

### 14.1 Functional Acceptance

- User can submit a motion via input and button.
- User can submit a motion by pressing `Enter`.
- Self-destruct keywords trigger the self-destruct flow.
- Self-destruct flow always produces:
  - Melchior approve
  - Balthasar approve
  - Casper dissent
  - final rejected result
- General motions produce a valid 3-node result.
- Final decision is rendered clearly after processing completes.
- User can run multiple motions in one session.

### 14.2 UX Acceptance

- Input area is obvious without explanation.
- Processing state is visually distinct from idle and resolved states.
- Final result is readable within one screen on mobile.
- Interface feels intentional and premium, not like a default admin panel.

### 14.3 Technical Acceptance

- App builds successfully in production mode.
- No backend is required to run MVP locally or in deployment.
- No critical runtime errors during repeated submissions.
- Layout is stable in modern Chrome, Safari, Firefox, and Edge.

## 15. Testing Requirements

### 15.1 Manual Test Cases

- Submit empty input.
- Submit normal input.
- Submit `self-destruct`.
- Submit `self destruct`.
- Submit Chinese self-destruct keywords.
- Submit multiple motions back-to-back.
- Submit on mobile viewport.
- Submit with audio blocked by browser.

### 15.2 Automated Test Recommendations

- unit tests for motion classification
- unit tests for vote simulation logic
- component tests for input and result rendering

Recommended tools:

- `Vitest`
- `React Testing Library`

## 16. Deployment Recommendation

Recommended MVP deployment:

- `Vercel` or `Netlify`

Reason:

- simple static deployment
- fast preview workflow
- low operational overhead

## 17. Future Extensions After MVP

- replace rule-based parsing with real LLM classification
- store motion history
- add alternate MAGI scenarios and presets
- support bilingual UI copy
- add richer sound design and timed narration
- introduce backend analytics or content controls

## 18. Final Recommendation

The best implementation path for this MVP is a frontend-first React product with strong visual design, deterministic self-destruct logic, and a polished submit-to-result interaction loop.

This approach is the fastest path to a real, user-friendly, high-impact product that matches the project's actual value: interface quality, narrative decision flow, and MAGI-inspired presentation.
