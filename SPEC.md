# SPEC: Light & Dark Mode

## Goal
Add a light/dark mode toggle to Qwitter so users can switch between a light theme (default) and a dark theme, with the preference persisted across sessions.

## Approach
- Use **Quasar's built-in dark mode plugin** (`$q.dark`) — available in Quasar v1.
- Persist the user's preference in **`localStorage`** so it survives page reloads.
- Read the system's `prefers-color-scheme` media query as the **initial default** if no stored preference exists.
- Expose a **toggle button** in the `MainLayout.vue` header (a sun/moon icon button).

## Components Changed
| File | Change |
|------|--------|
| `quasar.conf.js` | Enable the `Dark` Quasar plugin |
| `src/layouts/MainLayout.vue` | Add toggle button in header; init dark mode on mount |
| `src/css/app.sass` | Dark-mode-aware CSS custom properties for colours that Quasar doesn't cover automatically |
| `src/pages/PageHome.vue` | Remove hard-coded `color="grey-2"` on divider; rely on theme |

## Behaviour
- **Default**: respects system `prefers-color-scheme`.
- **Toggle**: clicking the sun (light) or moon (dark) icon in the top-right of the header switches modes.
- **Persistence**: choice stored in `localStorage` under the key `qwitter-dark-mode`.
- When dark mode is active, the entire UI — header, drawers, tweet list, inputs — uses Quasar's built-in dark palette.

## Out of Scope
- Per-user server-side preference storage.
- Custom colour palette beyond Quasar's dark mode defaults.
