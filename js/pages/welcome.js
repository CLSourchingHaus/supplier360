/* ==========================================================================
   pages/welcome.js — Welcome / hero screen
   ========================================================================== */

function renderWelcome() {
  return `
<div class="pg-welcome">
  <p class="welcome__wordmark"></p>

  <h1 class="welcome__title">Supplier 360<br>Sustainability Tool</h1>
  <p class="welcome__subtitle">An Activity Roadmap</p>

  <div class="welcome__rule"></div>

  <p class="welcome__desc">
    A structured ESG assessment for <strong>Kuwait &amp; GCC SMEs</strong>.
    Work through 41 indicators across Environmental, Social, and Governance pillars
    — at your own pace — to build your sustainability roadmap and KPI targets.
  </p>

  <div class="welcome__cta">
    <button class="btn btn--primary btn--lg" data-a="start">
      Begin Your Assessment &nbsp;→
    </button>
  </div>

  <div class="welcome__badges">
    <span class="welcome__badge">GRI Standards</span>
    <span class="welcome__badge">VSME · EFRAG 2024</span>
    <span class="welcome__badge">Boursa Kuwait ESG 2023</span>
    <span class="welcome__badge">Kuwait Vision 2035</span>
    <span class="welcome__badge">Kuwait Net-Zero 2060</span>
    <span class="welcome__badge">TCFD</span>
  </div>
</div>
  `.trim();
}
