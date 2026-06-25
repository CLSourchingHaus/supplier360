/* ==========================================================================
   main.js — Entry point. Load saved state and render the initial page.
   ========================================================================== */

(function () {
  loadState();
  render();
  /* Attach delegated listeners once — they survive all innerHTML replacements */
  attachListeners(document.getElementById('app'));
}());
