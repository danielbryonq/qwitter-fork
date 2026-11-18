# Qwitter (qwitter)

A Cross-Platrom Twitter Clone created with Quasar Framework, VueJS & Firebase

## Setup Firebase
- Create a new Firebase project named Qwitter
- Create a Web App named Qwitter
- Copy the config from the code sample that appears and add it to src/boot/firebase.js
- Create a Cloud Firestore database - make sure you choose "Start in test mode"

## Install the dependencies
```bash
npm install
```

## Web Version

### Start  in development mode
```bash
quasar dev
```

### Build for production
```bash
quasar build
```

## Desktop Version (Electron)

### Start  in development mode
```bash
quasar dev -m electron
```

### Build for production
To build for different platforms, change the `electron > packager > platform` setting in `quasar.conf.js` to `win32`, `darwin`, `mas` or `linux` 
```bash
quasar build -m electron
```

## iOS Version (Cordova)

### Install Cordova globally
```bash
npm install -g cordova
```
or
```bash
sudo npm install -g cordova
```

### Install Xcode

[Install Xcode](https://developer.apple.com/download/more/)

### Start  in development mode
```bash
quasar dev -m cordova -T ios
```

### Start on other Simulator Devices
```bash
cd src-cordova
cordova run ios --list
cd ..
quasar dev -m cordova -T ios -e "iPhone-12, 14.3"
```

### Build for production
```bash
quasar build -m cordova -T ios
```

## Android Version (Cordova)

### Install Cordova globally
```bash
npm install -g cordova
```
or
```bash
sudo npm install -g cordova
```

### Follow all steps on Quasar site

[Follow all steps on Quasar site](https://quasar.dev/quasar-cli/developing-cordova-apps/preparation#Android-setup)

### Launch Android Virtual Device
Android Studio > Configure > AVD Manager > Launch an AVD

### Start  in development mode
```bash
quasar dev -m cordova -T android
```

### Build for production
```bash
quasar build -m cordova -T android
```

## Project structure

```
qwitter-fork/
├── public/              # Static assets served as-is (favicon, icons)
├── src/
│   ├── assets/          # Processed assets (images, fonts imported by components)
│   ├── boot/            # Quasar boot files (Firebase initialisation, etc.)
│   ├── css/             # Global styles (app.sass / quasar.variables.sass)
│   ├── layouts/         # Page shell components (e.g. MainLayout.vue)
│   ├── pages/           # Route-level Vue components (one file per page)
│   ├── router/          # Vue Router configuration (routes.js, index.js)
│   ├── App.vue          # Root Vue component
│   └── index.template.html  # HTML template used by Quasar CLI during build
├── src-cordova/         # Cordova project for iOS & Android builds
├── src-electron/        # Electron main-process files for desktop builds
├── quasar.conf.js       # Quasar CLI configuration (plugins, build targets, etc.)
├── babel.config.js      # Babel transpilation settings
├── .editorconfig        # Editor formatting rules
└── CONTRIBUTING.md      # How to set up & contribute to this project
```

> **New here?** See [CONTRIBUTING.md](CONTRIBUTING.md) for a step-by-step local setup guide.
