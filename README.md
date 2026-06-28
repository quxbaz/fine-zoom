# Fine Zoom

A minimal Chrome extension for fine-grained, per-site zoom — without the broad
"read and change all your data on all websites" permission that most zoom
extensions ask for.

## Why the permissions are minimal

It requests only **`activeTab`**. The zoom is applied through Chrome's own
`chrome.tabs.setZoom` API, which only needs access to the tab you're currently
looking at (granted the moment you click the toolbar icon). It never injects
scripts or reads page content.

## Persistence

Chrome's default zoom mode is **per-origin + automatic**, the same mode the
built-in zoom uses. This extension just sets the zoom factor and lets Chrome
remember it, so the level sticks to the domain across reloads, new tabs, and
browser restarts — exactly like Chrome's native zoom. No storage permission
needed.

## Features

- Step zoom in/out in configurable increments: 1%, 2%, 5%, or 10%
- Type an exact percentage, or use ↑/↓ in the field
- Quick presets (50–150%)
- Reset to 100%
- Keyboard shortcuts: **Alt+Shift+Up** zoom in 5%, **Alt+Shift+Down** zoom out 5%

## Keyboard shortcuts

The defaults are `Alt+Shift+Up` / `Alt+Shift+Down` (5% per press). Remap them at
`chrome://extensions/shortcuts`.

You **cannot** bind these to `Ctrl+=` / `Ctrl+-`: Chrome's shortcut API doesn't
accept the `=`/`-` keys, and those combos are reserved by Chrome for its native
zoom and always take priority over extensions. Truly intercepting them would
require injecting a script into every page (broad host permission), which this
extension intentionally avoids.

## Install (unpacked)

1. Open `chrome://extensions`
2. Toggle **Developer mode** (top right)
3. Click **Load unpacked** and select this folder
4. Pin the extension and click it on any page to adjust zoom

## Notes

Chrome blocks zoom (and all extensions) on restricted pages like
`chrome://`, the Web Store, and `view-source:`. On those the popup shows
"Can't zoom this page."
