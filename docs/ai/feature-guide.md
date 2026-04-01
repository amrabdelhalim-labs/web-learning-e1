# Feature Guide — web-learning-e1

## Add a New Lesson

1. Add lesson item in `app/config.ts` under `LESSONS`:
   - `slug`
   - `nameAr`
2. No new routes are required if lesson uses existing 4 sections.
3. Validate sidebar rendering and navigation.
4. Run tests and add coverage if behavior changed.

## Add a New Lesson Section

1. Extend `LessonSection` in `app/types.ts`.
2. Add label in `LESSON_SECTIONS` (`app/config.ts`).
3. Add icon mapping in `CustomizedListItem`.
4. Add new page route: `app/[slug]/<section>/page.tsx`.
5. Update any per-section loading text if needed.
6. Update docs and tests.

## Add/Change API Behavior

1. Update route file in `app/api/.../route.ts`.
2. Keep `validateApiKey` / `handleOpenAIError` usage.
3. Update client adapter in `app/lib/api.ts`.
4. Add or update tests in `app/tests/api*.test.ts`.
5. Synchronize docs (`README`, `docs/ai/architecture.md`, `docs/deployment.md` if operational impact).

## Sidebar-Specific Change Checklist

- Preserve one-expanded-at-a-time behavior.
- Preserve route-aware expansion.
- Preserve submenu click targeting and mobile close behavior.
- Ensure list layout remains in normal flow (no click-through overlays).
- Update `lessonSidebarInteraction.test.tsx` for regressions.

## Done Criteria

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
