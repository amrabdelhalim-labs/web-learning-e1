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
