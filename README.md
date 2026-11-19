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

## Testing

The home screen feed (`src/pages/PageHome.vue`) is covered by unit tests written with [Jest](https://jestjs.io/) and [Vue Test Utils](https://vue-test-utils.vuejs.org/), set up through Quasar's [unit-jest app extension](https://github.com/quasarframework/quasar-testing).

The tests use an in-memory stand-in for Firebase (`test/jest/mocks/firebase.js`), so you don't need a Firebase project or an internet connection to run them, and they never touch real data.

### Run the tests once
```bash
npm test
```

### Re-run the tests whenever a file changes
```bash
npm run test:unit:watch
```

### See a coverage report
```bash
npm run test:unit:coverage
```
The report is written to `test/jest/coverage/`.

Tests live in `test/jest/__tests__/` and must end in `.spec.js` or `.test.js`.

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