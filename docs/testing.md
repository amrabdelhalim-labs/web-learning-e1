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

## Key Regression Coverage

- Sidebar lesson expansion and submenu targeting:
  - only one expanded lesson
  - submenu navigation targets correct path
  - lower submenu items remain clickable
  - no click-through to underlying rows

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
