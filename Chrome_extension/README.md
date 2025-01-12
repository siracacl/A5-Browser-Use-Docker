# A5 Chrome Extension

This directory contains the Chrome extension component of the A5 Browser Automation Tool. The extension provides a user-friendly interface for interacting with the Python server and executing browser automation commands.

## Structure

The extension consists of the following key components:

- `manifest.json`: Extension configuration and permissions
- `popup.html`: The main UI that appears when clicking the extension icon
- `popup.js`: Frontend logic for the extension
- `background.js`: Background service worker for handling API requests
- `styles/`: CSS stylesheets for the extension UI
- `icons/`: Extension icons in various sizes

## Development

To work on the extension:

1. Make changes to the source files
2. Load the extension in Chrome using Developer mode
3. Test the changes by interacting with the extension

## Building

The extension can be loaded directly as an unpacked extension during development. For production deployment, it needs to be packaged following Chrome Web Store guidelines.
