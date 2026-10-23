/**
 * PARTYBALA - HIGH-SECURITY ANTI-THEFT & CONTENT PROTECTION SUITE
 * Protects proprietary assets, media, pricing data, and brand identity.
 * Fully compatible with booking & inquiry forms (input/textarea copy/paste preserved).
 */

(function () {
  'use strict';

  // 1. Disable Right-Click Context Menu
  document.addEventListener('contextmenu', function (e) {
    // Allow right click inside input fields or textareas for user convenience if needed
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      return true;
    }
    e.preventDefault();
    return false;
  }, { capture: true, passive: false });

  // 2. Block Source Viewing & Developer Tools Shortcuts
  document.addEventListener('keydown', function (e) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlKey = isMac ? e.metaKey : e.ctrlKey;
    const key = e.key ? e.key.toUpperCase() : '';
    const keyCode = e.keyCode || e.which;

    // F12 Key
    if (keyCode === 123 || key === 'F12') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect Element)
    if (ctrlKey && e.shiftKey && (key === 'I' || key === 'J' || key === 'C' || keyCode === 73 || keyCode === 74 || keyCode === 67)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+U / Cmd+Option+U (View Page Source)
    if (ctrlKey && (key === 'U' || keyCode === 85)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+S / Cmd+S (Save Page HTML)
    if (ctrlKey && (key === 'S' || keyCode === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+P / Cmd+P (Print Page)
    if (ctrlKey && (key === 'P' || keyCode === 80)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+C / Cmd+C (Copy) Protection - ONLY for non-input elements
    if (ctrlKey && (key === 'C' || keyCode === 67)) {
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);
      if (!isInput) {
        // Prevent copying proprietary page text
        e.preventDefault();
        return false;
      }
    }

    // Ctrl+A / Cmd+A (Select All) Protection - ONLY for non-input elements
    if (ctrlKey && (key === 'A' || keyCode === 65)) {
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);
      if (!isInput) {
        e.preventDefault();
        return false;
      }
    }
  }, { capture: true, passive: false });

  // 3. Disable Dragging of Images and Media
  document.addEventListener('dragstart', function (e) {
    const tag = e.target.tagName;
    if (tag === 'IMG' || tag === 'PICTURE' || tag === 'SVG' || tag === 'VIDEO' || tag === 'A') {
      e.preventDefault();
      return false;
    }
  }, { capture: true, passive: false });

  // 4. Console Protection Notice
  try {
    const styleTitle = 'color: #d91b5c; font-family: serif; font-size: 24px; font-weight: bold;';
    const styleBody = 'color: #555; font-size: 13px; line-height: 1.6;';
    console.log('%cPartyBala™ - Luxury Bridal & Beauty Concierge', styleTitle);
    console.log('%cProtected Proprietary System. All rights reserved.\nUnauthorized scraping, copying, or reverse engineering of PartyBala assets is strictly prohibited.', styleBody);
  } catch (err) {
    // Quiet fail
  }
})();
