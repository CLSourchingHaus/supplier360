/* ==========================================================================
   pages/flow.js — Indicator assessment flow (5-step Turbotax-style)
   Steps: 0=Business Value  1=Priority  2=Data Collection  3=Actions  4=KPI Targets
   ========================================================================== */

function renderFlow() {
  const pillar = findPillar(ST.pillar);
  const cat    = findCategory(ST.pillar, ST.cat);
  const ind    = IND[ST.ind] || {};
  const d      = getIndData(ST.ind);

  /* If priority is NA, show the NA screen */
  if (d.na) {
    return renderFlowLayout(pillar, cat, ind, d, renderNAScreen(ind));
  }

  const stepContent = [
    renderStep0_BusinessValue,
    renderStep1_Priority,
    renderStep2_DataCollection,
    renderStep3_Actions,
    renderStep4_KPITargets,
  ][ST.iStep];

  const content = stepContent
    ? stepContent(ind, d)
    : `<p>Step ${ST.iStep} — coming soon.</p>`;

  return renderFlowLayout(pillar, cat, ind, d, content);
}


/* ── Layout shell (sidebar + main) ──────────────────────────────────────── */

function renderFlowLayout(pillar, cat, ind, d, content) {
  return `
<div class="pg-flow">
  ${renderSidebar(pillar, cat, d)}
  <main class="flow-main">
    <div class="flow-main__inner">
      ${renderStepBar()}
      ${content}
    </div>
  </main>
</div>
  `.trim();
}


/* ── Left sidebar ────────────────────────────────────────────────────────── */

function renderSidebar(pillar, cat) {
  if (!pillar || !cat) return '<aside class="flow-sidebar"></aside>';

  const nodesHtml = cat.indicators.map(function (iid, i) {
    const isActive = iid === ST.ind;
    const state    = indState(iid);
    const nodeState = isActive ? 'active' : state;
    const ind      = IND[iid] || {};

    return `
<button class="sidebar-node sidebar-node--${nodeState}"
  data-a="open-ind" data-pillar="${ST.pillar}" data-cat="${ST.cat}" data-ind="${iid}">
  <div class="sidebar-node__dot">${nodeState === 'done' ? '✓' : nodeState === 'na' ? '—' : i + 1}</div>
  <span class="sidebar-node__name">${ind.name || iid}</span>
</button>
    `.trim();
  }).join('\n');

  return `
<aside class="flow-sidebar">
  <button class="flow-sidebar__back" data-a="back-to-cat">← Back</button>
  <hr class="flow-sidebar__divider">
  <div>
    <p class="flow-sidebar__cat-label">${pillar ? pillar.name : ''}</p>
    <p class="flow-sidebar__cat-name">${cat ? cat.icon + ' ' + cat.name : ''}</p>
  </div>
  <div class="flow-sidebar__nodes">
    ${nodesHtml}
  </div>
</aside>
  `.trim();
}


/* ── Step progress bar (5 dots + lines) ─────────────────────────────────── */

function renderStepBar() {
  const labels = ['Business Value', 'Priority', 'Data', 'Actions', 'KPI Targets'];
  let html = '<div class="flow-step-bar">';

  labels.forEach(function (label, i) {
    const state = i < ST.iStep ? 'done' : i === ST.iStep ? 'active' : '';
    html += `
<div class="flow-step-bar__item flow-step-bar__item--${state}" title="${label}">
  <div class="flow-step-bar__dot"></div>
  ${i < labels.length - 1 ? '<div class="flow-step-bar__line"></div>' : ''}
</div>
    `.trim();
  });

  html += '</div>';
  return html;
}


/* ── Step 0: Business Value ──────────────────────────────────────────────── */

