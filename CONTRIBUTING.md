# Contributing to Qwitter

Thank you for your interest in contributing! This guide walks you through getting the project running locally so you can start hacking.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Fork & clone](#fork--clone)
3. [Install dependencies](#install-dependencies)
4. [Configure Firebase](#configure-firebase)
5. [Run in development mode](#run-in-development-mode)
6. [Build for production](#build-for-production)
7. [Code style](#code-style)
8. [Submitting a pull request](#submitting-a-pull-request)

---

## Prerequisites

| Tool | Minimum version |
|------|----------------|
| Node.js | 10.18.1 |
| npm | 6.13.4 |
| Yarn (optional) | 1.21.1 |
| Quasar CLI | latest (`npm i -g @quasar/cli`) |

Install Quasar CLI globally if you haven't already:

```bash
npm install -g @quasar/cli
```

---

## Fork & clone

1. Click **Fork** on GitHub to create your own copy of the repository.
2. Clone your fork locally:

```bash
git clone https://github.com/<your-username>/qwitter-fork.git
cd qwitter-fork
```

3. Add the upstream remote so you can keep your fork in sync:

```bash
git remote add upstream https://github.com/danielbryonq/qwitter-fork.git
```

---

## Install dependencies

```bash
npm install
```

---

## Configure Firebase

Qwitter uses Firebase (Firestore) as its backend. You need a Firebase project before the app will run.

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project named **Qwitter**.
2. Inside the project, add a **Web App** (also named Qwitter).
3. Copy the config snippet Firebase shows you — it looks like this:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

4. Paste those values into **`src/boot/firebase.js`** (replace the placeholder object already there).
5. In the Firebase Console, navigate to **Firestore Database** and create a Cloud Firestore database in **test mode**.

---

## Run in development mode

### Web (browser)

```bash
quasar dev
```

The app will open automatically at `http://localhost:8080` (hot-reload enabled).

### Desktop (Electron)

```bash
quasar dev -m electron
```

### Mobile – iOS (Cordova)

Requires [Xcode](https://developer.apple.com/download/more/) on macOS.

```bash
# Install Cordova globally (once)
npm install -g cordova

quasar dev -m cordova -T ios
```

To target a specific simulator:

```bash
cd src-cordova && cordova run ios --list && cd ..
quasar dev -m cordova -T ios -e "iPhone-12, 14.3"
```

### Mobile – Android (Cordova)

Follow the [Quasar Android setup guide](https://quasar.dev/quasar-cli/developing-cordova-apps/preparation#Android-setup), then:

```bash
quasar dev -m cordova -T android
```

---

## Build for production

| Target | Command |
|--------|---------|
| Web (SPA) | `quasar build` |
| Electron | `quasar build -m electron` |
| iOS | `quasar build -m cordova -T ios` |
| Android | `quasar build -m cordova -T android` |

For Electron cross-platform builds, set `electron > packager > platform` in `quasar.conf.js` to `win32`, `darwin`, `mas`, or `linux` before running the build.

---

## Code style

- The project ships with an **`.editorconfig`** file — make sure your editor respects it (indent size 2, LF line endings, UTF-8).
- Follow the existing Vue single-file component conventions you see in `src/pages/` and `src/layouts/`.
- Keep commits small and focused; write clear, imperative commit messages (e.g. `fix: correct tweet timestamp format`).

---

## Submitting a pull request

1. Create a feature branch off `main`:

```bash
git checkout -b feat/my-feature
```

2. Make your changes, commit them, and push to your fork:

```bash
git push origin feat/my-feature
```

3. Open a Pull Request against `danielbryonq/qwitter-fork:main`.
4. Describe **what** you changed and **why** in the PR description.
5. Respond to any review comments promptly.

We appreciate every contribution — big or small. Happy coding! 🐦
