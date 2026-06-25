/* ==========================================================================
   state.js — Application state, persistence, and indicator data helpers.
   ========================================================================== */

const STORAGE_KEY = 's360_v1';

/* ST: the single source of truth for all app state.
   Mutate via direct assignment + saveState(), never replace the reference. */
let ST = {
  page:       'welcome',   // welcome | profile | roadmap | category | flow | learn
  cStep:      0,           // company profile step index (0–5)
  pillar:     null,        // selected pillar id
  cat:        null,        // selected category id
  ind:        null,        // selected indicator id
  iStep:      0,           // indicator flow step (0–4)
  kpiLoading: false,       // true during the 2-second KPI animation
  company:    {},          // company profile form data  { [fieldKey]: value }
  data:       {},          // assessment data  { [indicatorId]: IndData }
};

/* ── Persistence ─────────────────────────────────────────────────────────── */

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ST));
  } catch (_) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      Object.assign(ST, parsed);
      /* Always open on the welcome page when no meaningful data has been saved yet */
      const hasData = (ST.company && ST.company.companyName) ||
                      Object.keys(ST.data || {}).length > 0;
      if (!hasData) ST.page = 'welcome';
    }
  } catch (_) {}
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

/* ── Indicator data ──────────────────────────────────────────────────────── */

/*
  IndData shape:
  {
    selBV    : number[],    // indices of selected business values
    priority : string|null, // 'High' | 'Medium' | 'Low' | 'Not Applicable'
    value    : string,      // current measured value (free text)
    status   : string|null, // 'Not Started' | 'In Progress' | 'Completed'
    owner    : string,      // dept / owner (pre-filled from IND.dO, editable)
    person   : string,      // responsible person name
    kpiS     : string,      // short KPI text (auto-filled, editable)
    kpiM     : string,      // mid KPI text  (auto-filled, editable)
    kpiL     : string,      // long KPI text (auto-filled, editable)
    v2027    : string,      // numeric target value 2027
    v2029    : string,      // numeric target value 2029
    v2031    : string,      // numeric target value 2031
    notes    : string,      // evidence / notes
    done     : boolean,     // true once the user finishes step 4
    na       : boolean,     // true if priority = 'Not Applicable'
  }
*/

/** Return (and lazily initialise) indicator assessment data */
function getIndData(id) {
  if (!ST.data[id]) {
    const ind = IND[id] || {};
    ST.data[id] = {
      selBV:    [],
      priority: null,
      value:    '',
      status:   null,
      owner:    ind.dO || '',
      person:   '',
      actions:  null,   // null = not yet initialised; lazily copied from ind.sa on first visit to step 3
      kpiS:     '',
      kpiM:     '',
      kpiL:     '',
      v2027:    '',
      v2029:    '',
      v2031:    '',
      notes:    '',
      done:     false,
      na:       false,
    };
  }
  return ST.data[id];
}

/** Set a single field on an indicator's data and persist */
function setIndField(indId, field, value) {
  const d = getIndData(indId);
  d[field] = value;
  saveState();
}

/** Auto-populate KPI texts from status + IND content */
function autoFillKPI(indId) {
  const d   = getIndData(indId);
  const ind = IND[indId] || {};
  if (d.status === 'Not Started')  d.kpiS = ind.ks || '';
  if (d.status === 'In Progress')  d.kpiS = ind.ki || '';
  if (d.status === 'Completed')    d.kpiS = ind.kc || '';
  d.kpiM = ind.km || '';
  d.kpiL = ind.kl || '';
  saveState();
}
