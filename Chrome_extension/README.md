# A5 Chrome Extension

This directory contains the Chrome extension component of the A5 Browser Automation Tool. The extension provides a user-friendly interface for interacting with the Python server and executing browser automation commands.

## Structure

The extension consists of the following key components:

- `manifest.json`: Extension configuration and permissions
- `src/inject/inject.js`: Frontend logic for the extension
- `icons/`: Extension icons in various sizes

jQuery comes baked in for the old school folks who love and need it in the inject script.

## Development

To work on the extension:

1. Make changes to the source files
2. Load the extension in Chrome using Developer mode
3. Test the changes by interacting with the extension

## Building

The extension can be loaded directly as an unpacked extension during development. For production deployment, it needs to be packaged following Chrome Web Store guidelines.
