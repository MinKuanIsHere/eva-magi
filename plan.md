# MAGI MVP Implementation Plan

## 1. Purpose

This document translates the MVP specification into an execution plan for engineers.

It defines:

- implementation phases
- delivery order
- TDD workflow expectations
- checkpoint outputs
- acceptance gates for each milestone

This plan is intended to be read together with `mvp_spec.md`.

## 2. Delivery Strategy

The MVP should be built in small, test-driven checkpoints. The sequence should prioritize:

1. core logic correctness
2. stable application structure
3. high-quality UI composition
4. interaction polish
5. responsive refinement

The team should avoid building visual complexity before the motion logic, state model, and test coverage are stable.

## 3. Development Principles

### 3.1 TDD Requirement

Development must follow TDD for core logic and important UI behavior.

Expected cycle:

1. write or update tests first
2. implement the minimum code to pass
3. refactor while keeping tests green

Minimum areas that must be developed test-first:

- motion classification
- vote simulation
- final decision calculation
- input submission behavior
- processing-to-result state transition

### 3.2 Checkpoint Documentation

At the end of each checkpoint, create a progress summary under `docs/`.

Required naming pattern:

- `docs/summary_checkpoint_1.md`
- `docs/summary_checkpoint_2.md`
- `docs/summary_checkpoint_3.md`
- `docs/summary_checkpoint_4.md`
- `docs/summary_checkpoint_5.md`

Each summary should include:

- completed work
- test status
- unresolved issues
- decisions made
- next checkpoint scope

### 3.3 Definition of Done

A task is only done when:

- implementation is complete
- relevant tests exist and pass
- no blocking runtime errors remain
- the result matches the MVP specification

## 4. Recommended Stack

Implementation stack:

- `React`
- `TypeScript`
- `Vite`
- `Tailwind CSS`
- `Framer Motion`
- `Vitest`
- `React Testing Library`

Optional supporting tools:

- `clsx`
- `tailwind-merge`

## 5. Project Setup Plan

### 5.1 Initial Repository Setup

Deliverables:

- initialize Vite React TypeScript app
- install styling, animation, and testing dependencies
- create base folder structure from `mvp_spec.md`
- configure linting and test scripts
- create `docs/` directory for checkpoint summaries

Suggested structure:

```text
src/
  app/
  components/
  lib/
  styles/
  assets/
docs/
```

### 5.2 Base Tooling Tasks

- configure Tailwind and global styles
- configure Vitest
- configure React Testing Library
- verify `npm run test` and `npm run build`

## 6. Implementation Phases

### Phase 1: Core Logic Foundation

Goal:

Build the logic layer independent of UI styling.

Tasks:

- define TypeScript types for motion, vote, node result, and final result
- implement `classifyMotion`
- implement `simulateVotes`
- implement final decision resolution
- define constants for node metadata and probability profiles

TDD tasks:

- test self-destruct keyword detection
- test non-self-destruct classification
- test deterministic self-destruct voting result
- test unanimous approval rule
- test rejection when any node dissents

Acceptance criteria:

- all core logic tests pass
- self-destruct flow is deterministic
- general motion flow returns valid output shape

Checkpoint output:

- `docs/summary_checkpoint_1.md`

### Phase 2: Application Shell and State Flow

Goal:

Create the working app shell and connect input to the logic engine.

Tasks:

- implement `App` container
- implement top-level UI state model
- implement motion input component
- wire input submission to classification and vote simulation
- implement processing delay flow
- implement ability to run repeated submissions

TDD tasks:

- test submit by button
- test submit by `Enter`
- test input disabled during processing
- test result appears after processing completes
- test a second submission replaces prior result correctly

Acceptance criteria:

- app supports end-to-end interaction without page refresh
- input, processing, and resolved states function reliably
- no styling polish is required yet beyond basic usability

Checkpoint output:

- `docs/summary_checkpoint_2.md`

