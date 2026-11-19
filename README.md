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

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository and create your branch from `master`.
2. **Clone** your fork locally and install dependencies with `npm install`.
3. **Make your changes** — bug fixes, new features, or documentation improvements are all appreciated.
4. **Test** your changes to make sure nothing is broken.
5. **Commit** your changes with a clear and descriptive commit message.
6. **Open a Pull Request** against the `master` branch and describe what you changed and why.

Please follow the existing code style and keep pull requests focused on a single change. For major changes, consider opening an issue first to discuss your proposal.
