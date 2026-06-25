/* ==========================================================================
   pages/report.js — "Document Your Progress" comprehensive report
   ========================================================================== */

function renderReport() {
  const sections = PILLARS.map(function (pillar) {
    const categories = pillar.categories.map(function (cat) {
      const indicators = cat.indicators.map(function (iid) {
        return renderReportIndicator(iid, pillar);
      }).join('\n');

      return `
<div class="rpt-category">
  <div class="rpt-category__header">
    <img src="img/icons/${cat.id}.svg" alt="${cat.name}" class="rpt-category__icon" onerror="this.outerHTML='${cat.icon}'">
    <span class="rpt-category__name">${cat.name}</span>
  </div>
  ${indicators}
</div>
      `.trim();
    }).join('\n');

    return `
<div class="rpt-pillar">
  <div class="rpt-pillar__header rpt-pillar__header--${pillar.cssClass}">
    <img src="img/icons/${pillar.id}pillar.svg" alt="${pillar.name}" class="rpt-pillar__icon" onerror="this.outerHTML='${pillar.icon}'">
    ${pillar.name}
    <span class="rpt-pillar__frameworks">${pillar.frameworks}</span>
  </div>
  ${categories}
</div>
    `.trim();
  }).join('\n');

  return `
<div class="pg-report">

  <div class="rpt-header no-print">
    <button class="btn btn--ghost" data-a="back-from-report">← Back to Roadmap</button>
    <div class="rpt-header__title-wrap">
      <h1 class="rpt-header__title">Progress Report</h1>
      <p class="rpt-header__sub">
        ${ST.company && ST.company.companyName ? escHtml(ST.company.companyName) + ' &nbsp;·&nbsp; ' : ''}
        ${ST.company && ST.company.reportingYear ? 'Reporting Year ' + escHtml(ST.company.reportingYear) : ''}
      </p>
    </div>
    <button class="btn btn--primary" data-a="export-pdf">
      ⬇ Export PDF
    </button>
  </div>

  <div class="rpt-print-header print-only">
    <h1>Supplier 360 Sustainability Tool — Progress Report</h1>
    <p>
      ${ST.company && ST.company.companyName ? escHtml(ST.company.companyName) + ' · ' : ''}
      ${ST.company && ST.company.reportingYear ? 'Reporting Year ' + escHtml(ST.company.reportingYear) : ''}
      &nbsp;·&nbsp; Generated ${new Date().toLocaleDateString('en-GB', {day:'numeric',month:'long',year:'numeric'})}
    </p>
  </div>

  <div class="rpt-body">
    ${sections}
  </div>

</div>
  `.trim();
}


/* ── Single indicator block ─────────────────────────────────────────────── */

function renderReportIndicator(iid, pillar) {
  const ind  = IND[iid] || {};
  const d    = ST.data && ST.data[iid];
  const state = indState(iid);

  /* Status badge */
  const statusBadge = d && d.status
    ? `<span class="rpt-ind__badge rpt-ind__badge--${d.status.toLowerCase().replace(/ /g,'-')}">${d.status}</span>`
    : `<span class="rpt-ind__badge rpt-ind__badge--empty">Not started</span>`;

  const naBadge = d && d.na
    ? `<span class="rpt-ind__badge rpt-ind__badge--na">Not Applicable</span>` : '';

  return `
<div class="rpt-indicator ${state === 'locked' ? 'rpt-indicator--empty' : ''}">

  <div class="rpt-ind__title-row">
    <span class="rpt-ind__name">${ind.name || iid}</span>
    <span class="rpt-ind__unit">${ind.unit || ''}</span>
    <span class="rpt-ind__badges">${naBadge || statusBadge}</span>
  </div>

  ${d && d.na ? `
  <p class="rpt-field rpt-field--na">This indicator was marked Not Applicable and skipped.</p>
  ` : `
  <div class="rpt-steps">

    <div class="rpt-step">
      <p class="rpt-step__label">Business Value</p>
      ${renderRptBV(ind, d)}
    </div>

    <div class="rpt-step">
      <p class="rpt-step__label">Priority</p>
      ${rptVal(d && d.priority, 'Not set')}
    </div>

    <div class="rpt-step">
      <p class="rpt-step__label">Data Collection</p>
      <div class="rpt-fields">
        ${rptRow('Current Value', d && d.value, '—')}
        ${rptRow('Data Source', ind.ds, '—')}
        ${rptRow('Department / Owner', (d && d.owner) || ind.dO, '—')}
        ${rptRow('Status', d && d.status, 'Not set')}
      </div>
    </div>

    <div class="rpt-step">
      <p class="rpt-step__label">Actions &amp; Accountability</p>
      ${rptRow('Responsible Person', d && d.person, '—')}
    </div>

    <div class="rpt-step">
      <p class="rpt-step__label">KPI Targets</p>
      <div class="rpt-fields">
        ${rptRow('Short-term (2027)', d && d.kpiS, ind.ks || '—')}
        ${rptRow('Mid-term (2029)',   d && d.kpiM, ind.km || '—')}
        ${rptRow('Long-term (2031)',  d && d.kpiL, ind.kl || '—')}
        ${rptRow('Evidence / Notes', d && d.notes, '—')}
      </div>
    </div>

  </div>
  `}

</div>
  `.trim();
}


/* ── Helpers ────────────────────────────────────────────────────────────── */

function renderRptBV(ind, d) {
  const values = ind.bv || [];
  if (!values.length) return rptVal(null, 'No business values defined');
  const selected = d && d.selBV && d.selBV.length > 0;
  if (!selected) return `<p class="rpt-value rpt-value--empty">None selected</p>`;
  return `<p class="rpt-value">${
    values.filter(function (_, i) { return d.selBV.includes(i); }).join(' · ')
  }</p>`;
}

/** Render a single value — solid if entered, muted placeholder if not */
function rptVal(value, placeholder) {
  const filled = value && String(value).trim() !== '';
  return filled
    ? `<p class="rpt-value">${escHtml(String(value))}</p>`
    : `<p class="rpt-value rpt-value--empty">${placeholder}</p>`;
}

/** Render a label + value row */
function rptRow(label, value, placeholder) {
  const filled = value && String(value).trim() !== '';
  return `
<div class="rpt-field">
  <span class="rpt-field__label">${label}</span>
  <span class="rpt-field__value ${filled ? '' : 'rpt-field__value--empty'}">${
    filled ? escHtml(String(value)) : placeholder
  }</span>
</div>
  `.trim();
}
