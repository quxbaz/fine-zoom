"use strict";

const MIN = 25;
const MAX = 500;
const STEP = 5; // percent

function clamp(percent) {
  return Math.min(MAX, Math.max(MIN, Math.round(percent)));
}

async function adjust(deltaPercent) {
  // Keyboard-command invocation grants activeTab for the focused tab,
  // so setZoom works without host permissions. Chrome's default
  // per-origin automatic zoom mode persists the level per domain.
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || tab.id === undefined) return;
  try {
    const factor = await chrome.tabs.getZoom(tab.id);
    const next = clamp(factor * 100 + deltaPercent);
    await chrome.tabs.setZoom(tab.id, next / 100);
  } catch (e) {
    // Restricted page (chrome://, Web Store, etc.) — nothing to do.
  }
}

chrome.commands.onCommand.addListener((command) => {
  if (command === "zoom-in") adjust(STEP);
  else if (command === "zoom-out") adjust(-STEP);
});