function renderStep0_BusinessValue(ind, d) {
  const values = ind.bv || [];

  const cards = values.length
    ? values.map(function (bv, i) {
        const sel = d.selBV.includes(i);
        return `
<button class="choice-card ${sel ? 'choice-card--selected' : ''}"
  data-a="toggle-bv" data-idx="${i}">
  <div class="choice-card__check">${sel ? '✓' : ''}</div>
  <span class="choice-card__text">${bv}</span>
</button>
        `.trim();
      }).join('\n')
    : `<div style="padding:1rem;color:var(--muted);font-size:var(--text-sm);">Business value content will be added in the data-fill phase.</div>`;

  return `
<p class="step-eyebrow step-eyebrow--bv">Step 1 of 5 · Business Value</p>
<h2 class="step-title">${ind.name || 'Indicator'}</h2>
<p class="step-lead">
  Select the business value statements that are most relevant to your company.
  You can choose more than one.
</p>

<div class="choice-grid">
  ${cards}
</div>

<div class="step-nav">
  <button class="btn btn--ghost" data-a="flow-back">← Back</button>
  <button class="btn btn--primary" data-a="flow-next">Continue →</button>
</div>
  `.trim();
}


/* ── Step 1: Priority ────────────────────────────────────────────────────── */

function renderStep1_Priority(ind, d) {
  const questions = (ind.pq || []).map(function (q) {
    return `<li style="margin-bottom:var(--sp-2);font-size:var(--text-sm);color:var(--text);">${q}</li>`;
  }).join('');

  const qBlock = questions
    ? `<div class="step-cue"><ul style="padding-left:var(--sp-4);">${questions}</ul></div>`
    : `<div class="step-cue" style="color:var(--muted);font-size:var(--text-sm);">Priority questions will be added in the data-fill phase.</div>`;

  const priorities = [
    { value: 'High',           icon: '🔴', desc: 'Critical for your business or stakeholders' },
    { value: 'Medium',         icon: '🟡', desc: 'Important but not immediate' },
    { value: 'Low',            icon: '🟢', desc: 'Relevant, lower urgency right now' },
    { value: 'Not Applicable', icon: '⚪', desc: 'This topic does not apply to your business' },
  ];

  const btns = priorities.map(function (p) {
    const sel = d.priority === p.value;
    return `
<button class="priority-btn ${sel ? 'selected' : ''}"
  data-a="set-priority" data-value="${p.value}">
  <span class="priority-btn__icon">${p.icon}</span>
  <span class="priority-btn__label">${p.value}</span>
  <span class="priority-btn__desc">${p.desc}</span>
</button>
    `.trim();
  }).join('\n');

  return `
<p class="step-eyebrow step-eyebrow--pq">Step 2 of 5 · Priority</p>
<h2 class="step-title">${ind.name || 'Indicator'}</h2>
<p class="step-lead">These are the questions you should seek to address:</p>

${qBlock}

<p style="font-size:var(--text-base);font-weight:600;margin-bottom:var(--sp-4);color:var(--text);">
  Based on these questions, what level of priority would you assign to
  <em>${ind.name || 'this indicator'}</em>?
</p>

<div class="priority-grid">
  ${btns}
</div>

<div class="step-nav">
  <button class="btn btn--ghost" data-a="flow-back">← Back</button>
  <button class="btn btn--primary" data-a="flow-next" ${!d.priority || d.na ? 'disabled' : ''}>Continue →</button>
</div>
  `.trim();
}


/* ── Step 2: Data Collection ─────────────────────────────────────────────── */

