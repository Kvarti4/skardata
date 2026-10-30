'use strict';

const FIELDS = {
  D:  { label: 'Diameter',          sym: 'D',  unit: 'mm',       dec: 2 },
  Z:  { label: 'Skär',              sym: 'Z',  unit: '',         dec: 0 },
  Vc: { label: 'Skärhastighet',     sym: 'Vc', unit: 'm/min',    dec: 1 },
  f:  { label: 'Matning per varv',  sym: 'f',  unit: 'mm/varv',  dec: 3 },
  fz: { label: 'Matning per tand',  sym: 'fz', unit: 'mm/Z',     dec: 3 },
  n:  { label: 'Varvtal',           sym: 'n',  unit: 'varv/min', dec: 0 },
  Vf: { label: 'Matningshastighet', sym: 'Vf', unit: 'mm/min',   dec: 0 },
};

const TABS = {
  borr:  { layout: [['D'], ['Vc'], ['f'], ['n'], ['Vf']],       feed: 'f' },
  svarv: { layout: [['D'], ['Vc'], ['f'], ['n'], ['Vf']],       feed: 'f' },
  fras:  { layout: [['D', 'Z'], ['Vc'], ['fz'], ['n'], ['Vf']], feed: 'fz' },
};

const FORMULAS = {
  borr:  ['n = Vc · 1000 / (π · D)', 'Vc = π · D · n / 1000', 'Vf = f · n'],
  svarv: ['n = Vc · 1000 / (π · D)', 'Vc = π · D · n / 1000', 'Vf = f · n'],
  fras:  ['n = Vc · 1000 / (π · D)', 'Vc = π · D · n / 1000', 'Vf = fz · Z · n'],
};

const STORE_KEY = 'skardata-v1';
const TAB_ORDER = Object.keys(TABS);

let saved = load();
let active = TABS[saved.active] ? saved.active : 'borr';

function load() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(saved)); } catch {}
}

function state(tab) {
  if (!saved[tab]) saved[tab] = { values: { Z: 1 }, calc: [] };
  return saved[tab];
}

const parse = (s) => {
  const v = parseFloat(String(s).replace(',', '.'));
  return Number.isFinite(v) ? v : 0;
};
const fmt = (v, dec) => {
  if (!v || !Number.isFinite(v)) return '';
  return String(+v.toFixed(dec)).replace('.', ',');
};

// Recompute dependent values after `key` was edited. Returns keys that were computed.
function recompute(tab, key) {
  const v = state(tab).values;
  const feed = TABS[tab].feed;
  const teeth = tab === 'fras' ? (v.Z || 0) : 1;
  const D = v.D || 0;
  const out = [];

  const nFromVc = () => { v.n = D > 0 ? v.Vc * 1000 / (Math.PI * D) : 0; out.push('n'); };
  const VcFromN = () => { v.Vc = Math.PI * D * (v.n || 0) / 1000; out.push('Vc'); };
  const VfFromFeed = () => { v.Vf = (v[feed] || 0) * teeth * (v.n || 0); out.push('Vf'); };
  const feedFromVf = () => { const d = teeth * (v.n || 0); v[feed] = d > 0 ? (v.Vf || 0) / d : 0; out.push(feed); };

  switch (key) {
    case 'D':
      if (v.Vc) nFromVc(); else if (v.n) VcFromN();
      VfFromFeed();
      break;
    case 'Vc': nFromVc(); VfFromFeed(); break;
    case 'n':  VcFromN(); VfFromFeed(); break;
    case 'Vf': feedFromVf(); break;
    default:   VfFromFeed(); // f, fz, Z
  }
  return out;
}

const panel = document.getElementById('panel');
const tabButtons = [...document.querySelectorAll('.tabs button')];
const indicator = document.querySelector('.tab-indicator');

function card(key) {
  const f = FIELDS[key];
  const el = document.createElement('label');
  el.className = 'card';
  el.dataset.key = key;
  el.innerHTML = `
    <div class="label">${f.label} [<b>${f.sym}</b>]</div>
    <div class="line">
      <input class="value" inputmode="${key === 'Z' ? 'numeric' : 'decimal'}" placeholder="0" autocomplete="off">
      <span class="unit">${f.unit}</span>
    </div>`;
  return el;
}

function render() {
  const st = state(active);
  panel.innerHTML = '';
  for (const row of TABS[active].layout) {
    const wrap = row.length > 1 ? Object.assign(document.createElement('div'), { className: 'row' }) : panel;
    for (const key of row) wrap.appendChild(card(key));
    if (wrap !== panel) panel.appendChild(wrap);
  }
  refresh(null);

  panel.querySelectorAll('.value').forEach((input) => {
    const key = input.closest('.card').dataset.key;
    input.addEventListener('input', () => {
      st.values[key] = parse(input.value);
      st.calc = recompute(active, key);
      refresh(key);
      save();
    });
    input.addEventListener('blur', () => { input.value = fmt(st.values[key], FIELDS[key].dec); });
  });

  const i = TAB_ORDER.indexOf(active);
  tabButtons.forEach((b, j) => b.setAttribute('aria-selected', String(i === j)));
  indicator.style.transform = `translateX(${i * 100}%)`;
}

// Write state into inputs, skipping the one being typed in.
function refresh(editing) {
  const st = state(active);
  panel.querySelectorAll('.card').forEach((c) => {
    const key = c.dataset.key;
    c.classList.toggle('calc', st.calc.includes(key));
    if (key !== editing) c.querySelector('.value').value = fmt(st.values[key], FIELDS[key].dec);
  });
}

function setTab(tab) {
  if (!TABS[tab] || tab === active) return;
  active = tab;
  saved.active = tab;
  save();
  render();
}

tabButtons.forEach((b) => b.addEventListener('click', () => setTab(b.dataset.tab)));

// Swipe between tabs
let touchX = null, touchY = null;
panel.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; touchY = e.touches[0].clientY; }, { passive: true });
panel.addEventListener('touchend', (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  const dy = e.changedTouches[0].clientY - touchY;
  touchX = null;
  if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
  const i = TAB_ORDER.indexOf(active) + (dx < 0 ? 1 : -1);
  if (i >= 0 && i < TAB_ORDER.length) setTab(TAB_ORDER[i]);
});

document.getElementById('clearBtn').addEventListener('click', () => {
  saved[active] = { values: { Z: 1 }, calc: [] };
  save();
  render();
});

const sheet = document.getElementById('sheet');
document.getElementById('fxBtn').addEventListener('click', () => {
  document.getElementById('formulas').innerHTML = FORMULAS[active].map((f) => `<p>${f}</p>`).join('');
  sheet.hidden = false;
});
document.getElementById('sheetClose').addEventListener('click', () => { sheet.hidden = true; });
sheet.addEventListener('click', (e) => { if (e.target === sheet) sheet.hidden = true; });

render();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
