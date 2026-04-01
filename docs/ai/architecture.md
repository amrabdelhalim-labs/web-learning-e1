# Architecture Reference — web-learning-e1

## Layers

1. UI pages: `app/[slug]/*` + `app/page.tsx`
2. Shared layout/components: `app/layouts`, `app/components`
3. State: `app/context` + hooks in `app/hooks`
4. Client API adapter: `app/lib/api.ts`
5. Server routes: `app/api/*/route.ts`
6. External: OpenAI SDK

## State Model

- `ThemeContext`: light/dark mode + RTL-compatible MUI theme.
- `AppContext`: sidebar drawer state, messages, alerts, footer action state.

## Sidebar Model (Current)

Source files:

- `app/components/SideBar/SideBar.tsx`
- `app/components/SideBar/CustomizedListItem.tsx`

Behavior:

- Expansion is controlled by `expandedLessonSlug` in `SideBar`.
- Current route (`usePathname`) determines active lesson/section.
- Only one lesson stays expanded.
- Submenu clicks:
  - call `event.stopPropagation()`
  - close mobile drawer (`setOpenMobile(false)`)
  - navigate using `router.push`.
- Layout uses a scrollable lesson list + in-flow footer (no absolute overlay).

## API Contracts

### `POST /api/chat-completion`

- Input: `{ messages: ChatMessage[] }`
- Output: OpenAI message object `{ role, content }` (status 200).

### `POST /api/speech-to-text`

- Input: `FormData` with key `file`.
- Output: transcription payload from OpenAI (includes `text`).

### `POST /api/text-completion`

- Input: `{ message: string }`
- Output: `{ text: string | null }`.

### `GET /api/health`

- Output: `{ status: "ok", service: "web-learning-e1", timestamp }`.

## Testing

- Tests location: `app/tests`.
- Sidebar interaction regression coverage in:
  - `app/tests/lessonSidebarInteraction.test.tsx`

## Dynamic Markdown Rendering Pipeline

Source files:

- `app/components/MarkdownRenderer.tsx`
- `app/lib/textDirection.ts`
- `app/hooks/useActionCycle.ts`

Strategy:

- Raw AI markdown is rendered via `react-markdown` + `remark-gfm` without unsafe HTML parsing.
- Direction is chosen semantically per markdown block (`p`, headings, list items, quote, table cells) using first-strong-character detection.
- Container uses `dir="auto"` instead of forcing global RTL.
- Code blocks and inline code are always LTR with bidi isolation to keep paths/commands/env keys readable.
- Punctuation-heavy technical tokens (e.g. `/api/health`, `JWT_SECRET=test`, URLs) are treated as isolated inline LTR tokens to avoid symbol drift in mixed Arabic/English lines.
- Sentence-level direction now uses dominant-script detection with ending punctuation hints, improving final punctuation anchoring in mixed Arabic/English output.
- Tables support mixed-language content with per-cell direction and horizontal overflow handling.

## Conditional Action-Cycle Model

- Reusable interaction-state model lives in `app/hooks/useActionCycle.ts`.
- Uses disable/enable workflow stages (editing/submitting/locked) instead of hide/show toggles.
- Keeps controls visible while disabling them when the current answer is locked after submission.
- Resets to editable state on new-content actions so inputs and buttons re-enable predictably.

## Compact Feedback Card Rhythm

- Short AI feedback cards use shared compact spacing rules from `app/styles.ts` (`compactFeedbackCardSx`).
- Keeps short answers readable without oversized empty space on mobile and desktop.