function renderStep2_DataCollection(ind, d) {
  const statuses = [
    {
      value: 'Not Started',
      cls:   'ns',
      icon:  '🕐',
      title: 'I need to collect the data first',
      desc:  'I\'ll come back to log the value once I\'ve gathered the relevant records.',
    },
    {
      value: 'In Progress',
      cls:   'ip',
      icon:  '📋',
      title: 'I have partial data — still collecting',
      desc:  'I\'ve entered what I have so far and will update when the full dataset is ready.',
    },
    {
      value: 'Completed',
      cls:   'done',
      icon:  '✅',
      title: 'Data entered is complete and validated',
      desc:  'The value above is accurate, verified, and ready for reporting.',
    },
  ];

  const statusCards = statuses.map(function (s) {
    const sel = d.status === s.value;
    return `
<button class="status-card status-card--${s.cls} ${sel ? 'selected' : ''}"
  data-a="set-status" data-value="${s.value}">
  <span class="status-card__icon">${s.icon}</span>
  <div>
    <div class="status-card__title">${s.title}</div>
    <div class="status-card__desc">${s.desc}</div>
  </div>
</button>
    `.trim();
  }).join('\n');

  return `
<p class="step-eyebrow step-eyebrow--data">Step 3 of 5 · Data Collection</p>
<h2 class="step-title">${ind.name || 'Indicator'}</h2>

${ind.ds ? `
<div class="hint-box" style="margin-bottom:var(--sp-5);">
  <p class="hint-box__label">Data Sources</p>
  <p class="hint-box__text">${ind.ds}</p>
</div>` : ''}

<div class="field" style="margin-bottom:var(--sp-5);">
  <label class="field__label" for="ind_value">Current Value</label>
  <p class="field__hint">Enter your measured figure, or a brief description if not yet quantified.</p>
  <input class="field__input" type="text" id="ind_value"
    data-f="ind.value"
    placeholder="e.g. 245  or  Not yet measured"
    value="${escHtml(d.value)}">
  ${ind.unit ? `<p style="margin-top:var(--sp-1);font-size:var(--text-xs);color:var(--muted);font-family:var(--font-mono);">Unit: ${ind.unit}</p>` : ''}
</div>

<div class="field" style="margin-bottom:var(--sp-6);">
  <label class="field__label" for="ind_owner">Department / Owner</label>
  <p class="field__hint">Adjust if different from the suggested default.</p>
  <input class="field__input" type="text" id="ind_owner"
    data-f="ind.owner"
    placeholder="${escHtml(ind.dO || 'e.g. Operations / Finance')}"
    value="${escHtml(d.owner || ind.dO || '')}">
</div>

<p style="font-size:var(--text-base);font-weight:600;margin-bottom:var(--sp-2);color:var(--text);">
  What is the current data collection status?
</p>

<div class="status-grid">
  ${statusCards}
</div>

<div class="step-nav">
  <button class="btn btn--ghost" data-a="flow-back">← Back</button>
  <button class="btn btn--primary" data-a="flow-next" ${!d.status ? 'disabled' : ''}>Continue →</button>
</div>
  `.trim();
}


/* ── Step 3: Actions & Accountability ───────────────────────────────────── */

function renderStep3_Actions(ind, d) {
  /* Lazily seed from template on first visit — covers both null (new) and undefined (old data) */
  if (d.actions == null) {
    d.actions = (ind.sa || []).slice();
    saveState();
  }
  const actions = d.actions;

  const actionRows = actions.length
    ? actions.map(function (a, i) {
        return `
<div class="action-item">
  <div class="action-item__num">${i + 1}</div>
  <textarea class="action-item__textarea" data-f="ind.actions.${i}" rows="2">${escHtml(a)}</textarea>
  <button class="action-item__del" data-a="action-del" data-idx="${i}" title="Remove this action">×</button>
</div>
        `.trim();
      }).join('\n')
    : `<p class="action-item--empty">No actions yet — add one below.</p>`;

  return `
<p class="step-eyebrow step-eyebrow--act">Step 4 of 5 · Actions &amp; Accountability</p>
<h2 class="step-title">Recommended Actions</h2>
<p class="step-lead">
  Review the actions below — edit the text, remove any that don't apply,
  or add your own. Then assign a person responsible for
  <em>${ind.name || 'this indicator'}</em>.
</p>

<div class="action-list" style="margin-bottom:var(--sp-3);">
  ${actionRows}
</div>

<button class="action-add-btn" data-a="action-add">+ Add Action</button>

<div class="field" style="margin-top:var(--sp-6);">
  <label class="field__label" for="ind_person">Responsible Person</label>
  <p class="field__hint">Name the colleague who will own this indicator.</p>
  <input class="field__input" type="text" id="ind_person"
    data-f="ind.person"
    placeholder="Full name or job title"
    value="${escHtml(d.person)}">
</div>

<div class="step-nav">
  <button class="btn btn--ghost" data-a="flow-back">← Back</button>
  <button class="btn btn--primary" data-a="flow-next">Continue →</button>
</div>
  `.trim();
}


