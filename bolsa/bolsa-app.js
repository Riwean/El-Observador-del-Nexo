/* =========================================================================
   BOLSA DE LA CICATRIZ
   - Catálogo estático (data.json): nombre, origen, disponibilidad, etc.
   - Estado vivo en Firebase (bolsa/precios/{id}): price, prev, history, base
   - Pesos en Firebase (bolsa/pesos/individual/{id} y bolsa/pesos/faccion/{origin})
   - Tick de mercado: solo el DJ (personaje "admin") puede lanzarlo
   - Portfolio: compra/venta de acciones de empresas, con crédito personal o de la nave
   ========================================================================= */

let catalogoRecursos = [];
let catalogoEmpresas = [];
let precios = {};           // { [id]: { price, prev, base, history:[{p,t}] } }
let pesosIndividual = {};   // { [id]: number }
let pesosFaccion = {};      // { [origin]: number }
let currentTab = 'recursos';
let payWith = 'personal';

let currentUser = null;
let currentPersonaje = null; // "kael", "hadria"... o null si no vinculado
let esAdmin = false;
let personalCredits = 0;
let shipCredits = 0;
let portfolioPersonaje = {}; // { [empresaId]: {qty, avgCost} }
let portfolioNave = {};      // { [empresaId]: {qty, avgCost} }
let portfolioTodos = {};     // { [personajeId]: { [empresaId]: {qty, avgCost} } } — para la vista de admin
let personajesDisponibles = []; // para el panel de pesos y la vista de admin del portfolio

const K_DRIFT = 0.0015;      // 0.15% de deriva por punto de peso
const AMPLITUD_BASE = 0.04;  // ±4% en el caso neutro (peso 0), igual que antes
const WEIGHT_CLAMP = 10;     // tope del peso combinado (individual + facción)
const HISTORY_MAX = 30;

function capitalize(str){
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function slugify(str){
  return String(str).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function esc(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function fmtCr(n){
  return Math.round(n).toLocaleString('es-ES');
}

function toast(msg){
  const box = document.getElementById('toastBox');
  if (!box) return;
  box.textContent = msg;
  box.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => box.classList.remove('show'), 2600);
}

/* --- carga del catálogo estático --- */
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    catalogoRecursos = (data.recursos || []).map(a => ({ ...a, id: slugify(a.name) }));
    catalogoEmpresas = (data.empresas || []).map(a => ({ ...a, id: slugify(a.name) }));
    initFirebaseWhenReady();
  });

function initFirebaseWhenReady(){
  if (window.fb) return conectarFirebase();
  window.addEventListener('fb-ready', conectarFirebase, { once:true });
}

async function conectarFirebase(){
  const { db, ref, onValue, get, update, auth, onAuthStateChanged } = window.fb;

  // No sembramos bolsa/precios aquí: escribir requiere auth != null y esto
  // corre antes del login. mergedList() ya usa el precio del catálogo como
  // fallback mientras no exista nada en Firebase para un activo — el nodo
  // se crea de forma natural en cuanto el admin lanza el primer tick.

  onValue(ref(db, 'bolsa/precios'), (snap) => {
    precios = snap.val() || {};
    render();
    updateHealth();
  });

  onValue(ref(db, 'bolsa/pesos/individual'), (snap) => { pesosIndividual = snap.val() || {}; });
  onValue(ref(db, 'bolsa/pesos/faccion'), (snap) => { pesosFaccion = snap.val() || {}; });

  onValue(ref(db, 'bolsa/portfolio/nave'), (snap) => {
    portfolioNave = snap.val() || {};
    if (currentTab === 'portfolio') renderPortfolio();
  });

  onValue(ref(db, 'tienda/shipCredits'), (snap) => {
    shipCredits = Number(snap.val()) || 0;
    if (currentTab === 'portfolio') renderPortfolio();
  });

  onAuthStateChanged(auth, async (user) => {
    currentUser = user || null;
    currentPersonaje = null;
    esAdmin = false;
    personalCredits = 0;
    portfolioPersonaje = {};

    if (user){
      try {
        const uSnap = await get(ref(db, 'tienda/usuarios/' + user.uid));
        currentPersonaje = uSnap.exists() ? uSnap.val() : null;
      } catch(e){ currentPersonaje = null; }
    }

    esAdmin = (currentPersonaje || '').trim().toLowerCase() === 'admin';
    updateSessionUI();
    updateAdminUI();

    if (currentPersonaje){
      onValue(ref(db, `tienda/personajes/${currentPersonaje}/credits`), (snap) => {
        personalCredits = Number(snap.val()) || 0;
        if (currentTab === 'portfolio') renderPortfolio();
      });
    }

    if (currentTab === 'portfolio') renderPortfolio();
  });

  // todos los portfolios de personajes — necesario para que el DJ pueda ver
  // la posición de cada jugador, no solo la suya propia.
  onValue(ref(db, 'bolsa/portfolio/personajes'), (snap) => {
    portfolioTodos = snap.val() || {};
    portfolioPersonaje = currentPersonaje ? (portfolioTodos[currentPersonaje] || {}) : {};
    if (currentTab === 'portfolio') renderPortfolio();
  });

  // lista de personajes: para el panel de pesos y para la vista de admin del portfolio.
  onValue(ref(db, 'tienda/personajes'), (snap) => {
    const val = snap.val() || {};
    personajesDisponibles = Object.keys(val);
    if (currentTab === 'portfolio') renderPortfolio();
  });
}

