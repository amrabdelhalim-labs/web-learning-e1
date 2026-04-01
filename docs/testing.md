# Testing Guide — علمني

## Current Stack

- Vitest `4.x`
- jsdom environment
- `@testing-library/react`
- Setup file: `app/tests/setupTests.ts`

## Current Test Inventory

المشروع يحتوي حالياً على **94 اختباراً** عبر **10 ملفات**:

- `app/tests/config.test.ts`
- `app/tests/types.test.ts`
- `app/tests/api.test.ts`
- `app/tests/apiErrors.test.ts`
- `app/tests/styles.test.ts`
- `app/tests/useAudioRecorder.test.ts`
- `app/tests/useThemeMode.test.tsx`
- `app/tests/useAppContext.test.tsx`
- `app/tests/dockerConfig.test.ts`
- `app/tests/lessonSidebarInteraction.test.tsx`
- `app/tests/markdownRendererDirectionality.test.tsx`
- `app/tests/useActionCycle.test.tsx`
- `app/tests/interactionStateModel.test.tsx`

## Key Regression Coverage

- Sidebar lesson expansion and submenu targeting:
  - only one expanded lesson
  - submenu navigation targets correct path
  - lower submenu items remain clickable
  - no click-through to underlying rows
- Multilingual markdown rendering:
  - Arabic-only and English-only paragraph direction
  - mixed Arabic/English prose with inline code
  - punctuation and symbol stability in mixed bidi lines (`؟ ? : / = @ , ؛`)
  - sentence-ending punctuation anchoring in headings/lists/paragraphs
  - table headers/cells direction by content
  - fenced code blocks remain LTR and readable
- Conditional action buttons:
  - lifecycle coverage for disable/enable transitions via reusable action-cycle state
  - translation flow: input stays visible after submit, then locks until new sentence reset
  - conversation flow: confirm and recording-start controls lock after review while playback remains available

## Commands

```bash
npm run test
npm run test:watch
npm run test:coverage
```

Full validation gate:

```bash
npm run validate
```

## Configuration

Source of truth:

- `vitest.config.ts`
- `app/tests/setupTests.ts`

Notes:

- Test files are discovered by `app/tests/**/*.test.{ts,tsx}`.
- Alias `@` resolves to repository root.

## Authoring Rules

- Keep tests behavior-focused, not implementation-detail-heavy.
- For interaction bugs, add regression tests before/with the fix.
- Mock external boundaries (network, Next navigation APIs) and keep UI intent real.
