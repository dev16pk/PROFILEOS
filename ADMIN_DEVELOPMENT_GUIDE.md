# ProfileOS Admin Panel — Development & Transition Guide

> **Version:** 1.0  
> **Date:** March 7, 2026  
> **Scope:** Standalone admin page, CSV+JSON data layer migration, Gemini AI chatbot assistant

---

## Table of Contents

1. [Overview](#1-overview)
2. [Current Architecture](#2-current-architecture)
3. [Target Architecture](#3-target-architecture)
4. [Data Architecture — CSV + JSON](#4-data-architecture--csv--json)
5. [Phase 1 — Data Layer Infrastructure](#5-phase-1--data-layer-infrastructure)
6. [Phase 2 — Admin Page Foundation](#6-phase-2--admin-page-foundation)
7. [Phase 3 — Core Admin: Profile-Scoped Editing](#7-phase-3--core-admin-profile-scoped-editing)
8. [Phase 4 — Section Editors](#8-phase-4--section-editors)
9. [Phase 5 — Profile Creation & Management](#9-phase-5--profile-creation--management)
10. [Phase 6 — AI Chatbot Sidebar (Gemini)](#10-phase-6--ai-chatbot-sidebar-gemini)
11. [Phase 7 — Data Export/Import](#11-phase-7--data-exportimport)
12. [Phase 8 — Integration & Polish](#12-phase-8--integration--polish)
13. [File Inventory](#13-file-inventory)
14. [Data Schemas](#14-data-schemas)
15. [Verification Checklist](#15-verification-checklist)
16. [Dependency Graph](#16-dependency-graph)
17. [Design Decisions Log](#17-design-decisions-log)

---

## 1. Overview

### What We're Building

A **standalone admin page** (`admin.html`) that provides:

- **Full CRUD** for profiles — create new profiles, edit every section of any profile, publish/unpublish, delete, duplicate, reorder
- **CSV + JSON data layer** — profiles stored as files instead of hardcoded JS, loaded at runtime via `fetch()`
- **AI Assistant sidebar** (Gemini API) — helps draft summaries, milestones, skill mappings, achievements, tags, and project descriptions
- **Export/Download workflow** — admin generates updated data files, user downloads and places them in the project

### Why

The current admin (`js/admin.js`) is limited:
- Only edits the `general` profile (hardcoded `PROFILES.general`)
- Only 5 editable sections (about, skills, projects, achievements, manage-profiles)
- No profile creation capability
- Data stored only in `localStorage` — lost on browser clear
- Embedded in `index.html` — not a dedicated page

---

## 2. Current Architecture

### File Structure
```
index.html              ← Main page (boot + selector + desktop + embedded admin)
js/profiles.js          ← Hardcoded PROFILES object + PROFILE_ORDER array
js/app.js               ← Rendering engine (boot, selector, desktop, windows)
js/admin.js             ← Admin logic (auth, editing, localStorage)
js/terminal.js          ← Terminal module
js/chat.js              ← Chat module
js/skytiles.js          ← Game module
css/main.css            ← All styles
```

### Data Flow (Current)
```
profiles.js (hardcoded) → PROFILES global → app.js reads → renders DOM
                                          → admin.js reads/writes → localStorage
```

### Current Admin Capabilities
| Section | What It Edits | Scope |
|---------|--------------|-------|
| Overview | Read-only stats | `general` only |
| Edit About | name, title, summary | `PROFILES.general.about` |
| Edit Skills | node names, pip levels | `PROFILES.general.skills` |
| Edit Projects | quest titles, descriptions | `PROFILES.general.quests` |
| Edit Achievements | titles, descriptions | `PROFILES.general.achievements` |
| Manage Profiles | publish/unpublish toggle | All profiles |

### Current Authentication
- SHA-256 hash of password "admin" checked client-side
- Hash: `8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918`
- Uses `crypto.subtle.digest()` — requires HTTPS or localhost

### Current Persistence
- `localStorage.setItem('devyanios_profiles', JSON.stringify(PROFILES))`
- On init: `Admin.loadFromStorage()` merges saved data into `PROFILES` via `Object.assign()`

---

## 3. Target Architecture

### File Structure (After Migration)
```
index.html              ← Main site (boot + selector + desktop)
admin.html              ← NEW: Standalone admin page
css/main.css            ← Main site styles
css/admin.css           ← NEW: Admin-specific styles
js/profiles.js          ← MODIFIED: Empty globals, no hardcoded data
js/dataloader.js        ← NEW: CSV+JSON fetch/parse/export engine
js/admin.js             ← REWRITTEN: Full CRUD, profile-scoped
js/chatbot.js           ← NEW: Gemini AI integration + chat UI
js/app.js               ← MODIFIED: Async init via DataLoader
js/terminal.js          ← Unchanged
js/chat.js              ← Unchanged
js/skytiles.js          ← Unchanged
data/config.json        ← NEW: Profile order, API key, admin hash
data/profiles.csv       ← NEW: Master CSV (flat profile fields)
data/general.json       ← NEW: Nested data for general profile
data/gaming.json        ← NEW: Nested data for gaming profile
data/speedcubing.json   ← NEW: Nested data for speedcubing profile
```

### Data Flow (Target)
```
data/config.json ──┐
data/profiles.csv ─┤→ DataLoader.loadAll() → PROFILES + PROFILE_ORDER globals
data/{id}.json ────┘                        ↓
                                    app.js renders (unchanged)
                                            ↓
                                    admin.js reads/writes in-memory
                                            ↓
                                    Export → downloads CSV + JSON files
                                            ↓
                                    User places in data/ folder
```

---

## 4. Data Architecture — CSV + JSON

### 4.1 Master CSV: `data/profiles.csv`

**Format:** Key-value rows — `profile_id,field,value`

Each profile's flat fields are stored as individual rows. JSON-serializable values (like arrays) are stored as JSON strings in the value column.

```csv
profile_id,field,value
general,id,general
general,name,Crate
general,icon,fa-briefcase
general,badge,Live
general,badgeClass,live
general,tagline,"Fullstack Developer · AI Architect · SAP Solutions SME"
general,wallpaper,"linear-gradient(135deg,#0a0e17 0%,#111827 50%,#0a0e17 100%)"
general,comingSoon,false
general,cardDeloitte,true
general,teaser,
general,about_name,Devyani P. Kumar
general,about_title,Senior Developer
general,about_summary,"Fullstack engineer and AI architect specializing in..."
general,about_attributes,"[{""key"":""LVL"",""val"":""26"",""desc"":""Level""},{""key"":""EXP"",""val"":""5.7yr"",""desc"":""Experience""},{""key"":""RANK"",""val"":""Sr Dev"",""desc"":""Deloitte""},{""key"":""PROMO"",""val"":""2"",""desc"":""Promotions""},{""key"":""PROJ"",""val"":""14+"",""desc"":""Projects""},{""key"":""CLASS"",""val"":""Arch"",""desc"":""Architect""}]"
gaming,id,gaming
gaming,name,Gaming Profile
gaming,icon,fa-gamepad
gaming,badge,Coming Soon
gaming,badgeClass,soon
gaming,tagline,"Game Developer · 5-year portfolio · Panda3D / PyOpenGL"
gaming,wallpaper,"linear-gradient(135deg,#0a0e17 0%,#1a0a2e 50%,#0a0e17 100%)"
gaming,comingSoon,true
gaming,cardDeloitte,false
gaming,teaser,"Panda3D, PyOpenGL, 2D/3D game design, open-source modding, AR/VR — full gaming portfolio coming soon!"
speedcubing,id,speedcubing
speedcubing,name,Speedcubing
speedcubing,icon,fa-cube
speedcubing,badge,Coming Soon
speedcubing,badgeClass,soon
speedcubing,tagline,"Rubik's Cube enthusiast · CUBE DEALT optimizer"
speedcubing,wallpaper,"linear-gradient(135deg,#0a0e17 0%,#0a1e17 50%,#0a0e17 100%)"
speedcubing,comingSoon,true
speedcubing,cardDeloitte,false
speedcubing,teaser,"Speedcubing journey, CUBE DEALT optimizer (TensorFlow + evolutionary algorithms), competition records, and solver tools — coming soon!"
```

**CSV Field Mapping:**

| CSV field | Maps to | Type |
|-----------|---------|------|
| `id` | `PROFILES[id].id` | string |
| `name` | `PROFILES[id].name` | string |
| `icon` | `PROFILES[id].icon` | string (FA class) |
| `badge` | `PROFILES[id].badge` | string |
| `badgeClass` | `PROFILES[id].badgeClass` | string |
| `tagline` | `PROFILES[id].tagline` | string |
| `wallpaper` | `PROFILES[id].wallpaper` | string (CSS gradient) |
| `comingSoon` | `PROFILES[id].comingSoon` | boolean (parse "true"/"false") |
| `cardDeloitte` | `PROFILES[id].cardDeloitte` | boolean |
| `teaser` | `PROFILES[id].teaser` | string |
| `about_name` | `PROFILES[id].about.name` | string |
| `about_title` | `PROFILES[id].about.title` | string |
| `about_summary` | `PROFILES[id].about.summary` | string |
| `about_attributes` | `PROFILES[id].about.attributes` | JSON string → array |

### 4.2 Per-Profile JSON: `data/{profile_id}.json`

Complex nested sections that don't fit flat CSV.

**Structure:**
```json
{
  "stats": [
    {
      "name": "SAP Solutions",
      "value": 95,
      "color": "blue",
      "icon": "fa-gears",
      "projects": ["IBMSW", "HPI", "IBMHW", "KONIKA MINOLTA", "FARO", "ROGERS", "DTNA", "Kelloggs"]
    }
  ],
  "skills": [
    {
      "branch": "SAP & Enterprise",
      "hdrClass": "ent",
      "icon": "fa-building",
      "nodes": [
        { "name": "SAP CPQ", "pips": 5, "icon": "fa-gears" }
      ]
    }
  ],
  "questTabs": ["SAP Products", "GenAI", "Impact", "College"],
  "quests": {
    "SAP Products": [
      {
        "title": "HPI",
        "date": "2024 – 2025",
        "status": "done",
        "icon": "fa-print",
        "logo": "assets/logos/hp.svg",
        "desc": "1.5 years: Multi-country pricing engine...",
        "tags": ["CPQ", "Microservices", "Pricing"],
        "bar": 100,
        "barColor": "green",
        "role": "Senior Developer",
        "timeline": [
          { "phase": "Requirements & Scoping", "detail": "Analyzed multi-country pricing rules..." }
        ]
      }
    ]
  },
  "achievements": [
    {
      "title": "Double Promotion",
      "desc": "🚀 Joined as Analyst...",
      "icon": "fa-arrow-up",
      "rarity": "legendary",
      "unlocked": true
    }
  ],
  "inventory": [
    { "name": "Python", "icon": "devicon-python-plain", "rarity": "legendary" }
  ],
  "desktopIcons": [
    { "id": "skills", "label": "Skill Tree", "icon": "fa-sitemap", "color": "#06b6d4" }
  ]
}
```

**For coming-soon profiles** (`gaming.json`, `speedcubing.json`), the file is minimal or empty:
```json
{}
```

### 4.3 Config: `data/config.json`

```json
{
  "profileOrder": ["general", "gaming", "speedcubing"],
  "geminiApiKey": "",
  "adminHash": "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"
}
```

---

## 5. Phase 1 — Data Layer Infrastructure

> **Goal:** Migrate from hardcoded `profiles.js` to CSV+JSON data files loaded at runtime.  
> **Dependencies:** None — start immediately.  
> **Deliverables:** `data/` directory with seed files, `js/dataloader.js`, refactored `profiles.js` and `app.js`.

### Step 1: Create `data/` Directory and Seed Files

**Task:** Extract data from current `js/profiles.js` into CSV + JSON files.

1. Create `data/` directory
2. Generate `data/profiles.csv` — extract all flat fields from each profile in `PROFILES`
3. Generate `data/general.json` — extract `stats`, `skills`, `questTabs`, `quests`, `achievements`, `inventory`, `desktopIcons` from `PROFILES.general`
4. Generate `data/gaming.json` — empty `{}` (coming-soon profile with no nested data)
5. Generate `data/speedcubing.json` — empty `{}` (coming-soon profile with no nested data)
6. Create `data/config.json` with `profileOrder`, empty `geminiApiKey`, and `adminHash`

**Validation:** Running a quick script to parse CSV + JSON and reconstruct the `PROFILES` object should produce identical data to the current hardcoded version.

### Step 2: Create `js/dataloader.js` — CSV+JSON Loader

**Module:** `DataLoader` (IIFE pattern, matching existing codebase conventions)

```javascript
const DataLoader = (() => {
  // Public API:
  //   DataLoader.loadAll()          → fetches config + CSV + JSONs, populates PROFILES + PROFILE_ORDER
  //   DataLoader.exportCSV()        → returns CSV string from current PROFILES
  //   DataLoader.exportJSON(id)     → returns JSON string for given profile
  //   DataLoader.exportConfig()     → returns config JSON string
  //   DataLoader.downloadFile(name, content, type) → triggers browser download
})();
```

**CSV Parser Requirements:**
- Split by newlines (handle `\r\n` and `\n`)
- Split by commas, respecting quoted values (values containing commas or newlines are wrapped in double-quotes)
- Double-quote escaping: `""` inside quoted value → `"`
- Skip empty lines and header row
- No external libraries

**CSV → PROFILES Mapping Logic:**
```
For each row (profile_id, field, value):
  1. Ensure PROFILES[profile_id] exists (create empty object if not)
  2. If field contains '_' (e.g., about_name):
     - Split on first '_' → parent='about', child='name'
     - Ensure PROFILES[profile_id][parent] exists
     - Set PROFILES[profile_id][parent][child] = parseValue(value)
  3. Else:
     - Set PROFILES[profile_id][field] = parseValue(value)

parseValue(val):
  - "true" → true
  - "false" → false
  - Numeric string → number
  - Starts with '[' or '{' → JSON.parse(val)
  - Otherwise → string
```

**JSON Merge Logic:**
```
For each profileId in config.profileOrder:
  Fetch data/{profileId}.json
  Merge all top-level keys into PROFILES[profileId]
```

**Error Handling:**
- If `config.json` fails → show error screen, stop
- If `profiles.csv` fails → show error screen, stop
- If individual `{id}.json` fails → warn in console, profile may be sparse (coming-soon profiles)

### Step 3: Refactor `js/profiles.js`

**Before:**
```javascript
const PROFILES = { general: { ... }, gaming: { ... }, speedcubing: { ... } };
const PROFILE_ORDER = ['general', 'gaming', 'speedcubing'];
```

**After:**
```javascript
/* profiles.js — Profile Data Store (loaded by dataloader.js) */
let PROFILES = {};
let PROFILE_ORDER = [];
```

**Important:** Change `const` → `let` so `DataLoader` can assign values.

### Step 4: Refactor `js/app.js` — Async Init

**Current init (synchronous):**
```javascript
document.addEventListener('DOMContentLoaded', () => { App.init(); });
```

**Target init (async):**
```javascript
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await DataLoader.loadAll();
    App.init();
  } catch (err) {
    document.getElementById('boot-status').textContent = 'Error loading profile data';
    console.error('DataLoader failed:', err);
  }
});
```

**Script load order in `index.html`:**
```html
<script src="js/profiles.js"></script>       <!-- Empty globals -->
<script src="js/dataloader.js"></script>     <!-- NEW: CSV+JSON loader -->
<script src="js/terminal.js"></script>
<script src="js/chat.js"></script>
<script src="js/skytiles.js?v=4"></script>
<script src="js/admin.js"></script>
<script src="js/app.js"></script>
```

**Note:** Requires serving via HTTP (localhost or hosted). `file://` protocol blocks `fetch()`. Use `python -m http.server 8000` or VS Code Live Server for local dev.

---

## 6. Phase 2 — Admin Page Foundation

> **Goal:** Create the standalone admin page with auth and 3-column layout.  
> **Dependencies:** None (can run parallel with Phase 1).  
> **Deliverables:** `admin.html`, `css/admin.css`.

### Step 5: Create `admin.html`

**Structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Devyani_pOS — Admin Dashboard</title>
  <link rel="stylesheet" href="css/admin.css">
  <link href="[Google Fonts - same as main]" rel="stylesheet">
  <link rel="stylesheet" href="[Font Awesome CDN]">
  <link rel="stylesheet" href="[Devicons CDN]">
</head>
<body>
  <!-- Auth Modal (shown by default) -->
  <div id="auth-screen">
    <div class="auth-box">
      <h2><i class="fas fa-shield-alt"></i> Admin Authentication</h2>
      <input type="password" id="admin-pass" placeholder="Password" autocomplete="off">
      <button class="btn-primary" id="admin-submit">Authenticate</button>
      <p class="auth-error hidden" id="admin-error">Invalid credentials.</p>
    </div>
  </div>

  <!-- Admin Dashboard (hidden until authenticated) -->
  <div id="admin-dashboard" class="hidden">
    <!-- Top Bar -->
    <header class="admin-topbar">
      <div class="admin-topbar-left">
        <i class="fas fa-shield-alt"></i>
        <strong>Devyani_pOS Admin</strong>
        <!-- Profile Selector Dropdown -->
        <select id="profile-select" class="profile-dropdown"></select>
      </div>
      <div class="admin-topbar-right">
        <button class="btn-secondary btn-sm" id="export-btn">
          <i class="fas fa-download"></i> Export
        </button>
        <a href="index.html" class="btn-secondary btn-sm">
          <i class="fas fa-arrow-left"></i> Back to Site
        </a>
      </div>
    </header>

    <!-- 3-Column Layout -->
    <div class="admin-layout">
      <nav class="admin-sidebar" id="admin-sidebar"></nav>
      <main class="admin-main" id="admin-main"></main>
      <aside class="admin-chatbot" id="admin-chatbot">
        <!-- AI chatbot panel (collapsible) -->
      </aside>
    </div>
  </div>

  <script src="js/profiles.js"></script>
  <script src="js/dataloader.js"></script>
  <script src="js/chatbot.js"></script>
  <script src="js/admin.js"></script>
</body>
</html>
```

### Step 6: Create `css/admin.css`

**Must include:**
- `:root` CSS variables copied from `main.css` (identical theme)
- 3-column flex layout: sidebar `220px` | main `flex: 1` | chatbot `350px` collapsible
- All form styles: `.form-group`, `input`, `textarea`, `select`, `.btn-primary`, `.btn-secondary`
- Array editor styles: row items, add/remove/reorder buttons
- Toast notification styles
- Auth screen (centered modal)
- Responsive breakpoints:
  - `< 1024px`: chatbot panel collapses to floating button
  - `< 768px`: sidebar collapses to icon-only (50px)
  - `< 480px`: forms go single-column

**Reuse from current `main.css` admin styles:**
- `.admin-topbar`, `.admin-layout`, `.admin-sidebar`, `.sidebar-item`, `.admin-main`
- `.admin-section`, `.form-group`, `.stats-grid`, `.stat-card`
- `.admin-msg.success`, `.btn-primary`, `.btn-secondary`
- `.card`, `.tag`

---

## 7. Phase 3 — Core Admin: Profile-Scoped Editing

> **Goal:** Rewrite `admin.js` to support editing any profile, not just general.  
> **Dependencies:** Phases 1 + 2.  
> **Deliverables:** Rewritten `js/admin.js` with profile selector, expanded sidebar, array editor.

### Step 7: Rewrite `js/admin.js` — Architecture

**Module pattern (IIFE):**
```javascript
const Admin = (() => {
  let currentProfileKey = 'general';  // Active profile being edited
  let currentSection = 'overview';    // Active sidebar section
  let isDirty = false;                // Unsaved changes flag

  // Existing helpers to keep:
  //   sha256(msg), authenticate(pwd), esc(s), showMsg(id)

  // New: profile switching
  function switchProfile(key) {
    if (isDirty && !confirm('Unsaved changes. Switch anyway?')) return;
    currentProfileKey = key;
    isDirty = false;
    renderSidebar();
    renderMain();
  }

  // Current profile shorthand
  function P() { return PROFILES[currentProfileKey]; }

  return {
    init, authenticate, go, switchProfile,
    exportAll, exportCSV, exportJSON, importCSV, importJSON
  };
})();
```

**Key change:** Every editor function uses `P()` instead of `PROFILES.general`.

**Profile selector dropdown** in topbar — populated from `PROFILE_ORDER`:
```javascript
function renderProfileDropdown() {
  const select = document.getElementById('profile-select');
  select.innerHTML = PROFILE_ORDER.map(k =>
    `<option value="${k}" ${k === currentProfileKey ? 'selected' : ''}>
      ${esc(PROFILES[k].name)} ${PROFILES[k].comingSoon ? '(Draft)' : '(Live)'}
    </option>`
  ).join('');
  select.onchange = () => switchProfile(select.value);
}
```

### Step 8: Sidebar Navigation — 10 Sections

```javascript
const SIDEBAR_ITEMS = [
  { id: 'overview',           icon: 'fa-gauge-high',     label: 'Overview' },
  { id: 'profile-info',       icon: 'fa-id-card',        label: 'Profile Info' },
  { id: 'edit-about',         icon: 'fa-user-pen',       label: 'About' },
  { id: 'edit-stats',         icon: 'fa-chart-bar',      label: 'Stats' },
  { id: 'edit-skills',        icon: 'fa-sitemap',        label: 'Skills' },
  { id: 'edit-quests',        icon: 'fa-scroll',         label: 'Projects' },
  { id: 'edit-achievements',  icon: 'fa-trophy',         label: 'Achievements' },
  { id: 'edit-inventory',     icon: 'fa-boxes-stacked',  label: 'Inventory' },
  { id: 'edit-desktop-icons', icon: 'fa-desktop',        label: 'Desktop Icons' },
  { id: 'manage-profiles',    icon: 'fa-layer-group',    label: 'Manage Profiles' },
  { id: 'settings',           icon: 'fa-cog',            label: 'Settings' }
];
```

**Adaptive sections:** If `P().about` is undefined (e.g., gaming profile), show "Add About Section" button instead of the editor form. Same for stats, skills, quests, etc.

### Step 9: Reusable Array Editor Component

**Generic function signature:**
```javascript
function renderArrayEditor(options) {
  // options:
  //   containerId:  string — DOM element to render into
  //   items:        array — the data array to edit
  //   fields:       array of { key, label, type, options? }
  //                 type: 'text' | 'textarea' | 'number' | 'range' | 'select' | 'checkbox' | 'tags'
  //                 options: for 'select' type — [{value, label}]
  //   onSave:       function(updatedItems) — called when save is clicked
  //   itemTemplate: object — default values for a new row
  //   nested?:      object — { key, editor } for nested arrays (e.g., timeline within quests)
}
```

**Features:**
- Renders each item as a card with form fields
- **Add Row** button at bottom → appends `itemTemplate` clone
- **Remove Row** (X button) per item → confirms, removes from array
- **Reorder** (↑↓ buttons) per item → swaps positions
- **Save** button → collects all field values, calls `onSave(updatedItems)`
- **Dirty state** → sets `isDirty = true` on any field change

**Reuse for:**
| Section | Items | Fields per Item |
|---------|-------|-----------------|
| About Attributes | `about.attributes` | key, val, desc |
| Stats | `stats` | name, value(range), color(select), icon, projects(tags) |
| Skill Branches | `skills` | branch, hdrClass(select), icon |
| Skill Nodes | `skills[i].nodes` | name, pips(select 1-5), icon |
| Quest Tabs | `questTabs` | tab name (string list) |
| Quests per Tab | `quests[tab]` | title, date, status(select), icon, logo, desc, tags, bar(range), barColor(select), role |
| Timeline | `quests[tab][i].timeline` | phase, detail |
| Achievements | `achievements` | title, desc(textarea), icon, rarity(select), unlocked(checkbox) |
| Inventory | `inventory` | name, icon, rarity(select) |
| Desktop Icons | `desktopIcons` | id, label, icon, color |

---

## 8. Phase 4 — Section Editors

> **Goal:** Build all 8 section editors using the ArrayEditor component.  
> **Dependencies:** Step 9 (ArrayEditor).  
> **All steps in Phase 4 are independent and can be built in parallel.**

### Step 10: Profile Info Editor

**Edits flat fields stored in CSV.**

| Field | Input Type | Notes |
|-------|-----------|-------|
| `id` | text (read-only after creation) | Slug, no spaces |
| `name` | text | Display name |
| `icon` | text + live FA preview | e.g., `fa-briefcase` → shows icon |
| `badge` | text | e.g., "Live", "Coming Soon" |
| `badgeClass` | select: `live`, `soon` | CSS class |
| `tagline` | text | One-liner |
| `wallpaper` | textarea | CSS gradient string |
| `cardDeloitte` | checkbox | Show Deloitte badge on card |
| `teaser` | textarea | Description for coming-soon state |

### Step 11: About Editor

**Fields:** `about.name`, `about.title`, `about.summary` (textarea), `about.attributes` (ArrayEditor)

**AI Integration:**
- "Generate Summary" button next to summary textarea
- Sends current bullet points / brief text to Chatbot in "Generate About Summary" mode
- Response auto-fills summary textarea
- User can edit before saving

### Step 12: Stats Editor

**ArrayEditor** for `stats[]`:
- `name`: text
- `value`: range slider (0–100) with numeric display
- `color`: select dropdown (`blue`, `pink`, `green`, `gold`, `cyan`, `orange`)
- `icon`: text (FA/Devicon class)
- `projects`: tag input (type + Enter to add tags, X to remove)

**Template for new stat:**
```json
{ "name": "", "value": 50, "color": "blue", "icon": "fa-star", "projects": [] }
```

### Step 13: Skills Editor

**Two-level ArrayEditor:**

**Level 1 — Branches:**
- `branch`: text (e.g., "SAP & Enterprise")
- `hdrClass`: select (`ent`, `ai`, `dsa`, `fs`, `cloud`, `gd`)
- `icon`: text (FA class)

**Level 2 — Nodes (nested within each branch):**
- `name`: text (e.g., "SAP CPQ")
- `pips`: select (1, 2, 3, 4, 5)
- `icon`: text (FA/Devicon class)

**AI Integration:**
- "Suggest Skills" button → opens chatbot in skill-suggestion mode
- Sends a description/resume → returns suggested branches + nodes with pips
- "Apply" merges into current skills array

### Step 14: Projects/Quests Editor (Most Complex)

**Three levels:**

**Level 1 — Tab Management:**
- List of `questTabs[]` with add/remove/rename
- Each tab is a collapsible section

**Level 2 — Quests per Tab (ArrayEditor for `quests[tab]`):**

| Field | Type | Notes |
|-------|------|-------|
| `title` | text | Project name |
| `date` | text | e.g., "2024 – 2025" |
| `status` | select | `done`, `ongoing` |
| `icon` | text | FA class |
| `logo` | text | URL path (e.g., `assets/logos/hp.svg`) |
| `desc` | textarea | Project description |
| `tags` | tags input | Technology tags |
| `bar` | range (0–100) | Completion percentage |
| `barColor` | select | `green`, `blue`, `gold` |
| `role` | text | Job title |

**Level 3 — Timeline (nested ArrayEditor for `quests[tab][i].timeline`):**
- `phase`: text (e.g., "Requirements & Scoping")
- `detail`: textarea (e.g., "Analyzed multi-country pricing rules...")

**AI Integration (3 buttons per quest):**
1. **"Draft Milestones"** → sends project desc → returns `timeline[]` array
2. **"Generate Description"** → sends brief notes → returns polished `desc`
3. **"Map Tags"** → sends description → returns `tags[]` array

### Step 15: Achievements Editor

**ArrayEditor** for `achievements[]`:

| Field | Type |
|-------|------|
| `title` | text |
| `desc` | textarea |
| `icon` | text (FA class) |
| `rarity` | select: `legendary`, `epic`, `elite` |
| `unlocked` | checkbox |

**AI Integration:**
- "Generate Achievement" → sends accomplishment description → returns formatted `{title, desc, icon, rarity}`

### Step 16: Inventory Editor

**ArrayEditor** for `inventory[]`:

| Field | Type |
|-------|------|
| `name` | text |
| `icon` | text (FA/Devicon class) |
| `rarity` | select: `legendary`, `epic`, `elite` |

### Step 17: Desktop Icons Editor

**ArrayEditor** for `desktopIcons[]`:

| Field | Type | Notes |
|-------|------|-------|
| `id` | select: `skills`, `quests`, `achievements`, `inventory`, `chat`, `terminal`, `skytiles` | Which app window to open |
| `label` | text | Display name |
| `icon` | text | FA class |
| `color` | color picker or text | Hex color (e.g., `#06b6d4`) |

---

## 9. Phase 5 — Profile Creation & Management

> **Goal:** Enable creating new profiles and managing existing ones.  
> **Dependencies:** Phase 3.  
> **Deliverables:** Create profile flow, manage profiles panel.

### Step 18: "Create New Profile" Flow

**Trigger:** "New Profile" button at top of sidebar or in overview.

**Form (minimal — just enough to create the shell):**
- `id`: text (slug — lowercase, no spaces, no duplicates). Auto-generated from name.
- `name`: text (display name)
- `icon`: text (FA icon class)
- `tagline`: text

**On submit:**
```javascript
PROFILES[newId] = {
  id: newId,
  name: name,
  icon: icon,
  badge: 'Coming Soon',
  badgeClass: 'soon',
  tagline: tagline,
  wallpaper: 'linear-gradient(135deg,#0a0e17 0%,#111827 50%,#0a0e17 100%)',
  comingSoon: true,
  cardDeloitte: false,
  teaser: ''
};
PROFILE_ORDER.push(newId);
```

- Switches to new profile
- All section editors show "Add" state (no data yet)
- User builds the profile section by section

### Step 19: Manage Profiles Panel

**For each profile in PROFILE_ORDER:**

| Action | Button | Behavior |
|--------|--------|----------|
| **Publish/Unpublish** | Toggle button | Flips `comingSoon`, updates `badge`/`badgeClass` |
| **Reorder Up** | ↑ arrow | Swaps with previous in `PROFILE_ORDER` |
| **Reorder Down** | ↓ arrow | Swaps with next in `PROFILE_ORDER` |
| **Duplicate** | Copy button | Deep clones profile with new ID (prompt for new name) |
| **Delete** | Trash button | Confirmation modal → removes from `PROFILES` and `PROFILE_ORDER` |

**Publish validation:** Before publishing (removing `comingSoon`), check that the profile has at least:
- `about` section with `name` and `title`
- At least one `desktopIcon`

If not, show warning: "This profile is missing required sections. Publish anyway?"

---

## 10. Phase 6 — AI Chatbot Sidebar (Gemini)

> **Goal:** Integrate Gemini API for AI-assisted profile data generation.  
> **Dependencies:** None (independent module). Integrates with Phase 4 editors.  
> **Deliverables:** `js/chatbot.js`, chatbot UI in admin sidebar.

### Step 20: Create `js/chatbot.js` — Gemini Integration

**Module pattern:**
```javascript
const Chatbot = (() => {
  let apiKey = '';
  let currentMode = 'about-summary';
  let messages = [];  // Chat history

  function init(containerEl) { /* render UI */ }
  function setApiKey(key) { apiKey = key; }
  function setMode(mode) { currentMode = mode; }
  async function send(userInput) { /* call Gemini, return response */ }

  return { init, setApiKey, setMode, send };
})();
```

**Gemini API call:**
```javascript
async function callGemini(systemPrompt, userContent) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt + '\n\nUser input:\n' + userContent }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      })
    }
  );
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
}
```

**API key source:** Loaded from `data/config.json` via `DataLoader`. Editable in admin Settings section.

### Step 21: Chat Capabilities — 7 Modes

Each mode has a **system prompt** and **expected output format**:

#### Mode 1: Generate About Summary
```
System: You are a portfolio content writer. Given bullet points about a professional,
write a polished 2-3 sentence summary paragraph for their portfolio "About Me" section.
Keep it professional but engaging. Do NOT use first person.
Output: Plain text paragraph.
```

#### Mode 2: Draft Milestones
```
System: You are a project timeline assistant. Given a project name and brief description,
generate 3-5 milestone phases. Output ONLY a JSON array of objects with "phase" and "detail" keys.
Output: JSON array of {phase: string, detail: string}
```

#### Mode 3: Suggest Skills
```
System: You are a skills taxonomy assistant for a developer portfolio. Given a description
of someone's experience, suggest skill branches with nodes and mastery levels (1-5 pips).
Output ONLY a JSON array of branches, each with "branch", "hdrClass", "icon", and "nodes" array.
Each node has "name", "pips" (1-5), and "icon" (Font Awesome class).
Output: JSON array matching the skills schema.
```

#### Mode 4: Generate Achievements
```
System: You are a gamified portfolio assistant. Given an accomplishment description,
generate a trophy-style achievement. Output ONLY a JSON object with "title" (short catchy name),
"desc" (1-2 sentences with an emoji prefix), "icon" (Font Awesome class suggestion),
and "rarity" (one of: legendary, epic, elite).
Output: JSON object matching achievement schema.
```

#### Mode 5: Map Tags
```
System: You are a technology tag extractor. Given a project description, extract relevant
technology/skill tags (short 1-2 word labels). Output ONLY a JSON array of strings.
Output: JSON array of strings
```

#### Mode 6: Generate Project Description
```
System: You are a portfolio content writer. Given brief project notes, write a polished
1-2 sentence project description. Be specific about technologies and impact.
Output: Plain text.
```

#### Mode 7: Verify Profile
```
System: You are a portfolio data validator. Given a complete profile JSON object, check for:
- Missing required fields
- Empty sections that should have content
- Inconsistent data (e.g., project status "done" but bar < 100)
- Suggestions for improvement
Output a structured report as markdown.
Output: Markdown text
```

### Step 22: Chat UX

**Layout (inside `#admin-chatbot` panel):**
```
┌──────────────────────┐
│ [Mode Dropdown ▾]    │
│ [Toggle ◀]           │
├──────────────────────┤
│                      │
│  Chat Messages       │
│  (scrollable)        │
│                      │
│  [User bubble]       │
│  [AI bubble]         │
│    [Apply to Editor] │
│                      │
├──────────────────────┤
│ [Input textarea]     │
│ [Send button]        │
└──────────────────────┘
```

**"Apply to Editor" button behavior:**
- Parses the AI response (JSON for structured modes, text for text modes)
- Depending on current mode + current admin section:
  - About summary → fills summary textarea
  - Milestones → appends timeline items to current quest
  - Skills → replaces/merges skill branches
  - Achievements → appends achievement item
  - Tags → appends to current quest's tags
  - Description → fills quest desc textarea
  - Verify → displays report (no auto-fill)

**Error states:**
- No API key → show "Configure API key in Settings" message with link
- API error → show error message with status code
- Loading → show spinner, disable send button

---

## 11. Phase 7 — Data Export/Import

> **Goal:** Enable exporting edited data as files and importing data from files.  
> **Dependencies:** Phase 1 (DataLoader export functions).  
> **Can run parallel with Phases 4, 5, 6.**

### Step 23: Export System

**Export functions in `DataLoader`:**

```javascript
// Generate CSV string from current PROFILES
function exportCSV() {
  let csv = 'profile_id,field,value\n';
  const flatFields = ['id','name','icon','badge','badgeClass','tagline',
                       'wallpaper','comingSoon','cardDeloitte','teaser'];
  const aboutFields = ['name','title','summary','attributes'];

  for (const key of PROFILE_ORDER) {
    const p = PROFILES[key];
    for (const f of flatFields) {
      csv += `${key},${f},${csvEscape(p[f])}\n`;
    }
    if (p.about) {
      for (const f of aboutFields) {
        const val = f === 'attributes' ? JSON.stringify(p.about[f]) : p.about[f];
        csv += `${key},about_${f},${csvEscape(val)}\n`;
      }
    }
  }
  return csv;
}

// Generate JSON string for a profile's nested data
function exportJSON(profileId) {
  const p = PROFILES[profileId];
  const nested = {};
  for (const key of ['stats','skills','questTabs','quests','achievements','inventory','desktopIcons']) {
    if (p[key]) nested[key] = p[key];
  }
  return JSON.stringify(nested, null, 2);
}

// Generate config JSON
function exportConfig() {
  return JSON.stringify({
    profileOrder: PROFILE_ORDER,
    geminiApiKey: '',  // Excluded for security
    adminHash: CONFIG.adminHash
  }, null, 2);
}
```

**Download trigger:**
```javascript
function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
```

**Export buttons in admin UI:**
| Button | Downloads |
|--------|-----------|
| "Export All" | `profiles.csv` + `config.json` + one `{id}.json` per profile |
| "Export This Profile" | Single `{currentProfileKey}.json` |
| "Export CSV" | Just `profiles.csv` |
| "Export Config" | Just `config.json` |

### Step 24: Import System

**Import flow:**
1. User clicks "Import" → file picker opens (accept `.csv` or `.json`)
2. File is read via `FileReader`
3. **For CSV:** Parse rows → validate fields → preview changes → confirm → merge into PROFILES
4. **For JSON:** Detect if it's config or profile → validate structure → preview → confirm → merge
5. Show toast: "Imported successfully" or "Import failed: [reason]"

**Validation rules:**
- CSV: every row must have 3 columns, `profile_id` must be non-empty
- Profile JSON: must be an object with known keys (stats, skills, etc.)
- Config JSON: must have `profileOrder` array
- No duplicate profile IDs (unless user chooses "overwrite")

### Step 25: Admin Settings Section

**Settings form fields:**
- **Gemini API Key:** password input + show/hide toggle. Stored in config.
- **Admin Password:** "Change Password" button → prompts for new password → SHA-256 hashes it → stores in config.
- **Export All:** button (shortcut to export all files)
- **Import:** file picker (shortcut to import)
- **Reset:** "Reset to Default" button → clears localStorage, reloads from original data files

---

## 12. Phase 8 — Integration & Polish

> **Goal:** Connect admin page to main site, add UX polish.  
> **Dependencies:** All prior phases.

### Step 26: Update `index.html`

**Changes:**
1. Add `<script src="js/dataloader.js"></script>` after `profiles.js`
2. Change admin button behavior — navigate to `admin.html`:
   ```javascript
   document.getElementById('admin-login-btn').onclick = () => {
     window.location.href = 'admin.html';
   };
   ```
3. Remove or keep `#admin-modal` and `#admin-desktop` divs:
   - **Option A (recommended):** Remove them and the inline admin code — admin is fully in `admin.html`
   - **Option B:** Keep for quick edits, link dedicated page for full admin

### Step 27: UX Polish

1. **Unsaved changes warning:**
   ```javascript
   window.addEventListener('beforeunload', (e) => {
     if (isDirty) { e.preventDefault(); e.returnValue = ''; }
   });
   ```

2. **Toast notifications:** Reuse the toast pattern from main app:
   ```javascript
   function showToast(message, type = 'success') {
     // type: 'success' (green), 'error' (red), 'info' (blue)
     const toast = document.getElementById('admin-toast');
     toast.textContent = message;
     toast.className = `toast ${type}`;
     toast.classList.remove('hidden');
     setTimeout(() => toast.classList.add('hidden'), 3000);
   }
   ```

3. **Ctrl+S shortcut:**
   ```javascript
   document.addEventListener('keydown', (e) => {
     if ((e.ctrlKey || e.metaKey) && e.key === 's') {
       e.preventDefault();
       saveCurrentSection();
     }
   });
   ```

4. **Loading states:** Show spinner overlay during `DataLoader.loadAll()` and Gemini API calls.

### Step 28: Validation

| Check | When | Error |
|-------|------|-------|
| Profile ID non-empty | Create profile | "Profile ID is required" |
| Profile ID no spaces | Create profile | "Profile ID cannot contain spaces" |
| Profile ID unique | Create profile | "Profile ID already exists" |
| Name non-empty | Save profile info | "Profile name is required" |
| Pips 1-5 | Save skills | "Pip level must be 1-5" |
| Bar 0-100 | Save quests | "Completion must be 0-100" |
| Stat value 0-100 | Save stats | "Stat value must be 0-100" |
| XSS prevention | All rendering | Use `esc()` on all user content |
| Gemini key format | Settings save | "API key appears invalid" |

---

## 13. File Inventory

### Files to CREATE

| File | Purpose | Phase |
|------|---------|-------|
| `data/profiles.csv` | Master CSV: flat profile fields | 1 |
| `data/general.json` | Nested data for general profile | 1 |
| `data/gaming.json` | Nested data for gaming profile (sparse) | 1 |
| `data/speedcubing.json` | Nested data for speedcubing profile (sparse) | 1 |
| `data/config.json` | Profile order, API key, admin hash | 1 |
| `js/dataloader.js` | CSV+JSON fetch, parse, export engine | 1 |
| `admin.html` | Standalone admin page | 2 |
| `css/admin.css` | Admin-specific styles (dark theme) | 2 |
| `js/chatbot.js` | Gemini API integration + chat UI | 6 |

### Files to MODIFY

| File | Changes | Phase |
|------|---------|-------|
| `js/profiles.js` | Replace hardcoded data with `let PROFILES = {}; let PROFILE_ORDER = [];` | 1 |
| `js/app.js` | Async init: `await DataLoader.loadAll()` before `App.init()` | 1 |
| `js/admin.js` | Full rewrite: profile-scoped CRUD, ArrayEditor, 10 sections | 3-5 |
| `index.html` | Add `dataloader.js` script, update admin button, deprecate inline admin | 8 |

### Files UNCHANGED

| File | Reason |
|------|--------|
| `js/terminal.js` | Independent module, no data changes |
| `js/chat.js` | Independent module, reads from PROFILES via existing pattern |
| `js/skytiles.js` | Game module, no data dependency |
| `css/main.css` | Main site styles stay as-is (admin has own CSS) |
| `404.html` | No changes needed |
| All `.txt` files | Reference content only |

---

## 14. Data Schemas

### Full Profile Object (After CSV+JSON Merge)

```typescript
interface Profile {
  // From CSV (flat fields)
  id: string;                    // e.g., "general"
  name: string;                  // e.g., "Crate"
  icon: string;                  // FA class, e.g., "fa-briefcase"
  badge: string;                 // "Live" or "Coming Soon"
  badgeClass: string;            // "live" or "soon"
  tagline: string;               // One-liner description
  wallpaper: string;             // CSS gradient
  comingSoon: boolean;           // true = draft, false = published
  cardDeloitte: boolean;         // Show Deloitte badge
  teaser: string;                // Description for coming-soon view

  // From CSV (about sub-fields)
  about?: {
    name: string;                // Display name
    title: string;               // Job title
    summary: string;             // Biography paragraph
    attributes: Attribute[];     // Quick-stat chips
  };

  // From JSON (nested sections)
  stats?: Stat[];
  skills?: SkillBranch[];
  questTabs?: string[];
  quests?: Record<string, Quest[]>;
  achievements?: Achievement[];
  inventory?: InventoryItem[];
  desktopIcons?: DesktopIcon[];
}

interface Attribute {
  key: string;    // e.g., "LVL"
  val: string;    // e.g., "26"
  desc: string;   // e.g., "Level"
}

interface Stat {
  name: string;           // e.g., "SAP Solutions"
  value: number;          // 0-100
  color: string;          // "blue" | "pink" | "green" | "gold" | "cyan" | "orange"
  icon: string;           // FA/Devicon class
  projects: string[];     // Project names tied to this stat
}

interface SkillBranch {
  branch: string;         // e.g., "SAP & Enterprise"
  hdrClass: string;       // CSS class: "ent" | "ai" | "dsa" | "fs" | "cloud" | "gd"
  icon: string;           // FA class
  nodes: SkillNode[];
}

interface SkillNode {
  name: string;           // e.g., "SAP CPQ"
  pips: number;           // 1-5 mastery level
  icon: string;           // FA/Devicon class
}

interface Quest {
  title: string;
  date: string;           // e.g., "2024 – 2025"
  status: string;         // "done" | "ongoing"
  icon: string;
  logo?: string;          // Image URL path
  desc: string;
  tags: string[];
  bar: number;            // 0-100 completion
  barColor: string;       // "green" | "blue" | "gold"
  role: string;           // Job title during project
  timeline: TimelinePhase[];
}

interface TimelinePhase {
  phase: string;          // e.g., "Requirements & Scoping"
  detail: string;         // Description of this phase
}

interface Achievement {
  title: string;
  desc: string;           // Emoji-prefixed description
  icon: string;           // FA class
  rarity: string;         // "legendary" | "epic" | "elite"
  unlocked: boolean;
}

interface InventoryItem {
  name: string;           // e.g., "Python"
  icon: string;           // FA/Devicon class
  rarity: string;         // "legendary" | "epic" | "elite"
}

interface DesktopIcon {
  id: string;             // "skills" | "quests" | "achievements" | "inventory" | "chat" | "terminal" | "skytiles"
  label: string;          // Display label
  icon: string;           // FA class
  color: string;          // Hex color
}
```

### Config Schema

```typescript
interface Config {
  profileOrder: string[];   // e.g., ["general", "gaming", "speedcubing"]
  geminiApiKey: string;     // Gemini API key (empty = unconfigured)
  adminHash: string;        // SHA-256 hash of admin password
}
```

---

## 15. Verification Checklist

### Phase 1 — Data Layer
- [ ] `data/` directory exists with all seed files
- [ ] `profiles.csv` contains all flat fields for all 3 profiles
- [ ] `general.json` contains all nested sections (stats, skills, quests, achievements, inventory, desktopIcons)
- [ ] `config.json` has correct profileOrder and adminHash
- [ ] `DataLoader.loadAll()` populates PROFILES identically to old hardcoded data
- [ ] Main site (`index.html`) renders identically after migration — boot, selector, desktop, all windows
- [ ] All Font Awesome icons render correctly
- [ ] Stats progress bars animate correctly
- [ ] Quest timeline expand/collapse works
- [ ] Achievement completion ring calculates correctly
- [ ] Coming-soon profiles show teaser text, not desktop

### Phase 2 — Admin Page
- [ ] `admin.html` loads with auth screen
- [ ] Enter "admin" → dashboard appears
- [ ] Wrong password → error message
- [ ] Dark theme matches main site
- [ ] 3-column layout: sidebar | main | chatbot
- [ ] Responsive: sidebar collapses at < 768px, chatbot at < 1024px

### Phase 3 — Core Admin
- [ ] Profile dropdown shows all profiles with (Live)/(Draft) labels
- [ ] Switching profiles reloads sidebar and main content
- [ ] Unsaved changes prompt when switching
- [ ] Sidebar shows all 10 sections + Settings
- [ ] Sections adapt for empty data (show "Add" vs "Edit")
- [ ] ArrayEditor: add row works, remove row works (with confirm), reorder works

### Phase 4 — Section Editors
- [ ] Profile Info: all fields editable, icon preview works
- [ ] About: name/title/summary editable, attributes ArrayEditor works
- [ ] Stats: ArrayEditor with range slider, color dropdown, tag input
- [ ] Skills: two-level editor (branches + nested nodes), pips dropdown
- [ ] Quests: three-level editor (tabs + quests + timeline), all fields
- [ ] Achievements: ArrayEditor with rarity dropdown, unlocked checkbox
- [ ] Inventory: ArrayEditor with icon and rarity
- [ ] Desktop Icons: id dropdown, label, icon, color

### Phase 5 — Profile Creation & Management
- [ ] "New Profile" creates shell with comingSoon=true
- [ ] Profile ID validation (non-empty, no spaces, unique)
- [ ] Manage: publish/unpublish updates badge + comingSoon
- [ ] Manage: reorder moves profile up/down in PROFILE_ORDER
- [ ] Manage: duplicate clones with new ID
- [ ] Manage: delete shows confirmation, removes profile

### Phase 6 — AI Chatbot
- [ ] Chatbot panel renders in sidebar
- [ ] Mode selector has all 7 modes
- [ ] API key missing → helpful error message with link to Settings
- [ ] Each mode generates appropriate structured output
- [ ] "Apply to Editor" correctly fills current section
- [ ] Loading spinner during API calls
- [ ] Panel collapses/expands via toggle button

### Phase 7 — Export/Import
- [ ] "Export All" downloads CSV + config + all JSONs
- [ ] "Export This Profile" downloads single JSON
- [ ] "Export CSV" downloads just profiles.csv
- [ ] Exported CSV re-imports correctly
- [ ] Exported JSON re-imports correctly
- [ ] Import validation catches: duplicate IDs, missing fields, malformed data
- [ ] Import preview shows changes before confirming

### Phase 8 — Integration
- [ ] `index.html` admin button goes to `admin.html`
- [ ] `dataloader.js` script tag added to `index.html`
- [ ] beforeunload fires on unsaved changes
- [ ] Ctrl+S saves current section
- [ ] Toast notifications appear for save/export/import/errors
- [ ] End-to-end: create profile in admin → export → place files → refresh main site → profile appears

---

## 16. Dependency Graph

```
Phase 1 (Data Layer)  ─────────┐
  Step 1: Seed data files       │
  Step 2: dataloader.js         │──→ Phase 3 (Core Admin) ──→ Phase 4 (Editors)
  Step 3: Refactor profiles.js  │      Step 7: admin.js          Steps 10-17
  Step 4: Refactor app.js       │      Step 8: Sidebar            (all parallel)
                                │      Step 9: ArrayEditor ────────────┘
Phase 2 (Admin Foundation) ────┘                │
  Step 5: admin.html                            ├──→ Phase 5 (Profile CRUD)
  Step 6: admin.css                             │      Steps 18-19
                                                │
Phase 6 (AI Chatbot) ──────────────────────────┘ (parallel with 4+5)
  Step 20: chatbot.js
  Step 21: 7 modes
  Step 22: Chat UX

Phase 7 (Export/Import) ────────── (parallel with 4+5+6, depends on Phase 1)
  Steps 23-25

Phase 8 (Polish) ──────────────── (depends on ALL above)
  Steps 26-28
```

**Parallelization opportunities:**
- Phase 1 ‖ Phase 2 (independent)
- Phase 4 steps 10-17 (all parallel)
- Phase 5 ‖ Phase 6 ‖ Phase 7 (all parallel after Phase 3)

---

## 17. Design Decisions Log

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Separate `admin.html` | Clean separation of concerns; admin logic doesn't bloat the main site |
| 2 | CSV + JSON hybrid data | CSV for flat fields (spreadsheet-editable), JSON for nested structures (natural fit) |
| 3 | Key-value CSV format | Flexible — adding new fields doesn't require new columns, just new rows |
| 4 | Gemini API for chatbot | Free tier available, user preference, stored in config.json |
| 5 | API key in config.json | User preference; excluded from export for security |
| 6 | Export/download workflow (no backend) | Static site — no server to save to. User downloads and places files manually |
| 7 | Collapsible chatbot sidebar | Always accessible but not blocking the editor |
| 8 | All sections editable for all profiles | Future-proofs for new profiles, not locked to general |
| 9 | `comingSoon: true` default for new profiles | Prevents incomplete profiles from going live |
| 10 | No external libraries | Vanilla JS only; matches existing codebase; simple CSV parser is sufficient |
| 11 | `let` for PROFILES/PROFILE_ORDER | Must be mutable for DataLoader and admin to modify |
| 12 | HTTP server required | `fetch()` doesn't work over `file://`; documented in setup instructions |
| 13 | Reuse `:root` CSS vars | Visual consistency between admin and main site |
| 14 | Inline admin deprecated | After admin.html is live, the embedded `#admin-desktop` in index.html can be removed |

---

## Appendix: Local Development Setup

```bash
# Navigate to project directory
cd c:\Users\devykumar\Downloads\myprofileos

# Start local HTTP server (required for fetch())
python -m http.server 8000

# Access main site
# http://localhost:8000/index.html

# Access admin page
# http://localhost:8000/admin.html

# Admin password: admin
```
