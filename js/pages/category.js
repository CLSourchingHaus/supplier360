/* ==========================================================================
   pages/category.js — Category detail: sub-node roadmap for one category
   ========================================================================== */

function renderCategory() {
  const pillar = findPillar(ST.pillar);
  const cat    = findCategory(ST.pillar, ST.cat);

  if (!pillar || !cat) {
    return `<div style="padding:2rem"><p>Category not found.</p>
      <button class="btn btn--ghost" data-a="back-to-roadmap">← Back to Roadmap</button></div>`;
  }

  /* Alternating positions for sub-nodes */
  const positions = ['l', 'r', 'l', 'r', 'l', 'r', 'l'];

  const nodesHtml = cat.indicators.map(function (iid, i) {
    const pos   = positions[i] || 'l';
    const ind   = IND[iid] || {};
    const state = indState(iid);
    const num   = i + 1;

    /* Node colour based on pillar + state */
    let nodeStyle = '';
    let numLabel  = num;
    let checkBadge = '';
    if (state === 'done') {
      nodeStyle  = `background:${pillar.color}; border-color:${pillar.color};`;
      checkBadge = '<span class="cat-node__check">✓</span>';
    } else if (state === 'active') {
      nodeStyle = `border-color:${pillar.color}; color:${pillar.color};`;
    } else if (state === 'na') {
      nodeStyle = 'background:var(--ground-dark); color:var(--subtle);';
      numLabel  = '—';
    }

    const actionAttr = `data-a="open-ind" data-pillar="${ST.pillar}" data-cat="${ST.cat}" data-ind="${iid}"`;

    return `
<div class="cat-node-row cat-node-row--${pos}">
  <button
    class="cat-node cat-node--${state}"
    style="${nodeStyle}"
    ${actionAttr}
    aria-label="${ind.name || iid}"
  >
    <span class="cat-node__num">${numLabel}</span>
    <span class="cat-node__name-inner">${ind.name || iid}</span>
    ${checkBadge}
  </button>
</div>
    `.trim();
  }).join('\n');

  return `
<div class="pg-category">

  <div class="category__back">
    <button class="btn btn--link" data-a="back-to-roadmap">← Roadmap</button>
  </div>

  <div class="category__header">
    <div class="category__pillar-tag" style="background:${pillar.color}">
      ${pillar.icon} &nbsp; ${pillar.name}
    </div>
    <h2 class="category__title">${cat.icon} &nbsp; ${cat.name}</h2>
    <p class="category__subtitle">
      ${cat.indicators.length} indicator${cat.indicators.length !== 1 ? 's' : ''} &nbsp;·&nbsp;
      Select any to begin or continue your assessment.
    </p>
  </div>

  <div class="cat-track">
    ${nodesHtml}
  </div>

</div>
  `.trim();
}
