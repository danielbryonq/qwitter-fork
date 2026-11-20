# Dark Mode Implementation

This document describes the dark mode feature added to Qwitter.

## Overview

The application now supports light and dark themes that can be toggled by the user. The theme preference is persisted in localStorage and automatically restored on subsequent visits.

## Implementation Details

### Files Modified

1. **quasar.conf.js**
   - Added `Dark` plugin for theme management
   - Added `LocalStorage` plugin for persistence

2. **src/layouts/MainLayout.vue**
   - Added theme toggle button in the header (sun/moon icon)
   - Implemented `toggleDarkMode()` method to switch themes
   - Added `mounted()` hook to restore saved theme preference
   - Updated header styling to adapt to current theme

3. **src/css/app.sass**
   - Added dark mode specific styles for borders and dividers
   - Ensures proper contrast in dark mode

## Usage

### For Users

Click the sun/moon icon in the top-right corner of the header to toggle between light and dark modes. Your preference is automatically saved.

### For Developers

The dark mode state is managed by Quasar's Dark plugin:
- `this.$q.dark.isActive` - check if dark mode is active
- `this.$q.dark.toggle()` - toggle dark mode
- `this.$q.dark.set(true/false/'auto')` - set dark mode explicitly

Theme preference is stored in localStorage under the key `darkMode`.

## Technical Notes

- Uses Quasar's built-in Dark mode plugin
- Defaults to 'auto' mode (follows system preference) if no saved preference exists
- All Quasar components automatically adapt to the theme
- Custom styles use the `body.body--dark` selector for dark mode overrides
