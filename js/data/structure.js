/* ==========================================================================
   structure.js — PILLARS tree, IND registry, and all helper functions.
   Loaded first. env.js / social.js / gov.js add their entries into IND.
   ========================================================================== */

/* IND: flat lookup of all 41 indicator detail objects.
   Populated by env.js, social.js, gov.js.
   Each entry shape:
   {
     name : string,
     unit : string,          // measurement unit
     bv   : string[],        // business values (split from "|")
     pq   : string[],        // priority questions
     ds   : string,          // data source
     dO   : string,          // default dept / owner
     sa   : string[],        // sample actions (7)
     ks   : string,          // KPI short · Not Started
     ki   : string,          // KPI short · In Progress
     kc   : string,          // KPI short · Completed
     km   : string,          // KPI mid   (2029)
     kl   : string,          // KPI long  (2031)
   }
*/
const IND = {};

/* PILLARS: three-level hierarchy  pillar → category → [indicatorId, …]  */
const PILLARS = [
  {
    id: 'env',
    name: 'Environmental',
    color: '#00885F',
    light: '#DCFAEE',
    cssClass: 'env',
    icon: '🌿',
    frameworks: 'GRI 302–307 · VSME E1–E7 · Boursa Kuwait E1–E7',
    categories: [
      {
        id: 'climate',
        name: 'Climate Action',
        icon: '🏭',
        indicators: ['env_s1', 'env_s2', 'env_s3', 'env_en', 'env_re'],
      },
      {
        id: 'pollution',
        name: 'Pollution & Air Quality',
        icon: '💨',
        indicators: ['env_ae', 'env_ww', 'env_hz', 'env_ei'],
      },
      {
        id: 'water',
        name: 'Water Usage',
        icon: '💧',
        indicators: ['env_tw', 'env_we'],
      },
      {
        id: 'waste',
        name: 'Waste Management & Circularity',
        icon: '♻️',
        indicators: ['env_tg', 'env_rr', 'env_hw', 'env_ce'],
      },
      {
        id: 'bio',
        name: 'Biodiversity',
        icon: '🌳',
        indicators: ['env_se', 'env_bi'],
      },
    ],
  },
  {
    id: 'soc',
    name: 'Social',
    color: '#23A8FF',
    light: '#E3F5FF',
    cssClass: 'soc',
    icon: '👥',
    frameworks: 'GRI 401–414 · VSME S1–S10 · Boursa Kuwait S2–S10',
    categories: [
      {
        id: 'employment',
        name: 'Employment Conditions',
        icon: '💼',
        indicators: ['soc_wh', 'soc_tr', 'soc_eb', 'soc_ne'],
      },
      {
        id: 'ohs',
        name: 'Occupational Health & Safety',
        icon: '🦺',
        indicators: ['soc_wi', 'soc_hs', 'soc_st'],
      },
      {
        id: 'diversity',
        name: 'Diversity & Equal Opportunity',
        icon: '⚖️',
        indicators: ['soc_gd', 'soc_ep'],
      },
      {
        id: 'humanrts',
        name: 'Human Rights',
        icon: '🤝',
        indicators: ['soc_hr', 'soc_gm'],
      },
      {
        id: 'labour',
        name: 'Child & Forced Labour Prevention',
        icon: '🛡️',
        indicators: ['soc_cl', 'soc_ls'],
      },
    ],
  },
  {
    id: 'gov',
    name: 'Governance',
    color: '#FF8035',
    light: '#FFF2EC',
    cssClass: 'gov',
    icon: '🏛️',
    frameworks: 'GRI 2 & 205 · VSME G1–G9 · Boursa Kuwait G1–G9 · TCFD',
    categories: [
      {
        id: 'oversight',
        name: 'Governance Structure & Oversight',
        icon: '🔍',
        indicators: ['gov_sa', 'gov_ss'],
      },
      {
        id: 'climrisk',
        name: 'Climate Risk & Business Resilience',
        icon: '⛈️',
        indicators: ['gov_pc', 'gov_tr', 'gov_bc'],
      },
      {
        id: 'suppcoc',
        name: 'Supplier Code of Conduct',
        icon: '📋',
        indicators: ['gov_sc', 'gov_su'],
      },
      {
        id: 'ethics',
        name: 'Business Ethics & Anti-Corruption',
        icon: '🏅',
        indicators: ['gov_ab', 'gov_cc'],
      },
      {
        id: 'reporting',
        name: 'Sustainability Reporting',
        icon: '📊',
        indicators: ['gov_er', 'gov_km'],
      },
    ],
  },
];

/* LEARN: populated by learning.js */
const LEARN = [];

/* CSTEPS: populated by profile-steps.js */
const CSTEPS = [];


/* ==========================================================================
   HELPER FUNCTIONS
   ========================================================================== */

/** Find a pillar by id */
function findPillar(pid) {
  return PILLARS.find(p => p.id === pid) || null;
}

/** Find a category within a pillar */
function findCategory(pid, cid) {
  const p = findPillar(pid);
  return p ? (p.categories.find(c => c.id === cid) || null) : null;
}

/** Find which pillar + category an indicator id belongs to */
function findIndLocation(iid) {
  for (const p of PILLARS) {
    for (const c of p.categories) {
      if (c.indicators.includes(iid)) {
        return { pillar: p.id, cat: c.id };
      }
    }
  }
  return null;
}

/** Get the next indicator id in the same category (null if last) */
function getNextIndicator(pid, cid, iid) {
  const cat = findCategory(pid, cid);
  if (!cat) return null;
  const idx = cat.indicators.indexOf(iid);
  if (idx < 0 || idx >= cat.indicators.length - 1) return null;
  return cat.indicators[idx + 1];
}

/** Compute visual state for a single indicator
 *  Returns: 'locked' | 'active' | 'done' | 'na'
 *  'done'   = data collection status is "Completed" (step 3)
 *  'active' = some data entered but not yet Completed
 */
function indState(iid) {
  if (typeof ST === 'undefined' || !ST.data) return 'locked';
  const d = ST.data[iid];
  if (!d)                          return 'locked';
  if (d.na)                        return 'na';
  if (d.status === 'Completed')    return 'done';
  if (d.priority || d.status || d.value) return 'active';
  return 'locked';
}

/** Aggregate state for a category node
 *  Returns: 'locked' | 'active' | 'done'
 */
function catState(pid, cid) {
  const cat = findCategory(pid, cid);
  if (!cat) return 'locked';
  const states = cat.indicators.map(indState);
  if (states.every(s => s === 'done' || s === 'na')) return 'done';
  if (states.some(s => s !== 'locked'))              return 'active';
  return 'locked';
}

/** Count indicators with status = Completed in a category */
function catProgress(pid, cid) {
  const cat = findCategory(pid, cid);
  if (!cat) return { done: 0, total: 0 };
  const total = cat.indicators.length;
  const done  = cat.indicators.filter(function (id) {
    const d = ST && ST.data && ST.data[id];
    return d && d.status === 'Completed';
  }).length;
  return { done, total };
}