/* ── Step 4: KPI Targets ─────────────────────────────────────────────────── */

function renderStep4_KPITargets(ind, d) {
  /* Loading state — shown for 2 seconds before content reveals */
  if (ST.kpiLoading) {
    return `
<p class="step-eyebrow step-eyebrow--kpi">Step 5 of 5 · KPI Targets</p>
<div class="kpi-loading">
  <div class="kpi-loading__dots">
    <div class="kpi-loading__dot"></div>
    <div class="kpi-loading__dot"></div>
    <div class="kpi-loading__dot"></div>
  </div>
  <p class="kpi-loading__text">Building your KPI targets…</p>
</div>
    `.trim();
  }

  /* KPI milestone cards */
  const milestones = [
    {
      cls:   'short',
      year:  '2027',
      term:  'Short-term · 1 Year',
      field: 'kpiS',
      vField:'v2027',
    },
    {
      cls:   'mid',
      year:  '2029',
      term:  'Mid-term · 3 Years',
      field: 'kpiM',
      vField:'v2029',
    },
    {
      cls:   'long',
      year:  '2031',
      term:  'Long-term · 5 Years',
      field: 'kpiL',
      vField:'v2031',
    },
  ];

  const kpiCards = milestones.map(function (m) {
    return `
<div class="kpi-card kpi-card--${m.cls}">
  <div class="kpi-card__header">
    <span class="kpi-card__year">${m.year}</span>
    <span class="kpi-card__term">${m.term}</span>
  </div>
  <div class="kpi-card__body">
    <textarea class="kpi-card__textarea" data-f="ind.${m.field}"
      placeholder="KPI target description…"
      rows="3"
    >${escHtml(d[m.field] || '')}</textarea>
    <div class="kpi-card__value-row">
      <span class="kpi-card__value-label">Target value (${ind.unit || 'unit'}):</span>
      <input class="kpi-card__value-input" type="text" data-f="ind.${m.vField}"
        placeholder="—"
        value="${escHtml(d[m.vField] || '')}">
    </div>
  </div>
</div>
    `.trim();
  }).join('\n');

  return `
<p class="step-eyebrow step-eyebrow--kpi">Step 5 of 5 · KPI Targets</p>
<h2 class="step-title">Your KPI Milestones</h2>

<div class="kpi-banner kpi-reveal">
  <p class="kpi-banner__text">
    These are the recommended short, medium, and long-term KPI targets for your company.
    Feel free to customise the content to your organisation's specific context —
    then log your target value by each milestone.
  </p>
</div>

<div class="kpi-grid kpi-reveal">
  ${kpiCards}
</div>

<div class="field kpi-reveal" style="margin-top:var(--sp-6);">
  <label class="field__label" for="ind_notes">Evidence / Notes</label>
  <p class="field__hint">Link to supporting documents, data sources, or any relevant context.</p>
  <textarea class="field__input field__textarea" id="ind_notes"
    data-f="ind.notes"
    placeholder="Optional — attach evidence or add notes"
    rows="3"
  >${escHtml(d.notes)}</textarea>
</div>

<div class="step-nav kpi-reveal">
  <button class="btn btn--ghost" data-a="flow-back">← Back</button>
  <button class="btn btn--primary" data-a="flow-next">Save &amp; Continue →</button>
</div>
  `.trim();
}


/* ── Not Applicable screen ───────────────────────────────────────────────── */

function renderNAScreen(ind) {
  return `
<div class="na-message">
  <span class="na-message__icon">💡</span>
  <h3 class="na-message__title">Not applicable for your business</h3>
  <p class="na-message__text">
    Since <strong>${ind.name || 'this topic'}</strong> doesn't apply to your organisation,
    we'll skip it and move to the next indicator.
  </p>
  <div style="display:flex;gap:var(--sp-3);flex-wrap:wrap;justify-content:center;">
    <button class="btn btn--ghost" data-a="edit-na">
      ← Edit Response
    </button>
    <button class="btn btn--primary" data-a="na-continue">
      Next Indicator →
    </button>
  </div>
</div>
  `.trim();
}
