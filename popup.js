"use strict";

const MIN = 25;
const MAX = 500;

const levelInput = document.getElementById("level");
const decBtn = document.getElementById("dec");
const incBtn = document.getElementById("inc");
const resetBtn = document.getElementById("reset");
const stepSelect = document.getElementById("stepsize");
const errorBox = document.getElementById("error");
const presetButtons = [...document.querySelectorAll(".preset")];

let tabId = null;

// Restore preferred step size (popup-local, no permissions needed).
const savedStep = localStorage.getItem("stepSize");
if (savedStep) stepSelect.value = savedStep;
stepSelect.addEventListener("change", () => {
  localStorage.setItem("stepSize", stepSelect.value);
});

function clamp(percent) {
  return Math.min(MAX, Math.max(MIN, Math.round(percent)));
}

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.hidden = false;
  [decBtn, incBtn, resetBtn, levelInput, stepSelect, ...presetButtons].forEach(
    (el) => (el.disabled = true)
  );
}

function render(percent) {
  levelInput.value = percent;
  presetButtons.forEach((b) =>
    b.classList.toggle("active", Number(b.dataset.zoom) === percent)
  );
}

// Apply zoom to the active tab. Chrome's default zoom mode is
// per-origin + automatic, so the level persists for the domain across
// reloads and restarts on its own — no storage required.
async function applyZoom(percent) {
  const p = clamp(percent);
  try {
    await chrome.tabs.setZoom(tabId, p / 100);
    render(p);
  } catch (e) {
    showError("Can't zoom this page.");
  }
}

async function readZoom() {
  const factor = await chrome.tabs.getZoom(tabId);
  render(clamp(factor * 100));
}

function currentPercent() {
  return clamp(Number(levelInput.value) || 100);
}

function step() {
  return Number(stepSelect.value) || 5;
}

decBtn.addEventListener("click", () => applyZoom(currentPercent() - step()));
incBtn.addEventListener("click", () => applyZoom(currentPercent() + step()));
resetBtn.addEventListener("click", () => applyZoom(100));

presetButtons.forEach((b) =>
  b.addEventListener("click", () => applyZoom(Number(b.dataset.zoom)))
);

levelInput.addEventListener("change", () => applyZoom(currentPercent()));
levelInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    applyZoom(currentPercent());
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    applyZoom(currentPercent() + step());
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    applyZoom(currentPercent() - step());
  }
});

// Chrome only allows command shortcuts to be remapped from its own
// shortcuts page; extensions can't set them programmatically. A plain
// <a href="chrome://..."> is blocked, so open it via the tabs API.
document.getElementById("shortcuts").addEventListener("click", () => {
  chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
});

(async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || tab.id === undefined) {
    showError("No active tab.");
    return;
  }
  tabId = tab.id;
  try {
    await readZoom();
  } catch (e) {
    showError("Can't zoom this page.");
  }
})();
