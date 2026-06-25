/* ==========================================================================
   pages/learning.js — Learning Materials portal
   ========================================================================== */

function renderLearn() {
  const sections = LEARN.map(function (cat) {
    const items = (cat.items || []);

    const linksHtml = items.length
      ? items.map(function (item) {
          return `
<a class="learn-item"
   href="${item.url || '#'}"
   target="${item.url ? '_blank' : ''}"
   rel="noopener noreferrer">
  <p class="learn-item__name">${item.title}</p>
  ${item.org ? `<p class="learn-item__desc">${item.org}</p>` : ''}
  <span class="learn-item__link">${item.url ? 'Open ↗' : 'Coming soon'}</span>
</a>
          `.trim();
        }).join('\n')
      : `<p style="color:var(--muted);font-size:var(--text-sm);">Links will be added in the data-fill phase.</p>`;

    return `
<div>
  <p class="learn-section__title">${cat.icon || ''} &nbsp; ${cat.name}</p>
  <div class="learn-items">
    ${linksHtml}
  </div>
</div>
    `.trim();
  }).join('\n');

  const fallback = LEARN.length === 0
    ? `<div style="padding:2rem;text-align:center;color:var(--muted);">Learning resource categories will be added in the data-fill phase.</div>`
    : '';

  return `
<div class="pg-learn">

  <div class="learn__header">
    <button class="btn btn--link learn__back" data-a="back-learn">← Back to Roadmap</button>
    <h2 class="learn__title">📚 Learning Materials</h2>
    <p class="learn__subtitle">
      Frameworks, standards, and guides to support your ESG journey.
    </p>
  </div>

  <div class="learn-grid">
    ${sections}
    ${fallback}
  </div>

</div>
  `.trim();
}
