/* ==========================================================================
   pages/roadmap.js — Roadmap Overview (Duolingo-style winding path)
   ========================================================================== */

function renderRoadmap() {
  /* Alternating left/right positions for the 5 nodes per pillar */
  const positions = ['l', 'r', 'l', 'r', 'l'];

  const pillarsHtml = PILLARS.map(function (pillar) {
    const nodesHtml = pillar.categories.map(function (cat, i) {
      const pos     = positions[i] || 'l';
      const state   = catState(pillar.id, cat.id);
      const prog    = catProgress(pillar.id, cat.id);
      const isDone  = state === 'done';
      const isActive = state === 'active';

      /* Circle CSS classes */
      let circleClass = 'node-circle';
      if (state === 'locked') {
        circleClass += ' node-circle--locked';
      } else {
        circleClass += ` node-circle--${pillar.cssClass}-${isDone ? 'done' : 'active'}`;
      }

      const checkBadge = isDone
        ? `<span class="node-circle__check">✓</span>`
        : '';

      const actionAttr = `data-a="open-cat" data-pillar="${pillar.id}" data-cat="${cat.id}"`;

      const countLabel = `${prog.done} of ${prog.total} indicator${prog.total !== 1 ? 's' : ''} completed`;

      return `
<div class="node-row node-row--${pos}">
  <button class="${circleClass}" ${actionAttr} aria-label="${cat.name}">
    <span class="node-circle__icon">
      <img src="img/icons/${cat.id}.svg" alt="${cat.name}" onerror="this.parentNode.innerHTML='${cat.icon}'">
    </span>
    ${checkBadge}
  </button>
  <span class="node-count-label">${countLabel}</span>
</div>
      `.trim();
    }).join('\n');

    return `
<div class="roadmap-pillar">
  <div class="roadmap-pillar-label roadmap-pillar-label--${pillar.cssClass}">
    <img src="img/icons/${pillar.id}pillar.svg" alt="${pillar.name}" onerror="this.outerHTML='${pillar.icon}'" class="pillar-label__icon">
    ${pillar.name}
  </div>
  ${nodesHtml}
</div>
    `.trim();
  }).join('\n');

  return `
<div class="pg-roadmap">

  <button class="reset-btn" data-a="reset" title="Clear all data and start over">
    ↺ Reset
  </button>

  <div class="roadmap__header">
    <p class="roadmap__eyebrow">Your ESG Journey</p>
    <h2 class="roadmap__title">Activity Roadmap</h2>
    <p class="roadmap__desc">
      Select any category to begin or continue your assessment.
      Work through each indicator at your own pace — your progress is saved automatically.
    </p>
  </div>

  <div class="roadmap-track">
    ${pillarsHtml}

    <!-- Document Your Progress — end of spine -->
    <button class="progress-node" data-a="open-report">
      <span class="progress-node__icon">📋</span>
      <span class="progress-node__name">Document Your Progress</span>
      <span class="progress-node__desc">Full report &amp; PDF export</span>
    </button>
  </div>

  <!-- Learning Materials — standalone portal, detached from spine -->
  <div class="learn-portal">
    <div class="learn-portal__inner">
      <span class="learn-portal__icon">📚</span>
      <div class="learn-portal__text">
        <p class="learn-portal__name">Learning Materials</p>
        <p class="learn-portal__desc">Frameworks, standards &amp; guides to support your journey</p>
      </div>
      <button class="btn btn--ghost" data-a="open-learn">Open →</button>
    </div>
  </div>

</div>
  `.trim();
}
