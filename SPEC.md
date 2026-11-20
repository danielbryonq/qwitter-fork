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
| `quasar.conf.js` | Added `'Dark'` to the `plugins` array to enable the Quasar Dark plugin |
| `src/layouts/MainLayout.vue` | Added `brightness_7` / `brightness_2` icon toggle button in toolbar; `mounted()` reads `localStorage` / `prefers-color-scheme` to init; `toggleDarkMode()` method calls `$q.dark.toggle()` and saves to `localStorage` |
| `src/pages/PageHome.vue` | Removed hard-coded `color="grey-2"` on the `<q-separator>`; added `.body--dark` SASS overrides for divider and tweet-border colours |
| `src/css/app.sass` | Added `.body--dark` body/page background override |

## Behaviour
- **Default**: respects system `prefers-color-scheme` on first visit.
- **Toggle**: clicking the sun (light) or moon (dark) icon in the top-right of the header switches modes instantly.
- **Persistence**: choice stored in `localStorage` under the key `qwitter-dark-mode`; restored on next page load.
- When dark mode is active, Quasar automatically handles the majority of component theming via its built-in dark palette; custom overrides handle dividers, borders and backgrounds.

## Implementation Notes
- `NODE_OPTIONS=--openssl-legacy-provider` is required to run the dev server on Node 17+ (pre-existing project constraint).
- The `$q.dark` plugin must be listed in `quasar.conf.js → framework.plugins` before it is accessible via `this.$q.dark`.

## Out of Scope (Deferred)
- Per-user server-side preference storage.
- Custom colour palette beyond Quasar's dark mode defaults.
