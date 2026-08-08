let recursos = [];
let empresas = [];
let currentTab = 'recursos';

function capitalize(str){
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- carga inicial de datos ---
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    recursos = data.recursos;
    empresas = data.empresas;
    render();
    updateHealth();
  });

function currentList(){ return currentTab === 'recursos' ? recursos : empresas; }

// --- pestañas ---
function switchTab(tab){
  currentTab = tab;
  document.getElementById('tabRecursos').classList.toggle('active', tab==='recursos');
  document.getElementById('tabEmpresas').classList.toggle('active', tab==='empresas');
  document.getElementById('panelTitle').textContent = tab==='recursos' ? 'libro de precios — recursos' : 'libro de precios — valores';
  render();
}

function tableHeadHtml(){
  if (currentTab === 'recursos'){
    return `<tr><th>recurso</th><th>procedencia</th><th>precio (cr)</th><th>var 24h</th><th>disponibilidad</th></tr>`;
  }
  return `<tr><th>empresa / facción</th><th>sede</th><th>precio (cr)</th><th>var 24h</th><th>capitalización</th></tr>`;
}

// --- tabla principal ---
function render(flashIndex=-1, dir=null){
  document.getElementById('tableHead').innerHTML = tableHeadHtml();
  const list = currentList();
  const tbody = document.getElementById('assets');
  tbody.innerHTML = '';
  list.forEach((a, i) => {
    const diff = a.price - a.prev;
    const pct = a.prev ? ((diff/a.prev)*100).toFixed(1) : '0.0';
    const up = diff >= 0;
    const tr = document.createElement('tr');
    tr.className = 'asset-row' + (i===flashIndex ? (dir==='up' ? ' flash-up' : ' flash-down') : '');
    tr.onclick = () => openHistory(i);

    const lastCol = currentTab === 'recursos'
      ? `<span class="avail-tag avail-${a.availability}">${a.availability}</span>`
      : `${(a.price * a.sharesIssued).toLocaleString('es-ES')} cr`;

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

// --- edición de precios ---
function simulateTick(){
  const list = currentList();
  const i = Math.floor(Math.random()*list.length);
  const pctChange = (Math.random()*8 - 4) / 100;
  const oldVal = list[i].price;
  list[i].prev = oldVal;
  list[i].price = Math.max(1, Math.round(oldVal * (1 + pctChange)));
  list[i].history.push({ p:list[i].price, t:new Date().toLocaleString('es-ES', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'}) });
  render(i, pctChange >= 0 ? 'up' : 'down');
  reactToChange(pctChange);
}

// --- reacciones visuales a cambios de precio ---
function reactToChange(pctChange){
  const abs = Math.abs(pctChange);
  const title = document.querySelector('h1');
  const statusEl = document.getElementById('statusLabel');

  if (abs >= 0.05){
    title.classList.remove('glitch-active');
    void title.offsetWidth;
    title.classList.add('glitch-active');
  }
  if (abs >= 0.08){
    statusEl.textContent = 'señal inestable';
    statusEl.classList.add('warn');
    document.querySelector('.panel').classList.add('signal-drop');
    setTimeout(() => {
      document.querySelector('.panel').classList.remove('signal-drop');
    }, 500);
    setTimeout(() => {
      statusEl.textContent = 'enlace activo';
      statusEl.classList.remove('warn');
    }, 2500);
  }
  updateHealth();
}

// --- pulso general del mercado (electrocardiograma) ---
function updateHealth(){
  const all = [...recursos, ...empresas];
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

// --- gauge de sentimiento (0-100, estilo velocímetro) ---
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

// --- ranking de mayores subidas / bajadas, solo del mercado activo ---
function updateMovers(){
  const list = currentList().map(a => ({
    name:capitalize(a.name),
    pct: a.prev ? (a.price - a.prev) / a.prev * 100 : 0
  }));

  const gainers = list.filter(a => a.pct > 0).sort((a,b) => b.pct - a.pct).slice(0,3);
  const losers = list.filter(a => a.pct < 0).sort((a,b) => a.pct - b.pct).slice(0,3);

  document.getElementById('moversHead').textContent =
    'mayores movimientos — ' + (currentTab === 'recursos' ? 'recursos' : 'valores');

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

// --- panel de detalle por activo ---
function openHistory(i){
  const a = currentList()[i];
  document.getElementById('modalName').textContent = capitalize(a.name);
  document.getElementById('modalOrigin').textContent = a.origin;

  const hist = a.history;
  const chartBox = document.getElementById('chartBox');
  chartBox.innerHTML = hist.length < 2
    ? '<div class="no-history">todavía no hay histórico — cambia el precio para empezar a registrar</div>'
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

  document.getElementById('modalOverlay').classList.add('open');

  const prices = a.history.map(h => h.p);
  const high = Math.max(...prices, a.price);
  const low = Math.min(...prices, a.price);

  if (currentTab === 'recursos'){
    const controlRows = a.controllers.map(c => `
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
    const cap = a.price * a.sharesIssued;
    const floatPct = a.sharesFloating / a.sharesIssued * 100;
    document.getElementById('statGrid').innerHTML = `
      <div class="stat-card">
        <span class="stat-label">acciones emitidas</span>
        <span class="stat-value">${a.sharesIssued.toLocaleString('es-ES')}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">capitalización</span>
        <span class="stat-value cyan">${cap.toLocaleString('es-ES')} cr</span>
      </div>
      <div class="stat-card" style="grid-column:1 / -1;">
        <span class="stat-label">acciones flotantes</span>
        <span class="stat-value pink">${a.sharesFloating.toLocaleString('es-ES')} (${floatPct.toFixed(0)}%)</span>
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
        <span class="stat-value">${a.majorityHolder}</span>
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

// --- ticker superior ---
function updateTicker(){
  const t = document.getElementById('ticker');
  const all = [...recursos, ...empresas];
  const items = all.map(a => {
    const diff = a.price - a.prev;
    const up = diff >= 0;
    const pct = a.prev ? Math.abs(((diff/a.prev)*100)).toFixed(1) : '0.0';
    return `<span>${a.name.toUpperCase()} <b>${a.price}cr</b> <span class="${up?'u':'d'}">${up?'▲':'▼'} ${pct}%</span></span>`;
  }).join('');
  t.innerHTML = items + items;

  // Duración de la animación proporcional al número de ítems, para que la
  // velocidad de lectura (px/seg aprox.) se mantenga constante aunque
  // crezca o disminuya la cantidad de recursos/empresas listados.
  const SECONDS_PER_ITEM = 2.6; // ajustable: sube para ir más lento, baja para más rápido
  const duration = Math.max(18, all.length * SECONDS_PER_ITEM);
  t.style.animationDuration = duration + 's';
}
