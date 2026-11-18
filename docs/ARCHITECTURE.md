# Qwitter — Architecture

> A cross-platform Twitter clone built with [Quasar Framework](https://quasar.dev/), [Vue 2](https://v2.vuejs.org/), and [Firebase](https://firebase.google.com/).

---

## Table of Contents

1. [High-level overview](#1-high-level-overview)
2. [Directory structure](#2-directory-structure)
3. [Layout](#3-layout)
4. [Pages](#4-pages)
5. [Router](#5-router)
6. [State management](#6-state-management)
7. [Firebase usage](#7-firebase-usage)
8. [Filters / utilities](#8-filters--utilities)
9. [Styling](#9-styling)
10. [Multi-platform targets](#10-multi-platform-targets)
11. [Data flow diagram](#11-data-flow-diagram)

---

## 1. High-level overview

```
Browser / Electron / Cordova
        │
        ▼
  Quasar Framework  (build toolchain + UI component library)
        │
        ▼
   Vue 2 SPA
   ├── MainLayout          shell: nav drawer + header + sidebar
   │   ├── PageHome        compose + real-time qweet feed
   │   ├── PageAbout       static about page
   │   └── Error404        fallback 404 page
        │
        ▼
  Firebase / Firestore     cloud data store (qweets collection)
```

The app has **no dedicated back-end server**. All data persistence and real-time synchronisation is handled directly by the Firebase client SDK talking to Cloud Firestore.

---

## 2. Directory structure

```
qwitter-fork/
├── docs/
│   └── ARCHITECTURE.md       ← you are here
├── src/
│   ├── assets/               static assets (e.g. dove logo SVG)
│   ├── boot/
│   │   └── firebase.js       Firebase initialisation + Firestore export
│   ├── css/
│   │   ├── app.scss          global SCSS overrides / custom styles
│   │   └── quasar.variables.scss  Quasar theme variable overrides
│   ├── layouts/
│   │   └── MainLayout.vue    single app shell (header, drawer, sidebar)
│   ├── pages/
│   │   ├── PageHome.vue      feed + compose (main feature page)
│   │   ├── PageAbout.vue     static about page
│   │   └── Error404.vue      catch-all 404 page
│   ├── router/
│   │   ├── index.js          creates the Vue Router instance
│   │   └── routes.js         route definitions
│   └── App.vue               root Vue component (renders <router-view>)
├── quasar.conf.js            Quasar CLI config (boot, plugins, build targets)
├── package.json
└── README.md
```

---

## 3. Layout

**File:** `src/layouts/MainLayout.vue`

`MainLayout` is the single persistent shell that wraps every route. It is composed of three regions:

| Region | Quasar component | Description |
|---|---|---|
| **Header** | `QHeader` / `QToolbar` | App title ("Qwitter") with dove icon and hamburger menu toggle |
| **Left drawer** | `QDrawer` (left, bordered) | Navigation links: **Home** (`/`) and **About** (`/about`) |
| **Right sidebar** | `QDrawer` (right, bordered) | Placeholder cards for Search and Trending topics |
| **Page area** | `QPageContainer` | Renders the active route's page component via `<router-view>` |

The left drawer is **overlay** on mobile and **side-by-side** on desktop (`breakpoint="md"`).

---

## 4. Pages

### 4.1 PageHome (`/`)

**File:** `src/pages/PageHome.vue`

The core feature page. Responsibilities:

| Feature | Implementation |
|---|---|
| **Compose** | `QInput` textarea bound to `newQweetContent`; submit via button or `Ctrl+Enter` |
| **Feed** | `v-for` over `qweets[]`; each item in a `QItem` card |
| **Like** | Calls `toggleLike(qweet)` → Firestore `update` |
| **Delete** | Calls `deleteQweet(qweet)` → Firestore `delete` |
| **Timestamps** | Rendered with the `relativeDate` filter (e.g. "5 minutes ago") |
| **Real-time sync** | Firestore `onSnapshot` listener started in `mounted()` |

**Local data shape (a single qweet object):**

```js
{
  id: String,          // Firestore document ID
  content: String,     // tweet text
  date: Date,          // JS Date of creation
  likes: Number        // running like count
}
```

### 4.2 PageAbout (`/about`)

**File:** `src/pages/PageAbout.vue`

A static informational page describing the project. No dynamic data.

### 4.3 Error404 (`*`)

**File:** `src/pages/Error404.vue`

Catch-all 404 page. Displayed when no route matches; includes a "Go Home" link.

---

## 5. Router

**Files:** `src/router/index.js`, `src/router/routes.js`

Vue Router is used in **hash mode** (default for Quasar SPA/Cordova/Electron compatibility).

```
Route       Component      Layout
─────────────────────────────────────────
/           PageHome       MainLayout
/about      PageAbout      MainLayout
*           Error404       (none)
```

All real routes are **children** of `MainLayout`, so the shell is never re-mounted during navigation.

---

## 6. State management

There is **no Vuex store**. The app is small enough that all reactive state lives directly inside `PageHome.vue`'s `data()` function:

| Property | Type | Purpose |
|---|---|---|
| `qweets` | `Array` | The live list of qweet objects, kept in sync by a Firestore `onSnapshot` listener |
| `newQweetContent` | `String` | Two-way bound to the compose input |

If the app grows (e.g. authentication, user profiles, notifications), a Vuex store with dedicated modules (`auth`, `feed`, `notifications`) would be the natural next step.

---

## 7. Firebase usage

**File:** `src/boot/firebase.js`

This [Quasar boot file](https://quasar.dev/quasar-cli/boot-files) runs before the Vue app mounts. It:

1. Initialises the Firebase app with the project config object.
2. Creates a Firestore instance (`firebase.firestore()`).
3. Exports the `db` reference so any component can import it.

```js
// src/boot/firebase.js  (simplified)
import * as firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = { /* your config here */ }
firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()
export { db }
```

### Firestore collection: `qweets`

| Operation | Trigger | Firestore call |
|---|---|---|
| **Read (real-time)** | `mounted()` in PageHome | `db.collection('qweets').orderBy('date').onSnapshot(...)` |
| **Create** | User submits compose form | `db.collection('qweets').add({ content, date, likes: 0 })` |
| **Update (like)** | User clicks ❤️ | `db.collection('qweets').doc(id).update({ likes: likes + 1 })` |
| **Delete** | User clicks 🗑️ | `db.collection('qweets').doc(id).delete()` |

> **Security note:** The Firestore database is set up in **test mode** (open read/write rules). Before going to production, add proper security rules to restrict writes to authenticated users.

---

## 8. Filters / utilities

| Filter | Location | Description |
|---|---|---|
| `relativeDate` | Registered globally in `PageHome.vue` | Wraps `date-fns/formatDistance` to turn a `Date` into a human-readable relative string (e.g. "3 minutes ago") |

---

## 9. Styling

| File | Purpose |
|---|---|
| `src/css/quasar.variables.scss` | Overrides Quasar's default primary/secondary brand colours |
| `src/css/app.scss` | Global styles and any custom utility classes |

Component-scoped styles live inside each `*.vue` file's `<style>` block.

---

## 10. Multi-platform targets

Quasar compiles the same Vue source into multiple targets via `quasar.conf.js`:

| Target | Command | Output |
|---|---|---|
| **Web SPA** | `quasar dev / build` | Standard browser bundle |
| **Desktop (Electron)** | `quasar dev/build -m electron` | Native desktop app (Windows / macOS / Linux) |
| **iOS (Cordova)** | `quasar dev/build -m cordova -T ios` | iOS app via Xcode |
| **Android (Cordova)** | `quasar dev/build -m cordova -T android` | Android APK via Android Studio |

No platform-specific code exists in the current codebase — the same Vue components run everywhere.

---

## 11. Data flow diagram

```
User types a qweet
        │
        ▼
  PageHome.vue
  newQweetContent (local data)
        │  form submit
        ▼
  db.collection('qweets').add(...)   ──►  Cloud Firestore
                                               │
                                    onSnapshot │ (real-time push)
                                               ▼
                                      PageHome.vue
                                      qweets[] (local data)
                                               │
                                               ▼
                                       <QItem> feed renders
```

Changes made by **any client** (like, delete, new qweet) are immediately reflected on **all connected clients** because `onSnapshot` maintains a persistent WebSocket connection to Firestore.
