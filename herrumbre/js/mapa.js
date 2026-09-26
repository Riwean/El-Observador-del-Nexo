import { cargar, ruta, esc, chip, montarFx, pie, estadoFase, estadoZona, progresoFase, nombreEn, poligono, visibleEn, ESTADOS, ESTADO_FASE, fasesEnCurso } from './common.js';

const [plan, zon] = await Promise.all([cargar('data/plan.json'), cargar('data/zonas.json')]);
const NS = 'http://www.w3.org/2000/svg';
const $ = (id) => document.getElementById(id);
const mes = plan.mesActual;
const W = zon.ancho, H = zon.alto;
const grupos = Object.fromEntries(zon.grupos.map((g) => [g.id, g]));
const params = new URLSearchParams(location.search);
const editar = params.has('editar');

const fp = params.get('fase');
const faseIni = fp === null ? -1 : Number(fp);
let fase = plan.fases[faseIni] ? faseIni : fasesEnCurso(plan).slice(-1)[0].id;
let vista = 'mapa';
let selId = params.get('zona');
let filtro = null;
let paridad = 0;

montarFx();
pie(editar ? 'Modo editor de zonas activo' : 'Mapa de Nuevo Herrumbre por fases');

const img = $('img');
const svg = $('svg');
svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
if (editar) $('stage').classList.add('editando');

const area = (p) => Math.abs(p.reduce((s, q, i) => { const n = p[(i + 1) % p.length]; return s + q[0] * n[1] - n[0] * q[1]; }, 0)) / 2;
const zonaPorId = (id) => zon.zonas.find((z) => z.id === id);

function url() {
  const q = new URLSearchParams();
  q.set('fase', fase);
  if (selId) q.set('zona', selId);
  if (editar) q.set('editar', '');
  history.replaceState(null, '', '?' + q.toString().replace('editar=', 'editar'));
}

function pintarTabs() {
  $('tabs').innerHTML = plan.fases.map((f) => {
    const e = estadoFase(f, mes);
    return `<button class="tab is-${e}${f.id === fase ? ' on' : ''}" role="tab" aria-selected="${f.id === fase}" data-f="${f.id}"><b>${f.romano}</b><span>${esc(f.nombre)}</span><i></i></button>`;
  }).join('');
}

function pintarImagen() {
  const f = plan.fases[fase];
  if (vista === 'aereo' && !f.aereo) vista = 'mapa';
  const src = ruta(vista === 'aereo' ? f.aereo : f.mapa);
  if (img.dataset.src !== src) {
    img.dataset.src = src;
    img.classList.remove('swap');
    void img.offsetWidth;
    img.src = src;
    img.classList.add('swap');
  }
  img.alt = `${vista === 'aereo' ? 'Vista aérea' : 'Plano'} de Nuevo Herrumbre, fase ${f.romano}`;
  $('tag').textContent = `FASE ${f.romano} · ${vista === 'aereo' ? 'VISTA AÉREA' : 'PLANO'}`;
  $('v-mapa').setAttribute('aria-pressed', vista === 'mapa');
  $('v-aereo').setAttribute('aria-pressed', vista === 'aereo');
  $('v-aereo').disabled = !f.aereo;
  $('stage').classList.toggle('es-aereo', vista === 'aereo');
}

function pintarZonas() {
  svg.innerHTML = '';
  if (vista === 'aereo') return;
  zon.zonas
    .filter((z) => visibleEn(z, fase))
    .map((z) => ({ z, pts: poligono(z) }))
    .sort((a, b) => area(b.pts) - area(a.pts))
    .forEach(({ z, pts }) => {
      const est = estadoZona(z, plan.fases, mes);
      const p = document.createElementNS(NS, 'polygon');
      p.setAttribute('points', pts.map((q) => q.join(',')).join(' '));
      p.setAttribute('class', `zona est-${est}${z.id === selId ? ' sel' : ''}${filtro && z.grupo !== filtro ? ' dim' : ''}`);
      p.setAttribute('tabindex', editar ? '-1' : '0');
      p.setAttribute('role', 'button');
      p.setAttribute('aria-label', `${nombreEn(z, fase)}, ${ESTADOS[est].txt}`);
      p.dataset.id = z.id;
      const t = document.createElementNS(NS, 'title');
      t.textContent = nombreEn(z, fase);
      p.appendChild(t);
      svg.appendChild(p);
    });
}

function pintarZonasLista() {
  const vis = zon.zonas.filter((z) => visibleEn(z, fase));
  $('zonas').innerHTML = zon.grupos.map((g) => {
    const zs = vis.filter((z) => z.grupo === g.id);
    if (!zs.length) return '';
    return `<div class="grupo${filtro === g.id ? ' is-f' : ''}">
      <button class="grupo__h" data-g="${g.id}" aria-pressed="${filtro === g.id}"><i style="background:${g.color}"></i>${esc(g.nombre)}<em>${zs.length}</em></button>
      <div class="grupo__z">${zs.map((z) => `<button class="zchip est-${estadoZona(z, plan.fases, mes)}${z.id === selId ? ' sel' : ''}" data-id="${z.id}">${esc(nombreEn(z, fase))}</button>`).join('')}</div>
    </div>`;
  }).join('');
}

