/* ==========================================================================
   pages/profile.js — Company Profile multi-step form (6 steps)
   ========================================================================== */

function renderProfile() {
  const step     = ST.cStep;
  const stepData = CSTEPS[step] || {};
  const isLast   = step === CSTEPS.length - 1;

  /* Progress dots */
  const dots = CSTEPS.map((_, i) => {
    const cls = i < step ? 'profile-dot--done'
              : i === step ? 'profile-dot--active'
              : '';
    return `<div class="profile-dot ${cls}"></div>`;
  }).join('');

  /* Form fields */
  const fields = (stepData.fields || []).map(f => renderProfileField(f)).join('');

  /* Fallback if no fields yet (stub phase) */
  const fieldContent = fields || `
    <div style="padding: 2rem; text-align:center; color: var(--muted); border: 2px dashed var(--border); border-radius: var(--r-md);">
      <p style="font-size:var(--text-sm)">Fields for <strong>${stepData.title || 'this step'}</strong> will be added in the data-fill phase.</p>
    </div>
  `;

  return `
<div class="pg-profile">

  <div class="profile__header">
    <div class="profile-dots">${dots}</div>
    <p class="profile__step-label">Step ${step + 1} of ${CSTEPS.length} &nbsp;·&nbsp; Company Profile</p>
    <h2 class="profile__title">${stepData.title || 'Company Profile'}</h2>
    <p class="profile__subtitle">${stepData.subtitle || ''}</p>
  </div>

  <div class="profile__card card card--elevated">
    <div class="profile__fields">
      ${fieldContent}
    </div>
  </div>

  <div class="profile__nav">
    <button class="btn btn--ghost" data-a="profile-back">
      ← Back
    </button>
    <button class="btn btn--primary" data-a="profile-next">
      ${isLast ? 'Go to Roadmap →' : 'Continue →'}
    </button>
  </div>

</div>
  `.trim();
}

/** Render a single form field based on its definition */
function renderProfileField(f) {
  const val = (ST.company[f.key] !== undefined) ? ST.company[f.key]
            : (f.defaultVal || '');

  if (f.type === 'textarea') {
    return `
<div class="field">
  <label class="field__label" for="pf_${f.key}">${f.label}</label>
  ${f.hint ? `<p class="field__hint">${f.hint}</p>` : ''}
  <textarea
    class="field__input field__textarea"
    id="pf_${f.key}"
    data-f="company.${f.key}"
    placeholder="${f.placeholder || ''}"
  >${escHtml(val)}</textarea>
</div>
    `.trim();
  }

  return `
<div class="field">
  <label class="field__label" for="pf_${f.key}">${f.label}</label>
  ${f.hint ? `<p class="field__hint">${f.hint}</p>` : ''}
  <input
    class="field__input"
    type="${f.type || 'text'}"
    id="pf_${f.key}"
    data-f="company.${f.key}"
    placeholder="${f.placeholder || ''}"
    value="${escHtml(val)}"
  >
</div>
  `.trim();
}

/** Minimal HTML escape for attribute values */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
