/* ==========================================================================
   router.js — Navigation, rendering, and all action dispatch logic.
   ========================================================================== */

/* ── Core navigation ─────────────────────────────────────────────────────── */

/** Navigate to a page, merging any extra params into ST, then re-render. */
function go(page, params) {
  ST.page = page;
  if (params) Object.assign(ST, params);
  saveState();
  render();
  window.scrollTo(0, 0);
}

/** Re-render the current page into #app. */
function render() {
  const app = document.getElementById('app');

  const renderers = {
    welcome:  renderWelcome,
    profile:  renderProfile,
    roadmap:  renderRoadmap,
    category: renderCategory,
    flow:     renderFlow,
    learn:    renderLearn,
    report:   renderReport,
  };

  const fn = renderers[ST.page];
  if (!fn) {
    app.innerHTML = '<p style="padding:2rem">Unknown page: ' + ST.page + '</p>';
    return;
  }

  app.innerHTML = fn();
}


/* ── Event delegation ────────────────────────────────────────────────────── */

function attachListeners(root) {
  /* Single click handler — reads data-a attribute from clicked element */
  root.addEventListener('click', function (e) {
    const el = e.target.closest('[data-a]');
    if (!el) return;
    e.preventDefault();
    dispatch(el.dataset.a, el.dataset);
  });

  /* Input / change handler — reads data-f (field key) attribute */
  root.addEventListener('input', function (e) {
    const el = e.target.closest('[data-f]');
    if (!el) return;
    handleFieldInput(el.dataset.f, el.value);
  });
}


/* ── Action dispatcher ───────────────────────────────────────────────────── */

function dispatch(action, data) {
  switch (action) {

    /* Welcome */
    case 'start':
      go('profile', { cStep: 0 });
      break;

    /* Company profile */
    case 'profile-next': profileNext(); break;
    case 'profile-back': profileBack(); break;

    /* Roadmap overview */
    case 'open-cat':
      go('category', { pillar: data.pillar, cat: data.cat });
      break;
    case 'open-learn':
      go('learn');
      break;
    case 'to-roadmap':
      go('roadmap');
      break;

    /* Category detail */
    case 'open-ind':
      go('flow', {
        pillar: data.pillar,
        cat:    data.cat,
        ind:    data.ind,
        iStep:  0,
        kpiLoading: false,
      });
      break;
    case 'back-to-roadmap':
      go('roadmap');
      break;
    case 'back-to-cat':
      go('category');
      break;

    /* Indicator flow — navigation */
    case 'flow-next': flowNext(); break;
    case 'flow-back': flowBack(); break;

    /* Indicator flow — data entry actions */
    case 'toggle-bv':   toggleBV(parseInt(data.idx, 10)); break;
    case 'set-priority': setPriority(data.value);          break;
    case 'set-status':   setStatus(data.value);            break;
    case 'na-continue':  naAdvance();   break;
    case 'edit-na':      editNA();      break;

    /* Actions list */
    case 'action-del': {
      const d = getIndData(ST.ind);
      if (Array.isArray(d.actions)) {
        d.actions.splice(parseInt(data.idx, 10), 1);
        saveState();
        render();
      }
      break;
    }
    case 'action-add': {
      const d = getIndData(ST.ind);
      if (!Array.isArray(d.actions)) d.actions = [];
      d.actions.push('');
      saveState();
      render();
      break;
    }

    /* Learning materials */
    case 'back-learn':
      go('roadmap');
      break;

    /* Progress report */
    case 'open-report':
      go('report');
      break;
    case 'back-from-report':
      go('roadmap');
      break;
    case 'export-pdf':
      window.print();
      break;

    /* Dev / debug */
    case 'reset':
      if (confirm('Reset all assessment data?')) resetState();
      break;
  }
}


/* ── Field input handler ─────────────────────────────────────────────────── */

function handleFieldInput(fieldKey, value) {
  if (fieldKey.startsWith('company.')) {
    const key = fieldKey.slice('company.'.length);
    ST.company[key] = value;
    saveState();
  } else if (fieldKey.startsWith('ind.actions.')) {
    /* Array item: ind.actions.{index} */
    const idx = parseInt(fieldKey.slice('ind.actions.'.length), 10);
    const d   = getIndData(ST.ind);
    if (Array.isArray(d.actions) && !isNaN(idx)) {
      d.actions[idx] = value;
      saveState();
    }
  } else if (fieldKey.startsWith('ind.')) {
    const key = fieldKey.slice('ind.'.length);
    setIndField(ST.ind, key, value);
  }
}


/* ── Company profile navigation ──────────────────────────────────────────── */

function profileNext() {
  if (ST.cStep < CSTEPS.length - 1) {
    ST.cStep++;
    saveState();
    render();
    window.scrollTo(0, 0);
  } else {
    go('roadmap');
  }
}

function profileBack() {
  if (ST.cStep > 0) {
    ST.cStep--;
    saveState();
    render();
    window.scrollTo(0, 0);
  } else {
    go('welcome');
  }
}


/* ── Indicator flow navigation ───────────────────────────────────────────── */

function flowNext() {
  const step = ST.iStep;

  if (step < 4) {
    ST.iStep = step + 1;

    /* Step 4 = KPI Targets: show loading dots first */
    if (ST.iStep === 4) {
      ST.kpiLoading = true;
      saveState();
      render();
      setTimeout(function () {
        ST.kpiLoading = false;
        saveState();
        render();
      }, 2000);
    } else {
      saveState();
      render();
      window.scrollTo(0, 0);
    }

  } else {
    /* Step 4 complete — mark indicator done and advance */
    const d = getIndData(ST.ind);
    d.done = true;
    saveState();

    const next = getNextIndicator(ST.pillar, ST.cat, ST.ind);
    if (next) {
      go('flow', { ind: next, iStep: 0, kpiLoading: false });
    } else {
      go('category');
    }
  }
}

function flowBack() {
  if (ST.iStep > 0) {
    ST.iStep--;
    saveState();
    render();
    window.scrollTo(0, 0);
  } else {
    go('category');
  }
}


/* ── Business Value toggle ───────────────────────────────────────────────── */

function toggleBV(idx) {
  const d   = getIndData(ST.ind);
  const pos = d.selBV.indexOf(idx);
  if (pos === -1) d.selBV.push(idx);
  else            d.selBV.splice(pos, 1);
  saveState();
  render();
}


/* ── Priority selection ──────────────────────────────────────────────────── */

function setPriority(value) {
  const d = getIndData(ST.ind);
  d.priority = value;

  if (value === 'Not Applicable') {
    d.na = true;
    saveState();
    render(); /* show NA message screen */
  } else {
    d.na = false;
    saveState();
    /* advance to Data Collection (step 2) */
    ST.iStep = 2;
    saveState();
    render();
    window.scrollTo(0, 0);
  }
}

/** Called from the NA screen — undo NA and return to the priority step */
function editNA() {
  const d = getIndData(ST.ind);
  d.na       = false;
  d.priority = null;
  ST.iStep   = 1;
  saveState();
  render();
  window.scrollTo(0, 0);
}

/** Called from the NA message screen — advance to next indicator */
function naAdvance() {
  const next = getNextIndicator(ST.pillar, ST.cat, ST.ind);
  if (next) {
    go('flow', { ind: next, iStep: 0, kpiLoading: false });
  } else {
    go('category');
  }
}


/* ── Status selection ────────────────────────────────────────────────────── */

function setStatus(value) {
  setIndField(ST.ind, 'status', value);
  autoFillKPI(ST.ind);
  render(); /* re-render so the selected card highlights */
}
