/**
 * Gizoogle Popup Script
 * 
 * Controls the extension popup UI for enabling/disabling translation
 * and adjusting the Snoop level.
 */

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = "gizoogleEnabled";
const LEVEL_KEY = "gizoogleLevel";

const MIN_LEVEL = 1;
const MAX_LEVEL = 3;
const DEFAULT_LEVEL = 2;

const LEVEL_DESCRIPTIONS = {
  1: "Light — Casual vibes",
  2: "Standard — Uncle Snoop energy",
  3: "Heavy — Full Doggystyle"
};

const HINTS = {
  enabled: "Lays that Snoop flavor on visible text.",
  disabled: "Restores original text."
};

// ============================================================================
// Chrome API Wrappers
// ============================================================================

function queryTabs(queryInfo) {
  return new Promise((resolve) => {
    try {
      chrome.tabs.query(queryInfo, (tabs) => resolve(tabs || []));
    } catch {
      resolve([]);
    }
  });
}

function getFromStorage(defaults) {
  return new Promise((resolve) => {
    try {
      chrome.storage.local.get(defaults, (result) => {
        if (chrome.runtime.lastError) {
          resolve(defaults);
        } else {
          resolve(result);
        }
      });
    } catch {
      resolve(defaults);
    }
  });
}

function saveToStorage(items) {
  return new Promise((resolve) => {
    try {
      chrome.storage.local.set(items, () => resolve());
    } catch {
      resolve();
    }
  });
}

function sendMessageToTab(tabId, message) {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

// ============================================================================
// Tab Utilities
// ============================================================================

async function getActiveTabId() {
  const tabs = await queryTabs({ active: true, currentWindow: true });
  return tabs[0]?.id;
}

// ============================================================================
// Storage Accessors
// ============================================================================

async function loadEnabledState() {
  const result = await getFromStorage({ [STORAGE_KEY]: true });
  return !!result[STORAGE_KEY];
}

async function loadLevel() {
  const result = await getFromStorage({ [LEVEL_KEY]: DEFAULT_LEVEL });
  const rawLevel = Number(result[LEVEL_KEY] ?? DEFAULT_LEVEL);
  return clampLevel(rawLevel);
}

async function saveEnabledState(isEnabled) {
  await saveToStorage({ [STORAGE_KEY]: !!isEnabled });
}

async function saveLevel(level) {
  const clampedLevel = clampLevel(level);
  await saveToStorage({ [LEVEL_KEY]: clampedLevel });
}

// ============================================================================
// Level Utilities
// ============================================================================

function clampLevel(level) {
  const numericLevel = Number(level);
  if (!Number.isFinite(numericLevel)) return DEFAULT_LEVEL;
  return Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.round(numericLevel)));
}

function getLevelDescription(level) {
  return LEVEL_DESCRIPTIONS[level] || "";
}

function getHintText(isEnabled) {
  return isEnabled ? HINTS.enabled : HINTS.disabled;
}

// ============================================================================
// DOM Accessors
// ============================================================================

function getEnabledCheckbox() {
  return document.getElementById("enabled");
}

function getLevelSlider() {
  return document.getElementById("level");
}

function getHintElement() {
  return document.getElementById("hint");
}

function getLevelLabelElement() {
  return document.getElementById("levelLabel");
}

// ============================================================================
// UI Updates
// ============================================================================

function updateHintDisplay(isEnabled) {
  const hintElement = getHintElement();
  hintElement.textContent = getHintText(isEnabled);
}

function updateLevelLabelDisplay(level) {
  const labelElement = getLevelLabelElement();
  labelElement.textContent = getLevelDescription(level);
}

function updateEnabledCheckboxDisplay(isEnabled) {
  getEnabledCheckbox().checked = isEnabled;
}

function updateLevelSliderDisplay(level) {
  getLevelSlider().value = String(level);
}

async function synchronizeUIWithStorage() {
  const [isEnabled, level] = await Promise.all([
    loadEnabledState(),
    loadLevel()
  ]);

  updateEnabledCheckboxDisplay(isEnabled);
  updateLevelSliderDisplay(level);
  updateLevelLabelDisplay(level);
  updateHintDisplay(isEnabled);
}

// ============================================================================
// Content Script Communication
// ============================================================================

async function notifyContentScriptEnabledChanged(isEnabled) {
  const tabId = await getActiveTabId();
  if (!tabId) return;

  try {
    await sendMessageToTab(tabId, {
      type: "GIZOOGLE_SET_ENABLED",
      enabled: isEnabled
    });
  } catch {
    // Content scripts can't run on some pages (chrome://, extension pages, etc)
  }
}

async function notifyContentScriptLevelChanged(level) {
  const tabId = await getActiveTabId();
  if (!tabId) return;

  try {
    await sendMessageToTab(tabId, {
      type: "GIZOOGLE_SET_LEVEL",
      level
    });
  } catch {
    // Content scripts can't run on some pages
  }
}

// ============================================================================
// Event Handlers
// ============================================================================

async function handleEnabledToggle(event) {
  const isEnabled = !!event.target.checked;

  await saveEnabledState(isEnabled);
  updateHintDisplay(isEnabled);
  await notifyContentScriptEnabledChanged(isEnabled);
}

async function handleLevelChange(event) {
  const level = clampLevel(event.target.value);

  updateLevelLabelDisplay(level);
  await saveLevel(level);
  await notifyContentScriptLevelChanged(level);
}

// ============================================================================
// Event Binding
// ============================================================================

function bindEventListeners() {
  getEnabledCheckbox().addEventListener("change", handleEnabledToggle);
  getLevelSlider().addEventListener("input", handleLevelChange);
}

// ============================================================================
// Initialization
// ============================================================================

async function initialize() {
  await synchronizeUIWithStorage();
  bindEventListeners();
}

document.addEventListener("DOMContentLoaded", initialize);