/* --- listas combinadas (catálogo + estado vivo) --- */
function mergedList(catalogo){
  return catalogo.map(a => {
    const p = precios[a.id] || { price:a.price, prev:a.price, base:a.price, history:[] };
    return { ...a, price:p.price, prev:p.prev, base:p.base || a.price, history:p.history || [] };
  });
}
function liveRecursos(){ return mergedList(catalogoRecursos); }
function liveEmpresas(){ return mergedList(catalogoEmpresas); }
function currentList(){ return currentTab === 'empresas' ? liveEmpresas() : liveRecursos(); }

/* --- pestañas --- */
function switchTab(tab){
  currentTab = tab;
  document.getElementById('tabRecursos').classList.toggle('active', tab==='recursos');
  document.getElementById('tabEmpresas').classList.toggle('active', tab==='empresas');
  document.getElementById('tabPortfolio').classList.toggle('active', tab==='portfolio');

  document.getElementById('marketPanel').classList.toggle('hidden', tab==='portfolio');
  document.getElementById('portfolioPanel').classList.toggle('hidden', tab!=='portfolio');

  if (tab === 'portfolio'){
    renderPortfolio();
    return;
  }
  document.getElementById('panelTitle').textContent = tab==='recursos' ? 'libro de precios — recursos' : 'libro de precios — valores';
  render();
}

function tableHeadHtml(){
  if (currentTab === 'recursos'){
    return `<tr><th>recurso</th><th>procedencia</th><th>precio (cr)</th><th>var 24h</th><th>disponibilidad</th></tr>`;
  }
  return `<tr><th>empresa / facción</th><th>sede</th><th>precio (cr)</th><th>var 24h</th><th>capitalización</th></tr>`;
}

/* --- tabla principal --- */
function render(flashIds=[]){
  if (currentTab === 'portfolio') return;
  document.getElementById('tableHead').innerHTML = tableHeadHtml();
  const list = currentList();
  const tbody = document.getElementById('assets');
  tbody.innerHTML = '';
  list.forEach((a) => {
    const diff = a.price - a.prev;
    const pct = a.prev ? ((diff/a.prev)*100).toFixed(1) : '0.0';
    const up = diff >= 0;
    const tr = document.createElement('tr');
    const flashDir = flashIds.find(f => f.id === a.id)?.dir;
    tr.className = 'asset-row' + (flashDir ? (flashDir==='up' ? ' flash-up' : ' flash-down') : '');
    tr.onclick = () => openHistory(a.id);

    const lastCol = currentTab === 'recursos'
      ? `<span class="avail-tag avail-${a.availability}">${a.availability}</span>`
      : `${(a.price * (a.sharesIssued||0)).toLocaleString('es-ES')} cr`;

    tr.innerHTML = `
      <td><div class="asset-name">${capitalize(a.name)}</div></td>
      <td><span class="tag tag-faction">${a.origin}</span></td>
      <td>${a.price} cr</td>
      <td class="${up?'var-up':'var-down'}">${up?'▲':'▼'} ${Math.abs(pct)}%</td>
      <td>${lastCol}</td>
    `;
    tbody.appendChild(tr);
  });
  updateTicker();
  updateMovers();
}

/* =========================================================================
   FÓRMULA DE MERCADO
   variación% = drift(peso) + ruido(peso)
   - peso = pesoIndividual[id] + pesoFaccion[origin], clampeado a ±10
   - drift = peso * K_DRIFT
   - ruido: aleatorio en amplitud base; si coincide en signo con el peso,
     se amplifica (subidas más grandes cuando el peso es positivo, y
     viceversa) — el lado contrario mantiene su tamaño normal, para que
     las bajadas/subidas "en contra de la tendencia" sigan siendo creíbles.
   - clamp final: el precio nunca baja de 30% ni sube de 300% del precio base
   ========================================================================= */
