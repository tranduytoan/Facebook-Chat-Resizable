# FB Chat Resizable

A minimal project that makes Facebook chat (on Facebook web) windows resizable. This repository contains a small Chrome extension and a Tampermonkey userscript that add left and top resize handles to chat windows so you can adjust their width and height.

## Files
- **`manifest.json`**: Extension manifest for Chrome (MV3).
- **`content.js`**: Content script used by the Chrome extension to add resize handles.
- **`Tampermonkey/fb-chat-resizable.user.js`**: Tampermonkey userscript equivalent of the extension.

## Installation

Chrome extension (development)
- Open `chrome://extensions/` in Chrome.
- Enable "Developer mode".
- Click "Load unpacked" and select this repository folder.

Tampermonkey userscript
- Install Tampermonkey (or a compatible userscript manager) in your browser.
- Create a new script and paste the contents of `Tampermonkey/fb-chat-resizable.user.js`, or import the file if your manager supports it.

## Usage
- Visit `https://www.facebook.com` and open a Messenger chat window.
- Hover near the left edge to resize width (horizontal drag) or near the top edge to resize height (vertical drag).

## Notes
- The script currently relies on Facebook DOM class selectors. Facebook may change classes frequently; if the script stops working you may need to update the selectors in `content.js` and the userscript.

## Contributing
- Adjust selectors to make the script more robust, or add features (for example: persistent sizes via `localStorage`).
