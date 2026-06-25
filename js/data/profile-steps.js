/* ==========================================================================
   data/profile-steps.js — Company Profile form step definitions (6 steps).
   Each step: { title, subtitle, fields[] }
   Each field: { key, label, type, placeholder, hint?, defaultVal? }
   ========================================================================== */

CSTEPS.push(

  /* Step 0 — Organisation Details */
  {
    title: 'Organisation Details',
    subtitle: "Let's start with the basics about your company.",
    fields: [
      {
        key:         'companyName',
        label:       'Company Name',
        type:        'text',
        placeholder: 'Official registered name',
      },
      {
        key:         'tradingName',
        label:       'Trading Name',
        type:        'text',
        placeholder: 'Leave blank if same as company name',
      },
      {
        key:         'regNumber',
        label:       'Registration Number',
        type:        'text',
        placeholder: 'e.g. 123456',
      },
      {
        key:         'address',
        label:       'Registered Location / Address',
        type:        'textarea',
        placeholder: 'Street, district, city',
      },
      {
        key:         'country',
        label:       'Country',
        type:        'text',
        placeholder: 'Kuwait',
        defaultVal:  'Kuwait',
      },
    ],
  },

  /* Step 1 — Business Classification */
  {
    title: 'Business Classification',
    subtitle: 'Help us understand what your business does.',
    fields: [
      {
        key:         'companyType',
        label:       'Company Type',
        type:        'text',
        placeholder: 'e.g. WLL, K.S.C.C., Sole Proprietor',
      },
      {
        key:         'sector',
        label:       'Industry / Sector',
        type:        'text',
        placeholder: 'e.g. Manufacturing, Construction, Retail, F&B',
      },
      {
        key:         'primaryActivity',
        label:       'Primary Business Activity',
        type:        'textarea',
        placeholder: 'Describe your main product or service',
        hint:        'This description appears on your ESG report cover page.',
      },
    ],
  },

  /* Step 2 — Workforce */
  {
    title: 'Workforce',
    subtitle: 'Tell us about the people in your organisation.',
    fields: [
      {
        key:         'totalFTE',
        label:       'Total Employees (FTEs)',
        type:        'number',
        placeholder: 'e.g. 85',
      },
      {
        key:         'kuwaitiNationals',
        label:       'Kuwaiti Nationals (#)',
        type:        'number',
        placeholder: 'e.g. 12',
        hint:        'Required for Kuwaitization ratio (Kuwait Labour Law).',
      },
      {
        key:         'partTimeTemp',
        label:       'Part-time / Temporary Employees',
        type:        'number',
        placeholder: 'e.g. 5',
      },
      {
        key:         'operatingSites',
        label:       'Operating Sites (#)',
        type:        'number',
        placeholder: 'e.g. 2',
      },
    ],
  },

  /* Step 3 — Financial Overview */
  {
    title: 'Financial Overview',
    subtitle: 'Used to contextualise ESG data and determine reporting thresholds.',
    fields: [
      {
        key:         'revenueKWD',
        label:       'Annual Revenue (KWD)',
        type:        'text',
        placeholder: 'e.g. 1,500,000',
      },
      {
        key:         'revenueEUR',
        label:       'Annual Revenue (EUR)',
        type:        'text',
        placeholder: 'e.g. 4,500,000',
        hint:        'Required for VSME/ESRS threshold assessment (EUR 40M turnover cap).',
      },
      {
        key:         'reportingYear',
        label:       'Reporting Year',
        type:        'text',
        placeholder: '2025',
        defaultVal:  '2025',
      },
      {
        key:         'fyEnd',
        label:       'Financial Year End',
        type:        'text',
        placeholder: 'e.g. 31 December',
      },
    ],
  },

  /* Step 4 — Key Contacts */
  {
    title: 'Key Contacts',
    subtitle: 'Who is responsible for this ESG assessment?',
    fields: [
      {
        key:         'ceoName',
        label:       'CEO / General Manager',
        type:        'text',
        placeholder: 'Full name',
      },
      {
        key:         'sustainabilityContact',
        label:       'Sustainability Contact Name',
        type:        'text',
        placeholder: 'Full name or role title',
      },
      {
        key:         'sustainabilityPhone',
        label:       'Sustainability Contact Phone',
        type:        'tel',
        placeholder: '+965 9999 9999',
      },
    ],
  },

  /* Step 5 — Certifications & Memberships */
  {
    title: 'Certifications & Memberships',
    subtitle: 'Any existing standards or programmes your company already follows.',
    fields: [
      {
        key:         'certifications',
        label:       'Existing Certifications',
        type:        'text',
        placeholder: 'e.g. ISO 9001, ISO 14001, ISO 45001',
        hint:        'Separate multiple certifications with commas.',
      },
      {
        key:         'memberships',
        label:       'Industry Memberships',
        type:        'text',
        placeholder: 'e.g. Kuwait Chamber of Commerce, KFAS',
      },
      {
        key:         'customerESGReqs',
        label:       'Customer ESG Requirements From',
        type:        'text',
        placeholder: 'e.g. KNPC, KOC, SourcingHaus',
        hint:        'Which customers are asking you for ESG data or compliance?',
      },
    ],
  }
);