function pesoTotal(id, origin){
  const wi = pesosIndividual[id] || 0;
  const wf = pesosFaccion[origin] || 0;
  return Math.max(-WEIGHT_CLAMP, Math.min(WEIGHT_CLAMP, wi + wf));
}

function calcularNuevoPrecio(item){
  const w = pesoTotal(item.id, item.origin);
  const r = Math.random() * 2 - 1; // -1..1
  const mismoSigno = (r > 0 && w > 0) || (r < 0 && w < 0);
  const amplitud = AMPLITUD_BASE * (mismoSigno ? (1 + Math.abs(w) / 10) : 1);
  const variacion = (w * K_DRIFT) + (r * amplitud);

  const base = item.base || item.price;
  const min = base * 0.3, max = base * 3;
  let nuevo = item.price * (1 + variacion);
  nuevo = Math.max(min, Math.min(max, nuevo));
  return { nuevo: Math.max(1, Math.round(nuevo)), variacion };
}

async function lanzarTickMercado(){
  if (!esAdmin) return;
  const { db, ref, update } = window.fb;
  const todos = [...liveRecursos(), ...liveEmpresas()];
  const fecha = new Date().toLocaleString('es-ES', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'});

  const payload = {};
  const flashIds = [];
  let sumaAbs = 0;

  todos.forEach(item => {
    const { nuevo, variacion } = calcularNuevoPrecio(item);
    const hist = (item.history || []).concat([{ p: nuevo, t: fecha }]).slice(-HISTORY_MAX);
    payload[`bolsa/precios/${item.id}`] = {
      price: nuevo, prev: item.price, base: item.base || item.price, history: hist
    };
    flashIds.push({ id: item.id, dir: nuevo >= item.price ? 'up' : 'down' });
    sumaAbs += Math.abs(variacion);
  });

  await update(ref(db), payload);
  render(flashIds);
  reactToChange(sumaAbs / todos.length);
  toast('Tick de mercado lanzado.');
}

/* --- reacciones visuales a cambios de precio --- */
function reactToChange(avgAbs){
  const title = document.querySelector('h1');
  const statusEl = document.getElementById('statusLabel');

  if (avgAbs >= 0.03){
    title.classList.remove('glitch-active');
    void title.offsetWidth;
    title.classList.add('glitch-active');
  }
  if (avgAbs >= 0.05){
    statusEl.textContent = 'señal inestable';
    statusEl.classList.add('warn');
    document.querySelector('.panel')?.classList.add('signal-drop');
    setTimeout(() => document.querySelector('.panel')?.classList.remove('signal-drop'), 500);
    setTimeout(() => {
      statusEl.textContent = 'enlace activo';
      statusEl.classList.remove('warn');
    }, 2500);
  }
}

/* --- pulso general del mercado (electrocardiograma) --- */
function updateHealth(){
  const all = [...liveRecursos(), ...liveEmpresas()];
  if (!all.length) return;
  const changes = all.map(a => a.prev ? (a.price - a.prev) / a.prev : 0);
  const avg = changes.reduce((s,c) => s+c, 0) / changes.length;

  const pctEl = document.getElementById('healthPct');
  pctEl.textContent = (avg*100 >= 0 ? '+' : '') + (avg*100).toFixed(1) + '%';
  pctEl.className = 'health-pct ' + (avg > 0.005 ? 'up' : (avg < -0.005 ? 'down' : 'flat'));

  const line = document.getElementById('ecgLine');
  const color = avg > 0.005 ? 'var(--neon-green)' : (avg < -0.005 ? 'var(--neon-red)' : 'var(--neon-cyan)');
  line.style.color = color;

  const amp = Math.min(18, 6 + Math.abs(avg) * 300);
  line.setAttribute('points', buildEcgPath(amp));

  const speed = Math.max(1.2, 3 - Math.abs(avg) * 20);
  line.style.animationDuration = speed + 's';

  updateGauge(avg);
  updateMovers();
}

function updateGauge(avg){
  const score = Math.max(0, Math.min(100, Math.round(50 + avg * 400)));
  const fill = document.getElementById('gaugeFill');
  const valueEl = document.getElementById('gaugeValue');
  const labelEl = document.getElementById('gaugeLabel');

  const offset = 157 - (score / 100) * 157;
  fill.style.strokeDashoffset = offset;

  let color, label;
  if (score >= 65){ color = 'var(--neon-green)'; label = 'alcista'; }
  else if (score <= 35){ color = 'var(--neon-red)'; label = 'bajista'; }
  else { color = 'var(--neon-cyan)'; label = 'neutral'; }
  fill.style.stroke = color;
  valueEl.style.color = color;
  valueEl.textContent = score;
  labelEl.textContent = label;
}

function updateMovers(){
  const list = currentList().map(a => ({
    name:capitalize(a.name),
    pct: a.prev ? (a.price - a.prev) / a.prev * 100 : 0
  }));

  const gainers = list.filter(a => a.pct > 0).sort((a,b) => b.pct - a.pct).slice(0,3);
  const losers = list.filter(a => a.pct < 0).sort((a,b) => a.pct - b.pct).slice(0,3);

  document.getElementById('moversHead').textContent =
    'mayores movimientos — ' + (currentTab === 'empresas' ? 'valores' : 'recursos');

  const rowHtml = (a, cls) => `
    <div class="mover-row">
      <span class="mover-name">${a.name}</span>
      <span class="${cls}">${a.pct >= 0 ? '▲' : '▼'} ${Math.abs(a.pct).toFixed(1)}%</span>
    </div>`;

  document.getElementById('moversUp').innerHTML = gainers.length
    ? gainers.map(a => rowHtml(a, 'var-up')).join('')
    : '<div class="mover-empty">sin subidas recientes</div>';

  document.getElementById('moversDown').innerHTML = losers.length
    ? losers.map(a => rowHtml(a, 'var-down')).join('')
    : '<div class="mover-empty">sin bajadas recientes</div>';
}

function buildEcgPath(amp){
  const cycle = (offset) => [
    [offset+0, 22], [offset+20, 22], [offset+28, 22-amp*0.3], [offset+34, 22+amp*0.4],
    [offset+40, 22-amp], [offset+46, 22+amp*0.6], [offset+52, 22],
    [offset+70, 22], [offset+300, 22]
  ];
  const pts = [...cycle(0), ...cycle(300)];
  return pts.map(p => p.join(',')).join(' ');
}

/* --- panel de detalle por activo (+ compra/venta si es empresa) --- */
function openHistory(id){
  const a = currentList().find(x => x.id === id);
  if (!a) return;
  document.getElementById('modalName').textContent = capitalize(a.name);
  document.getElementById('modalOrigin').textContent = a.origin;

  const hist = a.history;
  const chartBox = document.getElementById('chartBox');
  chartBox.innerHTML = hist.length < 2
    ? '<div class="no-history">todavía no hay histórico — lanza un tick de mercado para empezar a registrar</div>'
    : buildSparkline(hist);

  const calcBox = document.getElementById('calcBox');
  if (hist.length < 2){
    calcBox.innerHTML = '';
  } else {
    const prevP = hist[hist.length-2].p;
    const curP = hist[hist.length-1].p;
    const diff = curP - prevP;
    const pct = prevP ? (diff/prevP*100) : 0;
    const up = diff >= 0;
    calcBox.innerHTML = `
      <div class="variation-calc">
        <div class="step"><span class="step-label">precio anterior</span>${prevP} cr</div>
        <div class="arrow">→</div>
        <div class="step"><span class="step-label">precio nuevo</span>${curP} cr</div>
        <div class="arrow">=</div>
        <div class="step"><span class="step-label">variación</span><span class="${up?'var-up':'var-down'}">${up?'▲':'▼'} ${Math.abs(pct).toFixed(1)}%</span></div>
      </div>
    `;
  }

  document.getElementById('tradeBox').innerHTML = currentTab === 'empresas' ? buildTradeBoxHtml(a) : '';
  if (currentTab === 'empresas') wireTradeBox(a);

  document.getElementById('modalOverlay').classList.add('open');

  const prices = a.history.map(h => h.p);
  const high = Math.max(...prices, a.price);
  const low = Math.min(...prices, a.price);

  if (currentTab === 'recursos'){
    const controlRows = (a.controllers||[]).map(c => `
      <div class="stat-card" style="grid-column:1 / -1; margin-bottom:6px;">
        <span class="stat-label">${c.holder}</span>
        <span class="stat-value">${c.pct}%</span>
        <div class="float-bar"><div class="float-bar-fill" style="width:${c.pct}%"></div></div>
      </div>
    `).join('');
    document.getElementById('statGrid').innerHTML = `
      <div class="stat-card">
        <span class="stat-label">disponibilidad</span>
        <span class="stat-value"><span class="avail-tag avail-${a.availability}">${a.availability}</span></span>
      </div>
      <div class="stat-card">
        <span class="stat-label">máximo / mínimo</span>
        <span class="stat-value">${high} / ${low} cr</span>
      </div>
      <div style="grid-column:1 / -1; font-size:9px; color:#8a7fc0; text-transform:uppercase; letter-spacing:1px; margin-top:8px;">reparto de control</div>
      ${controlRows}
    `;
  } else {
    const cap = a.price * (a.sharesIssued||0);
    const floatPct = a.sharesIssued ? (a.sharesFloating||0) / a.sharesIssued * 100 : 0;
    document.getElementById('statGrid').innerHTML = `
      <div class="stat-card">
        <span class="stat-label">acciones emitidas</span>
        <span class="stat-value">${(a.sharesIssued||0).toLocaleString('es-ES')}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">capitalización</span>
        <span class="stat-value cyan">${cap.toLocaleString('es-ES')} cr</span>
      </div>
      <div class="stat-card" style="grid-column:1 / -1;">
        <span class="stat-label">acciones flotantes</span>
        <span class="stat-value pink">${(a.sharesFloating||0).toLocaleString('es-ES')} (${floatPct.toFixed(0)}%)</span>
        <div class="float-bar"><div class="float-bar-fill" style="width:${floatPct}%"></div></div>
      </div>
      <div class="stat-card">
        <span class="stat-label">máximo histórico</span>
        <span class="stat-value">${high} cr</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">mínimo histórico</span>
        <span class="stat-value">${low} cr</span>
      </div>
      <div class="stat-card" style="grid-column:1 / -1;">
        <span class="stat-label">poseedor mayoritario</span>
        <span class="stat-value">${a.majorityHolder||'—'}</span>
      </div>
    `;
  }
}

function closeModal(){
  document.getElementById('modalOverlay').classList.remove('open');
}

function buildSparkline(hist){
  const w = 500, h = 160, pad = 20;
  const prices = hist.map(pt => pt.p);
  const min = Math.min(...prices), max = Math.max(...prices);
  const range = (max - min) || 1;
  const stepX = (w - pad*2) / (prices.length - 1);

  const points = prices.map((p, i) => {
    const x = pad + i * stepX;
    const y = h - pad - ((p - min) / range) * (h - pad*2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const dots = prices.map((p, i) => {
    const x = pad + i * stepX;
    const y = h - pad - ((p - min) / range) * (h - pad*2);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#00f0ff" style="filter:drop-shadow(0 0 3px #00f0ff)"><title>${hist[i].t}: ${p} cr</title></circle>`;
  }).join('');

  return `
    <svg viewBox="0 0 ${w} ${h}" style="width:100%; height:auto; display:block;">
      <polyline points="${points.join(' ')}" fill="none" stroke="#ff2fb0" stroke-width="2" style="filter:drop-shadow(0 0 4px rgba(255,47,176,0.6))" />
      ${dots}
      <text x="${pad}" y="${h-4}" fill="#8a7fc0" font-size="10" font-family="Share Tech Mono, monospace">${hist[0].t}</text>
      <text x="${w-pad}" y="${h-4}" fill="#8a7fc0" font-size="10" font-family="Share Tech Mono, monospace" text-anchor="end">${hist[hist.length-1].t}</text>
    </svg>
  `;
}

/* --- ticker superior --- */
function updateTicker(){
  const t = document.getElementById('ticker');
  const all = [...liveRecursos(), ...liveEmpresas()];
  const items = all.map(a => {
    const diff = a.price - a.prev;
    const up = diff >= 0;
    const pct = a.prev ? Math.abs(((diff/a.prev)*100)).toFixed(1) : '0.0';
    return `<span>${a.name.toUpperCase()} <b>${a.price}cr</b> <span class="${up?'u':'d'}">${up?'▲':'▼'} ${pct}%</span></span>`;
  }).join('');
  t.innerHTML = items + items;

  const SECONDS_PER_ITEM = 2.6;
  const duration = Math.max(18, all.length * SECONDS_PER_ITEM);
  t.style.animationDuration = duration + 's';
}

/* =========================================================================
   SESIÓN / LOGIN (mismo patrón que tienda-app.js y nave-app.js)
   ========================================================================= */
function updateSessionUI(){
  const chip = document.getElementById('sessionChip');
  const dot = document.getElementById('sessionDot');
  const label = document.getElementById('sessionLabel');
  if (currentUser){
    dot.style.background = '#00ff9c';
    label.textContent = currentPersonaje
      ? `CONECTADO: ${currentPersonaje.toUpperCase()} (salir)`
      : 'CONECTADO (salir)';
  } else {
    dot.style.background = '#ff2f5e';
    label.textContent = 'INICIAR SESIÓN';
  }
}

function updateAdminUI(){
  document.getElementById('adminRow').classList.toggle('hidden', !esAdmin);
  document.getElementById('blToggle').classList.toggle('hidden', !esAdmin);
}

function openLogin(){ document.getElementById('loginOverlay').classList.add('open'); document.getElementById('loginError').textContent=''; }
function closeLogin(){ document.getElementById('loginOverlay').classList.remove('open'); }

async function doLogin(){
  const { auth, signInWithEmailAndPassword } = window.fb;
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  errEl.textContent = '';
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    closeLogin();
  } catch(e){
    errEl.textContent = 'Credenciales incorrectas o cuenta no encontrada.';
  }
}

async function doLogout(){
  const { auth, signOut } = window.fb;
  await signOut(auth);
}

/* =========================================================================
   PORTFOLIO — compra/venta de acciones de empresas
   ========================================================================= */
function renderPortfolio(){
  document.getElementById('portfolioWho').textContent = currentPersonaje ? currentPersonaje.toUpperCase() : '—';

  const locked = document.getElementById('portfolioLocked');
  const body = document.getElementById('portfolioBody');
  if (!currentPersonaje){
    locked.classList.remove('hidden');
    body.classList.add('hidden');
    return;
  }
  locked.classList.add('hidden');
  body.classList.remove('hidden');

  document.getElementById('portfolioBalance').innerHTML = `
    <div class="portfolio-row-top"><span class="portfolio-row-name">créditos personales</span><span class="var-up">${fmtCr(personalCredits)} cr</span></div>
    <div class="portfolio-row-top"><span class="portfolio-row-name">créditos de la nave</span><span class="var-up">${fmtCr(shipCredits)} cr</span></div>
  `;

  const empresas = liveEmpresas();
  const listHtml = (portfolio) => {
    const rows = Object.entries(portfolio || {}).filter(([,v]) => (v?.qty || 0) > 0);
    if (!rows.length) return '<div class="mover-empty">sin posiciones abiertas</div>';
    return rows.map(([id, v]) => {
      const a = empresas.find(e => e.id === id);
      if (!a) return '';
      const valor = v.qty * a.price;
      const coste = v.qty * v.avgCost;
      const gain = valor - coste;
      const cls = gain >= 0 ? 'var-up' : 'var-down';
      return `
        <div class="portfolio-row" data-open="${id}">
          <div class="portfolio-row-top">
            <span class="portfolio-row-name">${capitalize(a.name)} × ${v.qty}</span>
            <span class="var-up">${fmtCr(valor)} cr</span>
          </div>
          <div class="portfolio-row-sub">
            <span>precio medio de compra: ${fmtCr(v.avgCost)} cr</span>
            <span class="${cls}">${gain >= 0 ? '+' : ''}${fmtCr(gain)} cr</span>
          </div>
        </div>`;
    }).join('');
  };

  document.getElementById('portfolioPersonalList').innerHTML = listHtml(portfolioPersonaje);
  document.getElementById('portfolioNaveList').innerHTML = listHtml(portfolioNave);

  const adminLabel = document.getElementById('adminPortfolioLabel');
  const adminList = document.getElementById('portfolioAdminList');
  adminLabel.classList.toggle('hidden', !esAdmin);
  adminList.classList.toggle('hidden', !esAdmin);
  if (esAdmin){
    const nombres = personajesDisponibles.filter(id => id.trim().toLowerCase() !== 'admin');
    adminList.innerHTML = nombres.map(id => `
      <div class="portfolio-admin-block">
        <div class="portfolio-admin-name">${id.toUpperCase()}</div>
        ${listHtml(portfolioTodos[id])}
      </div>
    `).join('') || '<div class="mover-empty">sin personajes registrados</div>';
  }

  document.querySelectorAll('#portfolioPanel [data-open]').forEach(el => {
    el.onclick = () => { currentTab = 'empresas'; openHistory(el.dataset.open); currentTab = 'portfolio'; };
  });
}

function buildTradeBoxHtml(a){
  if (!currentUser){
    return `<div class="no-history">inicia sesión para poder comprar o vender acciones</div>`;
  }
  if (!currentPersonaje){
    return `<div class="no-history">tu cuenta no está vinculada a ningún personaje — habla con el DJ</div>`;
  }
  const heldPersonal = portfolioPersonaje[a.id]?.qty || 0;
  const heldNave = portfolioNave[a.id]?.qty || 0;
  return `
    <div class="variation-calc" style="flex-direction:column; align-items:stretch; gap:10px;">
      <div class="pay-toggle-row" id="modalPayToggleRow">
        <button class="pay-toggle-btn ${payWith==='personal'?'on':''}" data-pay="personal">👤 PERSONAL (${fmtCr(personalCredits)} cr · ${heldPersonal} accs.)</button>
        <button class="pay-toggle-btn ${payWith==='nave'?'on':''}" data-pay="nave">🚀 NAVE (${fmtCr(shipCredits)} cr · ${heldNave} accs.)</button>
      </div>
      <div class="move-row">
        <input type="number" id="tradeQty" min="1" value="1" style="max-width:100px;">
        <button class="cyber-btn" id="tradeBuyBtn">COMPRAR</button>
        <button class="cyber-btn pink" id="tradeSellBtn">VENDER</button>
      </div>
      <div id="tradePreview" class="trade-preview"></div>
      <div id="tradeError" class="move-error"></div>
    </div>
  `;
}

function wireTradeBox(a){
  const box = document.getElementById('tradeBox');
  if (!box) return;
  box.querySelectorAll('#modalPayToggleRow .pay-toggle-btn').forEach(btn => {
    btn.onclick = () => { payWith = btn.dataset.pay; box.innerHTML = buildTradeBoxHtml(a); wireTradeBox(a); };
  });
  const buyBtn = document.getElementById('tradeBuyBtn');
  const sellBtn = document.getElementById('tradeSellBtn');
  if (buyBtn) buyBtn.onclick = () => ejecutarOrden(a, 'comprar');
  if (sellBtn) sellBtn.onclick = () => ejecutarOrden(a, 'vender');

  const qtyInput = document.getElementById('tradeQty');
  const preview = document.getElementById('tradePreview');
  const updatePreview = () => {
    const qty = Math.max(1, Math.floor(Number(qtyInput.value)) || 0);
    const coste = qty * a.price;
    const heldActual = payWith === 'personal' ? (portfolioPersonaje[a.id]?.qty || 0) : (portfolioNave[a.id]?.qty || 0);
    const avgActual = payWith === 'personal' ? (portfolioPersonaje[a.id]?.avgCost || 0) : (portfolioNave[a.id]?.avgCost || 0);
    let html = `<div class="portfolio-row-top"><span class="portfolio-row-name">coste de la compra</span><span>${fmtCr(coste)} cr</span></div>`;
    if (heldActual > 0){
      const qtyVenta = Math.min(qty, heldActual);
      const ganancia = qtyVenta * (a.price - avgActual);
      const cls = ganancia >= 0 ? 'var-up' : 'var-down';
      html += `
        <div class="portfolio-row-top"><span class="portfolio-row-name">precio medio de tu posición</span><span>${fmtCr(avgActual)} cr</span></div>
        <div class="portfolio-row-top"><span class="portfolio-row-name">si vendieras ${qtyVenta}</span><span class="${cls}">${ganancia >= 0 ? '+' : ''}${fmtCr(ganancia)} cr</span></div>`;
    }
    preview.innerHTML = html;
  };
  qtyInput.addEventListener('input', updatePreview);
  updatePreview();
}

async function ejecutarOrden(a, tipo){
  const errEl = document.getElementById('tradeError');
  errEl.textContent = '';
  const qty = Math.max(1, Math.floor(Number(document.getElementById('tradeQty').value)) || 0);
  if (!currentPersonaje){ errEl.textContent = 'Necesitas un personaje vinculado.'; return; }

  const { db, ref, runTransaction, update } = window.fb;
  const coste = qty * a.price;
  const creditsPath = payWith === 'personal' ? `tienda/personajes/${currentPersonaje}/credits` : 'tienda/shipCredits';
  const portfolioPath = payWith === 'personal'
    ? `bolsa/portfolio/personajes/${currentPersonaje}/${a.id}`
    : `bolsa/portfolio/nave/${a.id}`;
  const holdingActual = (payWith === 'personal' ? portfolioPersonaje[a.id] : portfolioNave[a.id]) || { qty:0, avgCost:0 };

  if (tipo === 'vender' && qty > holdingActual.qty){
    errEl.textContent = `No hay suficientes acciones (tienes ${holdingActual.qty}).`;
    return;
  }

  const creditsRes = await runTransaction(ref(db, creditsPath), (current) => {
    const saldo = Number(current) || 0;
    if (tipo === 'comprar'){
      if (saldo < coste) return; // aborta la transacción
      return saldo - coste;
    }
    return saldo + coste;
  });

  if (!creditsRes.committed){
    errEl.textContent = 'Créditos insuficientes.';
    return;
  }

  await runTransaction(ref(db, portfolioPath), (current) => {
    const cur = current || { qty:0, avgCost:0 };
    if (tipo === 'comprar'){
      const nuevoQty = cur.qty + qty;
      const nuevoAvg = ((cur.qty * cur.avgCost) + (qty * a.price)) / nuevoQty;
      return { qty: nuevoQty, avgCost: nuevoAvg };
    }
    const nuevoQty = cur.qty - qty;
    if (nuevoQty <= 0) return null; // se cierra la posición del todo
    return { qty: nuevoQty, avgCost: cur.avgCost }; // el precio medio no cambia en una venta parcial
  });

  const gananciaMsg = tipo === 'vender'
    ? ` (${qty * (a.price - holdingActual.avgCost) >= 0 ? '+' : ''}${fmtCr(qty * (a.price - holdingActual.avgCost))} cr)`
    : ` — ${fmtCr(coste)} cr`;
  toast(`${tipo === 'comprar' ? 'Compra' : 'Venta'} de ${qty} acción(es) de ${capitalize(a.name)}${gananciaMsg}.`);
  openHistory(a.id);
}

/* =========================================================================
   PANEL DE PESOS (DJ) — individual y por facción/origen
   ========================================================================= */
function openPesos(){
  if (!esAdmin) return;
  renderPesosBody();
  document.getElementById('pesosOverlay').classList.add('open');
}
function closePesos(){ document.getElementById('pesosOverlay').classList.remove('open'); }

function renderPesosBody(){
  const orígenes = [...new Set([...catalogoRecursos, ...catalogoEmpresas].map(a => a.origin))];
  const activos = [...catalogoRecursos, ...catalogoEmpresas];

  const facHtml = orígenes.map(origin => `
    <div class="peso-item">
      <span title="${esc(origin)}">${esc(origin)}</span>
      <input type="number" class="peso-fac-input" data-origin="${esc(origin)}" min="-10" max="10" value="${pesosFaccion[origin] || 0}">
    </div>
  `).join('');

  const indHtml = activos.map(a => `
    <div class="peso-item">
      <span title="${esc(a.name)}">${capitalize(a.name)}</span>
      <input type="number" class="peso-ind-input" data-id="${a.id}" min="-10" max="10" value="${pesosIndividual[a.id] || 0}">
    </div>
  `).join('');

  document.getElementById('pesosBody').innerHTML = `
    <div class="portfolio-section-label">peso por facción / procedencia</div>
    <div class="pesos-grid" style="max-height:160px;">${facHtml}</div>
    <div class="portfolio-section-label">peso individual por activo</div>
    <div class="pesos-grid">${indHtml}</div>
    <button class="cyber-btn" id="pesosSaveBtn" style="margin-top:14px;">GUARDAR PESOS</button>
    <div id="pesosStatus" class="move-error" style="color:#7fe6cf;"></div>
  `;

  document.getElementById('pesosSaveBtn').onclick = guardarPesos;
}

async function guardarPesos(){
  const { db, ref, update } = window.fb;
  const payload = {};
  document.querySelectorAll('.peso-fac-input').forEach(inp => {
    const v = Math.max(-10, Math.min(10, Math.round(Number(inp.value)) || 0));
    payload[`bolsa/pesos/faccion/${inp.dataset.origin}`] = v;
  });
  document.querySelectorAll('.peso-ind-input').forEach(inp => {
    const v = Math.max(-10, Math.min(10, Math.round(Number(inp.value)) || 0));
    payload[`bolsa/pesos/individual/${inp.dataset.id}`] = v;
  });
  await update(ref(db), payload);
  document.getElementById('pesosStatus').textContent = 'Pesos guardados.';
}

/* --- listeners de UI que no dependen de Firebase --- */
function wireCornerToggle(btnId, panelId){
  const btn = document.getElementById(btnId);
  const panel = document.getElementById(panelId);
  if (!btn || !panel) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = panel.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', (e) => {
    if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== btn){
      panel.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  wireCornerToggle('tlToggle', 'topLeftStack');
  wireCornerToggle('blToggle', 'adminRow');

  document.getElementById('sessionChip').addEventListener('click', () => {
    if (currentUser) doLogout(); else openLogin();
  });
  document.getElementById('tickBtn').addEventListener('click', lanzarTickMercado);
  document.getElementById('pesosBtn').addEventListener('click', openPesos);
  document.getElementById('loginSubmitBtn').addEventListener('click', doLogin);
  document.getElementById('loginCloseBtn')?.addEventListener('click', closeLogin);

  document.querySelectorAll('#payToggleRow .pay-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      payWith = btn.dataset.pay;
      document.querySelectorAll('#payToggleRow .pay-toggle-btn').forEach(b => b.classList.toggle('on', b===btn));
    });
  });
});
