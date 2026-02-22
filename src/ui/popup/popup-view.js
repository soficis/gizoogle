(() => {
  const root = typeof globalThis !== "undefined" ? globalThis : this;
  const gizoogle = root.Gizoogle || (root.Gizoogle = {});
  const ui = gizoogle.ui || (gizoogle.ui = {});
  const popup = ui.popup || (ui.popup = {});

  function createPopupView(documentRef) {
    if (!documentRef) {
      throw new Error("createPopupView requires a document reference");
    }

    const enabledCheckbox = documentRef.getElementById("enabled");
    const levelSlider = documentRef.getElementById("level");
    const levelLabel = documentRef.getElementById("levelLabel");
    const hint = documentRef.getElementById("hint");
    const errorBanner = documentRef.getElementById("errorBanner");

    if (!enabledCheckbox || !levelSlider || !levelLabel || !hint || !errorBanner) {
      throw new Error("Popup view could not find required DOM elements");
    }

    const levelDescriptions = Object.freeze({
      1: "Light — Casual vibes",
      2: "Standard — Uncle Snoop energy",
      3: "Heavy — Full Doggystyle"
    });

    const hintText = Object.freeze({
      enabled: "Lays that Snoop flavor on visible text.",
      disabled: "Restores original text."
    });

    function setEnabled(enabled) {
      enabledCheckbox.checked = enabled;
      hint.textContent = enabled ? hintText.enabled : hintText.disabled;
    }

    function setLevel(level) {
      levelSlider.value = String(level);
      levelLabel.textContent = levelDescriptions[level] || "";
    }

    function showError(message) {
      const text = message ? String(message) : "";
      errorBanner.textContent = text;
      errorBanner.hidden = text.length === 0;
    }

    function onEnabledChange(handler) {
      enabledCheckbox.addEventListener("change", handler);
    }

    function onLevelInput(handler) {
      levelSlider.addEventListener("input", handler);
    }

    function getEnabledFromEvent(event) {
      return event && event.target ? event.target.checked === true : false;
    }

    function getLevelFromEvent(event) {
      return event && event.target ? event.target.value : undefined;
    }

    return Object.freeze({
      setEnabled,
      setLevel,
      showError,
      onEnabledChange,
      onLevelInput,
      getEnabledFromEvent,
      getLevelFromEvent
    });
  }

  popup.view = Object.freeze({
    createPopupView
  });

  if (typeof module === "object" && module.exports) {
    module.exports = popup.view;
  }
})();