### Phase 3: MAGI Interface Composition

Goal:

Build the main visual structure and readable node-based result presentation.

Tasks:

- implement `SystemHeader`
- implement `DecisionSummary`
- implement `NodePanel`
- implement decorative metadata blocks
- render motion label, node votes, and final resolution clearly
- apply visual hierarchy for idle, processing, and resolved states

TDD tasks:

- test three node panels render correctly
- test vote labels render correctly per node result
- test final decision summary reflects resolved state
- test self-destruct motion label is shown correctly

Acceptance criteria:

- the app visually communicates the MAGI flow
- core content is readable without needing explanation
- processing and final states are clearly distinct

Checkpoint output:

- `docs/summary_checkpoint_3.md`

### Phase 4: Product Polish and Audio

Goal:

Add dramatic but controlled interaction quality.

Tasks:

- add motion transitions for reveal states
- add scanline, grid, and hazard-stripe overlays
- add strong typography and color token system
- implement audio utility and local sound hooks
- play processing and final-result sounds after user interaction
- add reduced-motion handling

TDD tasks:

- test reduced-motion fallback behavior where practical
- test audio helpers fail safely without breaking UI
- test processing state exits cleanly even if audio playback fails

Acceptance criteria:

- visual design feels intentional and product-grade
- audio is additive, never blocking
- the app still works correctly if audio cannot play

Checkpoint output:

- `docs/summary_checkpoint_4.md`

### Phase 5: Responsive QA and Release Hardening

Goal:

Prepare the MVP for public demo or initial deployment.

Tasks:

- refine mobile layout
- refine spacing and typography across breakpoints
- verify focus states and keyboard use
- verify contrast and usability
- clean dead code and stabilize naming
- run final regression testing
- prepare deployment config

Manual QA checklist:

- desktop Chrome
- desktop Safari or Firefox
- mobile portrait viewport
- empty input handling
- self-destruct keyword variants
- repeated submissions
- audio blocked by browser

Acceptance criteria:

- app builds successfully
- layout remains usable on mobile and desktop
- no known critical bugs remain
- MVP acceptance criteria from `mvp_spec.md` are met

Checkpoint output:

- `docs/summary_checkpoint_5.md`

## 7. Implementation Order by File Area

Recommended file creation order:

1. `src/lib/constants.ts`
2. `src/lib/classifyMotion.ts`
3. `src/lib/simulateVotes.ts`
4. tests for lib modules
5. `src/app/App.tsx`
6. `src/components/MotionInput.tsx`
7. app interaction tests
8. `src/components/NodePanel.tsx`
9. `src/components/DecisionSummary.tsx`
10. `src/components/SystemHeader.tsx`
11. `src/components/DecorativeOverlay.tsx`
12. `src/lib/audio.ts`
13. styling and animation refinement

## 8. Risks and Mitigations

### Risk 1: Visual complexity slows core implementation

Mitigation:

- finish logic and app flow before aesthetic polish

### Risk 2: Audio behavior is inconsistent across browsers

Mitigation:

- treat audio as enhancement only
- guard playback failures safely

### Risk 3: Mobile layout becomes visually crowded

Mitigation:

- prioritize content hierarchy over strict visual fidelity
- allow stacking and spacing adjustments on narrow screens

### Risk 4: Stylized UI reduces readability

Mitigation:

- test contrast and text scale early
- reserve extreme styling for non-critical decorative areas

## 9. MVP Exit Criteria

The MVP is complete when:

- the full input-to-decision loop works smoothly
- self-destruct behavior matches the specification exactly
- the interface feels visually distinct and product-ready
- responsive behavior is acceptable on mobile and desktop
- test coverage exists for core logic and critical interactions
- all checkpoint summaries are present under `docs/`

## 10. Immediate Next Step

Start with repository setup and Phase 1 logic tests.

The first coding checkpoint should establish a stable logic layer before any serious UI styling begins.