function pintarPanel() {
  paridad ^= 1;
  const z = selId ? zonaPorId(selId) : null;
  const cls = paridad ? 'swap-a' : 'swap-b';
  if (!z || !visibleEn(z, fase)) {
    selId = null;
    const f = plan.fases[fase];
    const e = estadoFase(f, mes);
    $('panel').innerHTML = `<div class="panel__in ${cls}">
      <div class="mono-l">FASE ${f.romano} · ${esc(f.mesesTxt)}</div>
      <h2>${esc(f.nombre)}</h2>
      <div class="panel__chips">${chip(ESTADO_FASE[e].txt, ESTADO_FASE[e].clase)}</div>
      <p>${esc(f.resumen)}</p>
      <div class="mono-l">QUÉ SE CONSTRUYE</div>
      <ul class="hitos">${f.hitos.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
      <p class="pista">Pulsa una zona del plano para ver su ficha.</p>
    </div>`;
    return;
  }
  const f = plan.fases[z.desde];
  const est = estadoZona(z, plan.fases, mes);
  const prog = z.estado ? (z.estado === 'operativa' ? 100 : 0) : Math.round(progresoFase(f, mes) * 100);
  $('panel').innerHTML = `<div class="panel__in ${cls}">
    <div class="mono-l">${esc(grupos[z.grupo].nombre.toUpperCase())}</div>
    <h2>${esc(nombreEn(z, fase))}</h2>
    <div class="panel__chips">${chip(ESTADOS[est].txt, ESTADOS[est].clase)}${chip('FASE ' + f.romano, 'mute')}</div>
    <p>${esc(z.ficha)}</p>
    ${editar && z.nota ? `<p class="nota">Nota: ${esc(z.nota)}</p>` : ''}
    <dl>
      <div><dt>APARECE EN</dt><dd>Fase ${f.romano} · ${esc(f.nombre)}</dd></div>
      <div><dt>PLAZO</dt><dd>${esc(f.mesesTxt)}</dd></div>
      <div><dt>PROGRESO</dt><dd><div class="prog"><i class="${est === 'en-obra' ? 'is-stripes' : ''}" style="width:${prog}%"></i></div><span class="mono-v">${prog} %</span></dd></div>
    </dl>
    <button class="btn btn--ghost" id="volver">Volver a la fase</button>
  </div>`;
}

function todo(cambiaFase) {
  if (cambiaFase) { pintarTabs(); pintarImagen(); }
  pintarZonas();
  pintarZonasLista();
  pintarPanel();
  url();
}

function elegir(id) {
  selId = selId === id ? null : id;
  todo(false);
}

$('tabs').addEventListener('click', (e) => {
  const b = e.target.closest('[data-f]');
  if (!b) return;
  fase = Number(b.dataset.f);
  if (selId && !visibleEn(zonaPorId(selId), fase)) selId = null;
  todo(true);
});

$('vista').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b || b.disabled) return;
  vista = b.id === 'v-aereo' ? 'aereo' : 'mapa';
  pintarImagen();
  pintarZonas();
});

$('contornos').addEventListener('change', (e) => $('stage').classList.toggle('sin-contornos', !e.target.checked));

svg.addEventListener('click', (e) => { const p = e.target.closest('.zona'); if (p && !editar) elegir(p.dataset.id); });
svg.addEventListener('keydown', (e) => {
  const p = e.target.closest('.zona');
  if (p && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); elegir(p.dataset.id); }
});
$('zonas').addEventListener('click', (e) => {
  const z = e.target.closest('[data-id]');
  const g = e.target.closest('[data-g]');
  if (z) elegir(z.dataset.id);
  else if (g) { filtro = filtro === g.dataset.g ? null : g.dataset.g; todo(false); }
});
$('panel').addEventListener('click', (e) => { if (e.target.id === 'volver') { selId = null; todo(false); } });

todo(true);

// Modo editor: ?editar. Pulsar sobre el plano para dibujar un polígono y copiarlo.
if (editar) {
  const ed = $('editor');
  ed.hidden = false;
  const sel = $('ed-zona');
  sel.innerHTML = zon.zonas.map((z) => `<option value="${z.id}">${esc(z.id)}</option>`).join('');
  let pts = [];
  const salida = $('ed-out');
  const dibujar = () => {
    svg.querySelectorAll('.ed').forEach((n) => n.remove());
    if (pts.length) {
      const pl = document.createElementNS(NS, pts.length > 2 ? 'polygon' : 'polyline');
      pl.setAttribute('points', pts.map((q) => q.join(',')).join(' '));
      pl.setAttribute('class', 'ed ed-l');
      svg.appendChild(pl);
      pts.forEach((q) => {
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', q[0]); c.setAttribute('cy', q[1]); c.setAttribute('r', 5);
        c.setAttribute('class', 'ed ed-p');
        svg.appendChild(c);
      });
    }
    salida.value = pts.length ? `"poly": ${JSON.stringify(pts)}` : '';
  };
  svg.addEventListener('click', (e) => {
    if (e.target.closest('.ed-p')) return;
    const r = svg.getBoundingClientRect();
    pts.push([Math.round(((e.clientX - r.left) / r.width) * W), Math.round(((e.clientY - r.top) / r.height) * H)]);
    dibujar();
  });
  $('ed-undo').onclick = () => { pts.pop(); dibujar(); };
  $('ed-clear').onclick = () => { pts = []; dibujar(); };
  $('ed-copy').onclick = async () => {
    salida.select();
    try { await navigator.clipboard.writeText(salida.value); $('ed-copy').textContent = 'Copiado'; } catch { document.execCommand('copy'); }
    setTimeout(() => { $('ed-copy').textContent = 'Copiar'; }, 1200);
  };
  sel.addEventListener('change', () => { selId = sel.value; const z = zonaPorId(selId); if (!visibleEn(z, fase)) fase = z.desde; pts = []; todo(true); dibujar(); });
}
