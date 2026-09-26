(() => {
'use strict';

const RUTA_DATOS = 'codice.json';
const TONO_BASE = 24;
const ACT = { aliado: 'Aliado', neutral: 'Neutral', hostil: 'Hostil', 'sin-datos': 'Sin datos' };
const NIVEL = { 1: 'Rumor', 2: 'Conocido', 3: 'A fondo' };
const ROMANO = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const ARTICULOS = new Set(['la', 'el', 'de', 'del', 'von']);
const TITULOS = new Set([...ARTICULOS, 'lady', 'baron', 'barón', 'maestra', 'maestro', 'don', 'doña']);

const ic = d => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICON = {
  user: ic('<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/>'),
  flag: ic('<path d="M6 21V4"/><path d="M6 5h11l-2.5 4L17 13H6"/>'),
  pin: ic('<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>'),
  lock: ic('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
  search: ic('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>'),
  ext: ic('<path d="M7 17L17 7"/><path d="M8 7h9v9"/>'),
  enter: ic('<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>'),
  warn: ic('<path d="M12 4l9 16H3z"/><path d="M12 10v4"/><path d="M12 17h.01"/>'),
  cross: ic('<path d="M12 3v18"/><path d="M7 8h10"/>'),
  crown: ic('<path d="M4 18h16l1.5-10-5 4L12 5 7.5 12l-5-4z"/><path d="M4 21h16"/>')
};

const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const cap = s => (s ? s[0].toUpperCase() + s.slice(1) : '');
const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');

function md(texto) {
  return String(texto || '').split(/\n{2,}/).map(b => {
    b = b.trim();
    if (!b) return '';
    if (b.startsWith('### ')) return `<h3>${inline(b.slice(4))}</h3>`;
    return `<p>${inline(b).replace(/\n/g, '<br>')}</p>`;
  }).join('');
}

// Datos ---------------------------------------------------------------

let L = [], F = [], P = [];
const mL = new Map(), mF = new Map(), mP = new Map(), hijosDe = new Map();

// Único punto de lectura de datos: si algún día cambian de origen, se toca solo aquí
async function cargarDatos() {
  const r = await fetch(RUTA_DATOS);
  if (!r.ok) throw new Error('No se pudo leer ' + RUTA_DATOS);
  return r.json();
}

function preparar(d) {
  const visibles = a => (a || []).filter(x => x.nivel > 0);
  L = visibles(d.lugares); F = visibles(d.facciones); P = visibles(d.personajes);
  [[L, mL], [F, mF], [P, mP]].forEach(([arr, m]) => { m.clear(); arr.forEach(x => m.set(x.id, x)); });
  hijosDe.clear();
  L.forEach(l => {
    if (l.padre && mL.has(l.padre)) {
      if (!hijosDe.has(l.padre)) hijosDe.set(l.padre, []);
      hijosDe.get(l.padre).push(l);
    }
  });
}

const hijos = id => hijosDe.get(id) || [];
const sub = id => [id, ...hijos(id).flatMap(h => sub(h.id))];
const raices = () => L.filter(l => !l.padre || !mL.has(l.padre));
const vivo = p => p.estado !== 'fallecido';
const sitio = p => p.lugar || p.origen;
const liderInfo = p => {
  const f = p.faccion && mF.get(p.faccion);
  const x = f && (f.lideres || []).find(l => l.personaje === p.id);
  return x ? { f, titulo: x.titulo } : null;
};
const gobierna = p => L.find(l => l.gobierno && l.gobierno.personaje === p.id);
const cabezaPrimero = a => [...a].sort((x, y) => (vivo(y) - vivo(x)) || (!!liderInfo(y) - !!liderInfo(x)));
const contactos = id => { const s = sub(id); return P.filter(p => vivo(p) && s.includes(p.lugar)); };
const miembros = id => cabezaPrimero(P.filter(p => p.faccion === id));
const facsEn = id => F.filter(f => f.sede === id || (f.presencia || []).includes(id));

function cadena(l) {
  const a = [];
  for (let x = l; x; x = x.padre ? mL.get(x.padre) : null) a.unshift(x);
  return a;
}
function ordenLugares() {
  const out = [];
  const rec = l => { out.push(l); hijos(l.id).forEach(rec); };
  raices().forEach(rec);
  return out;
}
function tonoDe(l) {
  const c = cadena(l);
  for (let i = c.length - 1; i >= 0; i--) if (c[i].tono != null) return c[i].tono;
  return TONO_BASE;
}

// Temas ---------------------------------------------------------------

function luminancia(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16 & 255, n >> 8 & 255, n & 255].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function temaFaccion(f) {
  const c = f.colores, claro = f.modo === 'claro';
  const v = {
    '--bg': c.fondo, '--ac': c.acento, '--sc': c.secundario,
    '--tx': claro ? 'color-mix(in srgb,#000 88%,var(--ac))' : 'color-mix(in srgb,#fff 88%,var(--ac))',
    '--dm': 'color-mix(in srgb,var(--tx) 62%,var(--bg))',
    '--ach': claro ? 'color-mix(in srgb,var(--ac) 62%,#000)' : 'color-mix(in srgb,var(--ac) 70%,#fff)',
    '--acl': 'color-mix(in srgb,var(--ac) 65%,#fff)',
    '--on': luminancia(c.acento) > 0.3 ? '#17140e' : '#fff',
    '--g1': `color-mix(in srgb,${c.brillo || c.acento} ${claro ? 40 : 30}%,transparent)`,
    '--lb': c.brillo || c.acento,
    '--eo': claro ? '.6' : '.5'
  };
  if (claro) {
    Object.assign(v, {
      '--g2': 'color-mix(in srgb,var(--sc) 6%,transparent)',
      '--gb': 'linear-gradient(145deg,rgba(255,255,255,.8),rgba(255,255,255,.45))',
      '--gd': 'color-mix(in srgb,var(--ac) 34%,transparent)',
      '--gi': 'inset 0 1px 0 rgba(255,255,255,.95)',
      '--gs': '0 12px 30px color-mix(in srgb,var(--ac) 18%,transparent)',
      '--ln': 'color-mix(in srgb,var(--tx) 12%,transparent)',
      '--b2': 'var(--sc)', '--b2t': 'var(--bg)', '--b2b': 'var(--sc)',
      '--ok': '#2f9e6b', '--no': '#c0352f', '--ne': '#8a8577'
    });
  } else {
    Object.assign(v, {
      '--g2': 'color-mix(in srgb,var(--ac) 14%,transparent)',
      '--gb': 'linear-gradient(145deg,rgba(255,255,255,.09),rgba(255,255,255,.025))',
      '--gd': 'rgba(255,255,255,.12)',
      '--gi': 'inset 0 1px 0 rgba(255,255,255,.14)',
      '--gs': '0 12px 32px rgba(0,0,0,.35)',
      '--ln': 'rgba(255,255,255,.09)',
      '--b2': 'rgba(255,255,255,.04)', '--b2t': 'var(--tx)', '--b2b': 'color-mix(in srgb,var(--sc) 70%,transparent)',
      '--ok': '#4cc38a', '--no': '#ff6b6b', '--ne': '#d8d4c8'
    });
  }
  return v;
}

const temaLugar = l => ({ '--h': tonoDe(l) });
const temaBase = () => ({ '--h': TONO_BASE });

function temaPersona(p) {
  const f = p.faccion && mF.get(p.faccion);
  if (f) return temaFaccion(f);
  const l = sitio(p) && mL.get(sitio(p));
  return l ? temaLugar(l) : temaBase();
}

const nombreHtml = n => esc(n).replace(/(&quot;.+?&quot;|«.+?»)/g, '<em>$1</em>');
const estilo = t => Object.entries(t).map(([k, v]) => `${k}:${v}`).join(';');

// Piezas visuales -----------------------------------------------------

function emblema(f) {
  const e = f.emblema || {};
  const letra = esc((e.letra || f.nombre.replace(/^Casa /, '')).slice(0, 1).toUpperCase());
  const txt = `<text x="100" y="121" text-anchor="middle" font-family="Cormorant Garamond,serif" font-size="62" font-weight="600" style="fill:var(--ach)">${letra}</text>`;
  const st = (c, w = 1.5) => `stroke-width="${w}" style="stroke:var(--${c})"`;
  const aro = `<circle class="giro" cx="100" cy="100" r="92" fill="none" stroke-dasharray="3 6" ${st('sc', 1)}/>`;
  const radios = (n, r1, r2, w) => Array.from({ length: n }, (_, i) => {
    const a = i * 2 * Math.PI / n;
    return `<line x1="${(100 + r1 * Math.cos(a)).toFixed(1)}" y1="${(100 + r1 * Math.sin(a)).toFixed(1)}" x2="${(100 + r2 * Math.cos(a)).toFixed(1)}" y2="${(100 + r2 * Math.sin(a)).toFixed(1)}" ${st('ac', w)}/>`;
  }).join('');
  let cuerpo;
  if (e.tipo === 'rombo') {
    cuerpo = `<circle cx="100" cy="100" r="92" fill="none" ${st('ac')}/><circle class="giro" cx="100" cy="100" r="80" fill="none" stroke-dasharray="3 5" ${st('sc', 1)}/><path d="M100 32L168 100L100 168L32 100Z" fill="none" ${st('ac')}/><path d="M100 56L144 100L100 144L56 100Z" opacity=".4" style="fill:var(--sc)"/>`;
  } else if (e.tipo === 'sol') {
    cuerpo = `<g class="giro">${radios(24, 82, 95, 1.5)}</g><circle cx="100" cy="100" r="76" fill="none" ${st('ac')}/><circle cx="100" cy="100" r="64" fill="none" ${st('sc', 1)}/>`;
  } else if (e.tipo === 'engranaje') {
    cuerpo = `<g class="giro">${radios(10, 70, 88, 11)}</g><circle cx="100" cy="100" r="70" fill="none" ${st('ac')}/><circle cx="100" cy="100" r="54" fill="none" stroke-dasharray="3 5" ${st('sc', 1)}/>`;
  } else if (e.tipo === 'escudo') {
    cuerpo = `${aro}<path d="M100 30L160 50V102C160 136 134 162 100 174C66 162 40 136 40 102V50Z" fill="none" ${st('ac')}/><path d="M100 46L146 62V102C146 128 126 148 100 158C74 148 54 128 54 102V62Z" opacity=".14" style="fill:var(--ac)"/>`;
  } else if (e.tipo === 'cuna') {
    cuerpo = `${aro}<path d="M44 54H156L100 160Z" fill="none" ${st('ac')}/><path d="M100 54V96L88 112" fill="none" ${st('sc', 1)}/>`;
  } else {
    cuerpo = `<circle cx="100" cy="100" r="90" fill="none" ${st('ac')}/><circle class="giro" cx="100" cy="100" r="74" fill="none" stroke-dasharray="3 5" ${st('sc', 1)}/><circle cx="100" cy="100" r="58" opacity=".18" style="fill:var(--ac)"/>`;
  }
  return `<svg class="emb" viewBox="0 0 200 200" aria-hidden="true">${cuerpo}${txt}</svg>`;
}

const esfera = (l, px) => `<span class="sph th" style="--h:${tonoDe(l)}${px ? `;width:${px}px;height:${px}px` : ''}"></span>`;

function iniciales(nombre) {
  const w = nombre.replace(/["«»“”]/g, '').split(/\s+/).filter(Boolean);
  let s = w.filter(x => !TITULOS.has(x.toLowerCase()));
  if (s.length < 2) s = w.filter(x => !ARTICULOS.has(x.toLowerCase()));
  if (!s.length) return '?';
  return (s[0][0] + (s.length > 1 ? s[s.length - 1][0] : '')).toUpperCase();
}

function avatar(p, extra = '') {
  const m = vivo(p) ? '' : ' muerto-av';
  if (p.nivel === 1) return `<span class="av rum-av ${extra}">?</span>`;
  const foto = p.retrato ? `<img src="${esc(p.retrato)}" alt="" loading="lazy" decoding="async" onerror="this.remove()">` : '';
  return `<span class="av${m} ${extra}">${esc(iniciales(p.nombre))}${foto}</span>`;
}

function etiquetaActitud(p) {
  const k = p.actitud || 'sin-datos';
  return k === 'aliado' && p.genero === 'f' ? 'Aliada' : ACT[k] || ACT['sin-datos'];
}
const pildoraActitud = p => (vivo(p)
  ? `<span class="pill"><i class="dot a-${esc(p.actitud || 'sin-datos')}"></i>${etiquetaActitud(p)}</span>`
  : `<span class="pill luto">${ICON.cross}Fallecido</span>`);

const hrefDe = (tipo, id, tab) => `#/${tipo}/${encodeURIComponent(id)}${tab ? '/' + tab : ''}`;
const chipLugar = l => `<a class="chip gl" href="${hrefDe('lugar', l.id)}" data-peek="lugar:${esc(l.id)}">${ICON.pin}${esc(l.nombre)}</a>`;
const chipFaccion = f => `<a class="chip gl" href="${hrefDe('faccion', f.id)}" data-peek="faccion:${esc(f.id)}">${ICON.flag}${esc(f.nombre)}</a>`;
const chipOrigen = l => `<a class="chip gl" href="${hrefDe('lugar', l.id)}" data-peek="lugar:${esc(l.id)}">${ICON.pin}Origen: ${esc(l.nombre)}</a>`;
const chipPersona = p => `<a class="chip gl${vivo(p) ? '' : ' muerto'}" href="${hrefDe('personaje', p.id)}" data-peek="personaje:${esc(p.id)}">${liderInfo(p) || gobierna(p) ? ICON.crown : ICON.user}${esc(p.nombre)}</a>`;

function pillsPersona(p, destacada) {
  const out = [];
  const g = gobierna(p), li = liderInfo(p);
  if (!destacada && g && vivo(p)) out.push(`<span class="pill gob">${ICON.crown}${esc(g.gobierno.titulo)} de ${esc(g.nombre)}</span>`);
  if (!destacada && li) out.push(`<span class="pill lider">${ICON.crown}${esc(li.titulo)}</span>`);
  if (!vivo(p) || (p.actitud && p.actitud !== 'sin-datos')) out.push(pildoraActitud(p));
  if (p.legajo) out.push('<span class="pill tri">Tripulación</span>');
  return out.length ? `<span class="pcs">${out.join('')}</span>` : '';
}

function dondeEsta(p) {
  const l = sitio(p) && mL.get(sitio(p));
  return l ? `<small class="donde">${ICON.pin}${p.lugar ? '' : 'Origen: '}${esc(l.nombre)}</small>` : '';
}

function cartaPersona(p) {
  const rum = p.nivel === 1;
  return `<a class="pc gl${rum ? ' rum' : ''}${vivo(p) ? '' : ' muerto'}" href="${hrefDe('personaje', p.id)}" data-peek="personaje:${esc(p.id)}">
    ${avatar(p)}<span class="pc-t"><b>${nombreHtml(p.nombre)}</b><small class="cg2">${esc(p.cargo)}</small>${dondeEsta(p)}${pillsPersona(p)}</span></a>`;
}

function cartaLider(p, nota = '') {
  const f = p.faccion && mF.get(p.faccion), li = liderInfo(p), g = gobierna(p), muerto = !vivo(p);
  const tags = `${g && !muerto ? `<span class="tag-gob">${ICON.crown}${esc(g.gobierno.titulo)} de ${esc(g.nombre)}</span>` : ''}${li ? `<span class="tag-lid">${esc(li.titulo)}</span>` : ''}`;
  return `<a class="pc-lider${muerto ? ' muerto' : ''}" style="${esc(f ? estilo(temaFaccion(f)) : '')}" href="${hrefDe('personaje', p.id)}" data-peek="personaje:${esc(p.id)}">
    <span class="lid-av">${avatar(p)}</span>
    <span class="lid-t"><span class="lid-tags">${tags}</span><b>${nombreHtml(p.nombre)}</b>${g && !muerto && p.cargo === `${g.gobierno.titulo} de ${g.nombre}` ? '' : `<small class="cg2">${esc(p.cargo)}</small>`}${dondeEsta(p)}${pillsPersona(p, true)}${nota ? `<span class="lid-nota">${esc(nota)}</span>` : ''}</span></a>`;
}

function cartaLugar(l) {
  const n = contactos(l.id).length;
  const rum = l.nivel === 1;
  return `<a class="lc gl th${rum ? ' rum' : ''}" style="--h:${tonoDe(l)}" href="${hrefDe('lugar', l.id)}" data-peek="lugar:${esc(l.id)}">
    ${esfera(l)}<span class="pc-t"><b>${esc(l.nombre)}</b><small>${cap(esc(l.tipo))}</small><span class="pcs">${rum ? '<span class="pill">Solo rumor</span>' : `<span class="pill">${n} contacto${n === 1 ? '' : 's'}</span>`}</span></span></a>`;
}

function cartaFaccion(f) {
  const n = miembros(f.id).length;
  const rum = f.nivel === 1, ext = f.estado === 'extinta';
  const jefe = (f.lideres || []).map(x => mP.get(x.personaje)).find(Boolean);
  const lugares = new Set([f.sede, ...(f.presencia || [])].filter(id => id && mL.has(id))).size;
  const pills = rum ? '<span class="pill">Solo rumor</span>'
    : `<span class="pill">${n} miembro${n === 1 ? '' : 's'}</span>${ext ? `<span class="pill luto">${ICON.cross}Extinta</span>` : `<span class="pill">${lugares} lugar${lugares === 1 ? '' : 'es'}</span>`}`;
  return `<a class="fcard${f.modo === 'claro' ? ' claro' : ''}${rum ? ' rum' : ''}${ext ? ' extinta' : ''}" style="${esc(estilo(temaFaccion(f)))}" href="${hrefDe('faccion', f.id)}" data-peek="faccion:${esc(f.id)}">
    <span class="fc-emb">${emblema(f)}</span>
    <span class="fc-t"><b>${esc(f.nombre)}</b><small>${esc(f.tipo)}</small>${jefe ? `<span class="lidera">${ICON.crown}${nombreHtml(jefe.nombre)}</span>` : ''}<span class="pcs">${pills}</span></span></a>`;
}

const reconocido = n => `<div class="kv blk"><span class="kl"><span>Reconocido</span><span>${esc(NIVEL[n] || '')}</span></span><div class="pg"><i style="width:${Math.round(n / 3 * 100)}%"></i></div></div>`;
const fila = (k, v) => `<div class="kv"><span>${esc(k)}</span><span>${v}</span></div>`;
const vacio = t => `<p class="vacio">${esc(t)}</p>`;

function migas(partes) {
  return `<nav class="crumbs" aria-label="Ruta">${partes.map(p => p.href ? `<a href="${p.href}">${esc(p.t)}</a>` : `<span aria-current="page">${esc(p.t)}</span>`).join('<i aria-hidden="true">/</i>')}</nav>`;
}

function pestanas(base, lista, actual) {
  return `<nav class="tabs gl" aria-label="Secciones">${lista.map(t => t.bloqueada
    ? `<span class="lk-tab" aria-disabled="true" title="Sin reconocer aún">${ICON.lock}${esc(t.t)}</span>`
    : `<a href="${base}${t.k ? '/' + t.k : ''}"${t.k === actual || (!t.k && !actual) ? ' class="on" aria-current="page"' : ''}>${esc(t.t)}</a>`).join('')}</nav>`;
}

function avisoCorrupto(texto) {
  return `<div class="banner">${ICON.warn}<span>${esc(texto)}</span></div>
  <div class="censura" aria-hidden="true"><i style="width:82%"></i><i style="width:64%"></i><i style="width:74%"></i></div>`;
}

// Vistas --------------------------------------------------------------

const S = { p: { l: '', a: 'todas', q: '' }, l: { l: '', q: '' }, f: { q: '' } };
let listaActual = null;

function buscadorHtml() {
  return `<div class="search gl" role="search">${ICON.search}<input id="q" type="search" placeholder="Buscar en el registro" aria-label="Buscar en todo el registro" autocomplete="off"><div id="qres" class="qres gl" hidden></div></div>`;
}

function vistaHub() {
  const rum = [...P, ...F, ...L].filter(x => x.nivel === 1).length;
  const tiraP = P.filter(p => p.nivel > 1).slice(0, 4).map(p => {
    const f = p.faccion && mF.get(p.faccion);
    return `<span${f ? ` style="--ac:${esc(f.colores.acento)}"` : ''}>${avatar(p)}</span>`;
  }).join('');
  const tiraF = F.filter(f => f.nivel > 1).slice(0, 3).map(f => `<span class="mini-emb${f.modo === 'claro' ? ' claro' : ''}" style="${esc(estilo(temaFaccion(f)))}">${emblema(f)}</span>`).join('');
  const tiraL = L.filter(l => l.nivel > 1 && l.padre).slice(0, 4).map((l, i) => esfera(l, 50 + (i % 2) * 22)).join('');
  const tarjeta = (href, hue, titulo, desc, n, motivo, clase) => `<a class="hc gl th ${clase}" style="--h:${hue}" href="${href}">
    <span class="motif">${motivo}</span>
    <span class="hc-b"><b>${titulo}</b><small>${desc}</small><span class="hc-f"><span class="pill">${n} ficha${n === 1 ? '' : 's'}</span><span class="go">Entrar${ICON.enter}</span></span></span></a>`;
  const html = `<header class="hub-h">
      <h1>Códice</h1>
      <p class="lede">Las personas, casas y mundos que la tripulación de la Asterión ha ido conociendo en La Cicatriz.${rum ? ` Quedan ${rum} rumor${rum === 1 ? '' : 'es'} por aclarar.` : ''}</p>
      ${buscadorHtml()}
    </header>
    <div class="hub-grid">
      ${tarjeta('#/personajes', 24, 'Personajes', 'Quién es quién, dónde está y de quién se fía la tripulación.', P.length, `<span class="stack">${tiraP}</span>`, 'hc-p')}
      ${tarjeta('#/facciones', 44, 'Facciones', 'Casas, órdenes y redes de poder, cada una con su propia identidad.', F.length, `<span class="stack">${tiraF}</span>`, 'hc-f2')}
      ${tarjeta('#/lugares', 200, 'Lugares', 'Sistemas, mundos, lunas y ciudades, del más lejano al más cercano.', L.length, `<span class="stack">${tiraL}</span>`, 'hc-l')}
    </div>`;
  return { html, tema: temaBase(), titulo: 'Códice' };
}

function cabecera(titulo, n, lede) {
  return `${migas([{ t: 'Códice', href: '#/' }, { t: titulo }])}
  <header class="sec-h"><h1>${titulo}</h1><span class="pill n">${n}</span></header><p class="lede">${lede}</p>`;
}

function arbolHtml(cuenta, sel, ocultarVacios) {
  const nodo = (l, d) => {
    const n = cuenta(l);
    if (!n && ocultarVacios) return '';
    return `<button type="button" class="ti${sel === l.id ? ' on' : ''}" data-act="lugar" data-v="${esc(l.id)}" style="--d:${d}"><span>${esc(l.nombre)}</span><b>${n || ''}</b></button>${hijos(l.id).map(k => nodo(k, d + 1)).join('')}`;
  };
  return `<button type="button" class="ti${!sel ? ' on' : ''}" data-act="lugar" data-v="" style="--d:0"><span>Todos</span><b>${cuenta(null)}</b></button>${raices().map(r => nodo(r, 0)).join('')}`;
}

function vistaLista(tipo) {
  listaActual = tipo;
  if (tipo === 'personajes') {
    const s = S.p;
    const seg = [['todas', 'Todas'], ['aliado', 'Aliados'], ['neutral', 'Neutrales'], ['hostil', 'Hostiles'], ['fallecidos', 'Fallecidos']]
      .map(([k, t]) => `<button type="button" data-act="actitud" data-v="${k}" aria-pressed="${s.a === k}">${t}</button>`).join('');
    const html = `${cabecera('Personajes', P.length, 'Todas las personas que la tripulación ha conocido, según dónde están.')}
      <div class="tools"><div class="seg" role="group" aria-label="Filtrar por actitud">${seg}</div>
      <label class="find gl">${ICON.search}<input id="fq" type="search" placeholder="Buscar personaje" aria-label="Buscar personaje" value="${esc(s.q)}" autocomplete="off"></label></div>
      <div class="lay"><nav class="tree gl" id="tree" aria-label="Filtrar por lugar"></nav><section id="gal" aria-live="polite"></section></div>`;
    return { html, tema: temaBase(), titulo: 'Personajes', tras: pintarLista };
  }
  if (tipo === 'lugares') {
    const html = `${cabecera('Lugares', L.length, 'Los sistemas y mundos que la nave ha cruzado o de los que ha oído hablar.')}
      <div class="tools"><label class="find gl">${ICON.search}<input id="fq" type="search" placeholder="Buscar lugar" aria-label="Buscar lugar" value="${esc(S.l.q)}" autocomplete="off"></label></div>
      <div class="lay"><nav class="tree gl" id="tree" aria-label="Filtrar por lugar"></nav><section id="gal" aria-live="polite"></section></div>`;
    return { html, tema: temaBase(), titulo: 'Lugares', tras: pintarLista };
  }
  const html = `${cabecera('Facciones', F.length, 'Casas, órdenes y redes de poder. Cada una se ve con sus propios colores.')}
    <div class="tools"><label class="find gl">${ICON.search}<input id="fq" type="search" placeholder="Buscar facción" aria-label="Buscar facción" value="${esc(S.f.q)}" autocomplete="off"></label></div>
    <section id="gal" aria-live="polite"></section>`;
  return { html, tema: temaBase(), titulo: 'Facciones', tras: pintarLista };
}

function pintarLista() {
  const gal = $('#gal');
  if (!gal) return;
  if (listaActual === 'personajes') {
    const s = S.p;
    const set = s.l ? new Set(sub(s.l)) : null;
    const lista = P.filter(p => (!set || set.has(sitio(p)))
      && (s.a === 'todas' || (s.a === 'fallecidos' ? !vivo(p) : p.actitud === s.a))
      && (!s.q || norm(p.nombre + ' ' + p.cargo).includes(norm(s.q))));
    $('#tree').innerHTML = arbolHtml(l => (l ? P.filter(p => sub(l.id).includes(sitio(p))).length : P.length), s.l, true);
    document.querySelectorAll('[data-act="actitud"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === s.a)));
    const grupos = new Map();
    lista.forEach(p => {
      const k = p.faccion && mF.has(p.faccion) ? p.faccion : '_';
      if (!grupos.has(k)) grupos.set(k, []);
      grupos.get(k).push(p);
    });
    const orden = [...F.filter(f => f.estado !== 'extinta').map(f => f.id), '_', ...F.filter(f => f.estado === 'extinta').map(f => f.id)];
    const html = orden.filter(k => grupos.has(k)).map(k => (k === '_' ? grupoSinFaccion(cabezaPrimero(grupos.get(k))) : grupoFaccion(mF.get(k), cabezaPrimero(grupos.get(k))))).join('');
    gal.innerHTML = html || `<div class="empty gl"><p>Nadie coincide con este filtro.</p><button type="button" data-act="limpiar">Quitar filtros</button></div>`;
  } else if (listaActual === 'lugares') {
    const s = S.l;
    const set = s.l ? new Set(sub(s.l)) : null;
    const lista = L.filter(l => (!set || set.has(l.id)) && (!s.q || norm(l.nombre + ' ' + l.tipo).includes(norm(s.q))));
    $('#tree').innerHTML = arbolHtml(l => (l ? sub(l.id).length - 1 : L.length), s.l, false);
    const porRaiz = new Map();
    lista.forEach(l => {
      const r = cadena(l)[0];
      if (!porRaiz.has(r.id)) porRaiz.set(r.id, []);
      porRaiz.get(r.id).push(l);
    });
    const html = raices().filter(r => porRaiz.has(r.id)).map(r => {
      let items = porRaiz.get(r.id);
      if (items.length > 1) items = items.filter(x => x.id !== r.id);
      return `<div class="grp"><h2 class="gh"><a href="${hrefDe('lugar', r.id)}">${esc(r.nombre)}</a><small>${cap(esc(r.tipo))}</small></h2><div class="grid">${items.map(cartaLugar).join('')}</div></div>`;
    }).join('');
    gal.innerHTML = html || `<div class="empty gl"><p>Ningún lugar coincide con la búsqueda.</p><button type="button" data-act="limpiar">Quitar filtros</button></div>`;
  } else {
    const q = S.f.q;
    const lista = F.filter(f => !q || norm(f.nombre + ' ' + f.tipo).includes(norm(q)));
    gal.innerHTML = lista.length ? `<div class="grid fgrid">${lista.map(cartaFaccion).join('')}</div>` : `<div class="empty gl"><p>Ninguna facción coincide con la búsqueda.</p><button type="button" data-act="limpiar">Quitar filtros</button></div>`;
  }
}

function vinculosHtml(p) {
  const filas = (p.vinculos || []).map(v => {
    if (v.personaje) {
      const o = mP.get(v.personaje);
      return o ? `<a class="vn gl" href="${hrefDe('personaje', o.id)}" data-peek="personaje:${esc(o.id)}"><span>${esc(o.nombre)}</span><small>${esc(v.rel)}</small></a>` : '';
    }
    if (v.legajo) return `<a class="vn gl" href="../legajos/index.html#${esc(v.legajo)}"><span>${esc(v.nombre)}</span><small>Tripulación · ${esc(v.rel)}</small></a>`;
    return '';
  }).join('');
  return filas ? `<h3>Vínculos</h3><div class="vns">${filas}</div>` : '';
}

const sitiosDe = f => [...new Set([f.sede, ...(f.presencia || [])].filter(id => id && mL.has(id)))].map(id => mL.get(id));

function grupoFaccion(f, gente) {
  const lideres = gente.filter(p => liderInfo(p));
  const resto = gente.filter(p => !liderInfo(p));
  const ext = f.estado === 'extinta';
  return `<section class="fgrp${f.modo === 'claro' ? ' claro' : ''}${ext ? ' extinta' : ''}" style="${esc(estilo(temaFaccion(f)))}">
    <header class="fgh"><a class="fc-emb" href="${hrefDe('faccion', f.id)}" aria-label="${esc(f.nombre)}">${emblema(f)}</a>
      <div class="fgh-t"><h2><a href="${hrefDe('faccion', f.id)}">${esc(f.nombre)}</a></h2><small>${esc(f.tipo)}${ext ? ', extinta' : ''}</small>
        <div class="pres">${sitiosDe(f).map(l => `<a class="chip gl mini" href="${hrefDe('lugar', l.id)}">${ICON.pin}${esc(l.nombre)}</a>`).join('')}</div></div>
      <span class="pill n">${gente.length}</span></header>
    ${lideres.map(p => cartaLider(p)).join('')}
    ${resto.length ? `<div class="grid">${resto.map(cartaPersona).join('')}</div>` : ''}
  </section>`;
}

function grupoSinFaccion(gente) {
  return `<section class="fgrp sinf"><header class="fgh"><div class="fgh-t"><h2>Sin facción</h2><small>Independientes y personas sin bando conocido</small></div><span class="pill n">${gente.length}</span></header>
    <div class="grid">${gente.map(cartaPersona).join('')}</div></section>`;
}

function contactosPorFaccion(gente) {
  const partes = F.map(f => {
    const g = cabezaPrimero(gente.filter(p => p.faccion === f.id));
    return g.length ? `<div class="mg${f.modo === 'claro' ? ' claro' : ''}" style="${esc(estilo(temaFaccion(f)))}"><a class="mg-h" href="${hrefDe('faccion', f.id)}"><span class="mini-emb">${emblema(f)}</span><span>${esc(f.nombre)}</span><b>${g.length}</b></a><div class="chips">${g.map(chipPersona).join('')}</div></div>` : '';
  });
  const sin = gente.filter(p => !p.faccion || !mF.has(p.faccion));
  if (sin.length) partes.push(`<div class="mg"><div class="mg-h"><span>Sin facción</span><b>${sin.length}</b></div><div class="chips">${sin.map(chipPersona).join('')}</div></div>`);
  return partes.join('');
}

function fichaPersonaje(p, tab) {
  const f = p.faccion && mF.get(p.faccion);
  const l = p.lugar && mL.get(p.lugar);
  const o = !l && p.origen && mL.get(p.origen);
  const rum = p.nivel === 1, muerto = !vivo(p);
  const caps = rum ? [] : (p.capitulos || []);
  const idx = /^c\d+$/.test(tab || '') ? +tab.slice(1) : -1;
  const base = hrefDe('personaje', p.id);
  const lista = [{ k: '', t: 'Ficha' }, ...caps.map((c, i) => ({ k: 'c' + i, t: caps.length > 1 ? `Capítulo ${ROMANO[i] || i + 1}` : 'Capítulo' }))];
  const legajo = p.legajo ? `../legajos/index.html#${encodeURIComponent(p.legajo)}` : '';
  const li = liderInfo(p), g = gobierna(p), brilla = !!(li || g) && !muerto;

  let main;
  if (rum) {
    main = `${avisoCorrupto('Archivo parcialmente corrupto')}<p class="vacio">Solo se sabe que existe. Cuando la tripulación averigüe quién es, esta ficha se completará.</p>`;
  } else if (idx >= 0 && caps[idx]) {
    main = `<article class="cap"><h3>${esc(caps[idx].titulo)}</h3>${md(caps[idx].texto)}</article>`;
  } else {
    const avisoGob = g && !muerto ? `<div class="aviso gob">${ICON.crown}<span><b>${esc(g.gobierno.titulo)} de <a href="${hrefDe('lugar', g.id)}">${esc(g.nombre)}</a></b>${g.gobierno.nota ? `<br>${esc(g.gobierno.nota)}` : ''}</span></div>` : '';
    const avisos = `${avisoGob}${legajo ? `<div class="aviso tri"><span>Forma parte de la tripulación. Su historia completa está en los legajos.</span><a class="btn s" href="${legajo}">Ver legajo${ICON.ext}</a></div>` : ''}`;
    const dondeLugar = l || o;
    main = `${avisos}${p.resumen ? md(p.resumen) : vacio('Todavía no hay ninguna nota de la tripulación sobre esta persona.')}${vinculosHtml(p)}
      <div class="acc">${dondeLugar ? `<a class="btn" href="${hrefDe('lugar', dondeLugar.id)}">Ver lugar</a>` : ''}${f ? `<a class="btn s" href="${hrefDe('faccion', f.id)}">Ver facción</a>` : ''}</div>`;
  }

  const datos = `${f ? fila('Facción', `<a href="${hrefDe('faccion', f.id)}">${esc(f.nombre)}</a>`) : ''}
    ${l ? fila('Lugar', `<a href="${hrefDe('lugar', l.id)}">${esc(l.nombre)}</a>`) : ''}${o ? fila('Origen', `<a href="${hrefDe('lugar', o.id)}">${esc(o.nombre)}</a>`) : ''}
    ${g ? fila('Gobierna', `<a href="${hrefDe('lugar', g.id)}">${esc(g.nombre)}</a>`) : ''}${li ? fila(muerto ? 'Lideraba' : 'Lidera', `<a href="${hrefDe('faccion', li.f.id)}">${esc(li.f.nombre)}</a>`) : ''}
    ${muerto ? fila('Estado', 'Fallecido') : fila('Actitud', esc(etiquetaActitud(p)) + (p.nota ? `<br><small>${esc(p.nota)}</small>` : ''))}
    ${legajo ? fila('Tripulación', `<a href="${legajo}">Ver legajo</a>`) : ''}
    ${p.vista ? fila('Conocido desde', esc(p.vista)) : ''}${reconocido(p.nivel)}`;

  const retrato = p.retrato && !rum
    ? `<span class="ret${muerto ? ' muerto-av' : ''}${brilla ? ' lider' : ''}"><span class="ret-i">${esc(iniciales(p.nombre))}</span><img src="${esc(p.retrato)}" alt="Retrato de ${esc(p.nombre)}" decoding="async" onerror="this.remove()"></span>`
    : `<span class="md gl${muerto ? ' muerto-av' : ''}${brilla ? ' lider' : ''}">${rum ? '?' : esc(iniciales(p.nombre))}</span>`;

  const html = `${migas([{ t: 'Códice', href: '#/' }, { t: 'Personajes', href: '#/personajes' }, { t: p.nombre }])}
    <header class="hero${muerto ? ' muerto' : ''}">${retrato}<div class="hero-t"><h1 class="${brilla ? 'lid' : ''}">${nombreHtml(p.nombre)}</h1><p class="cg">${esc(p.cargo)}</p>
      <div class="rw">${g && !muerto ? `<span class="tag-gob">${ICON.crown}${esc(g.gobierno.titulo)} de ${esc(g.nombre)}</span>` : ''}${li ? `<span class="tag-lid">${esc(li.titulo)}</span>` : ''}${!vivo(p) || (p.actitud && p.actitud !== 'sin-datos') ? pildoraActitud(p) : ''}${p.legajo ? '<span class="pill tri">Tripulación</span>' : ''}${l ? chipLugar(l) : ''}${o ? chipOrigen(o) : ''}${f ? chipFaccion(f) : ''}</div></div></header>
    ${caps.length ? pestanas(base, lista, tab && idx >= 0 ? tab : '') : ''}
    <div class="gr"><div class="main">${main}</div><aside class="gl hl ib"><h2>Datos</h2>${datos}</aside></div>`;

  const deco = f && !rum ? `<div class="deco">${emblema(f)}</div>` : (l || o) ? `<div class="deco">${esfera(l || o)}</div>` : '';
  return { html, tema: temaPersona(p), deco, titulo: p.nombre };
}

function fichaLugar(l, tab) {
  const rum = l.nivel === 1;
  const secs = rum ? [] : (l.secciones || []);
  const idx = /^s\d+$/.test(tab || '') ? +tab.slice(1) : -1;
  const base = hrefDe('lugar', l.id);
  const lista = [{ k: '', t: 'Resumen' }, ...secs.map((s, i) => ({ k: 's' + i, t: s.titulo, bloqueada: s.texto == null }))];
  const ruta = cadena(l);
  const gente = contactos(l.id);
  const origenes = P.filter(p => p.origen && sub(l.id).includes(p.origen));
  const muertos = P.filter(p => !vivo(p) && sub(l.id).includes(p.lugar));
  const facs = facsEn(l.id).filter(f => f.nivel > 0);
  const dentro = hijos(l.id);
  const gob = l.gobierno && mP.get(l.gobierno.personaje);

  let main;
  if (rum) {
    main = `${avisoCorrupto('Lugar sin cartografiar')}<p class="vacio">La tripulación ha oído hablar de este lugar, pero nadie lo ha visitado todavía.</p>`;
  } else if (idx >= 0 && secs[idx] && secs[idx].texto != null) {
    main = `<article class="cap"><h3>${esc(secs[idx].titulo)}</h3>${md(secs[idx].texto)}</article>`;
  } else {
    const bloqueadas = secs.filter(s => s.texto == null);
    main = `${l.resumen ? md(l.resumen) : vacio('Aún no hay resumen de este lugar.')}
      <h3>Contactos</h3>${gente.length ? contactosPorFaccion(gente) : vacio('Todavía no conoces a nadie aquí.')}
      ${origenes.length ? `<h3>Tripulantes de origen</h3><div class="chips">${origenes.map(chipPersona).join('')}</div>` : ''}
      ${muertos.length ? `<h3>Fallecidos</h3><div class="chips">${muertos.map(chipPersona).join('')}</div>` : ''}
      ${facs.length ? `<h3>Facciones con presencia</h3><div class="chips">${facs.map(chipFaccion).join('')}</div>` : ''}
      ${dentro.length ? `<h3>Dentro de este lugar</h3><div class="chips">${dentro.map(chipLugar).join('')}</div>` : ''}
      ${bloqueadas.length ? `<div class="locked">${ICON.lock}<span>${bloqueadas.length === 1 ? 'Una sección sin reconocer' : bloqueadas.length + ' secciones sin reconocer'}</span></div>` : ''}
      <div class="acc">${l.atlas ? `<a class="btn" href="${esc(l.atlas)}">Ver en el atlas${ICON.ext}</a>` : ''}${l.superficie ? `<a class="btn s" href="${esc(l.superficie)}">Superficie 3D${ICON.ext}</a>` : ''}</div>`;
  }

  const padre = l.padre && mL.get(l.padre);
  const datos = `${fila('Tipo', cap(esc(l.tipo)))}${padre ? fila('Dentro de', `<a href="${hrefDe('lugar', padre.id)}">${esc(padre.nombre)}</a>`) : ''}
    ${gob ? fila('Gobierno', `<a href="${hrefDe('personaje', gob.id)}">${esc(gob.nombre)}</a>`) : ''}
    ${Object.entries(l.datos || {}).map(([k, v]) => fila(k, esc(v))).join('')}${reconocido(l.nivel)}`;

  const partes = [{ t: 'Códice', href: '#/' }, { t: 'Lugares', href: '#/lugares' }, ...ruta.slice(0, -1).map(x => ({ t: x.nombre, href: hrefDe('lugar', x.id) })), { t: l.nombre }];
  const html = `${migas(partes)}
    <header class="hero"><div class="hero-t"><h1>${esc(l.nombre)}</h1><p class="cg">${cap(esc(l.tipo))}</p>
      <div class="rw"><span class="pill"><i class="dot on"></i>${esc(rum ? 'Solo rumor' : NIVEL[l.nivel] === 'A fondo' ? 'Explorado a fondo' : 'Visitado')}</span></div></div></header>
    ${gob && !rum ? `<section class="gobierno">${cartaLider(gob, l.gobierno.nota)}</section>` : ''}
    ${secs.length ? pestanas(base, lista, tab && idx >= 0 ? tab : '') : ''}
    <div class="gr"><div class="main">${main}</div><aside class="gl hl ib"><h2>Datos</h2>${datos}</aside></div>`;
  return { html, tema: temaLugar(l), deco: `<div class="deco">${esfera(l)}</div>`, titulo: l.nombre };
}

function fichaFaccion(f, tab) {
  const rum = f.nivel === 1;
  const gente = miembros(f.id);
  const idsLugares = [...new Set([f.sede, ...(f.presencia || [])].filter(id => id && mL.has(id)))];
  const secs = rum ? [] : (f.secciones || []);
  const idx = /^s\d+$/.test(tab || '') ? +tab.slice(1) : -1;
  const base = hrefDe('faccion', f.id);
  const lista = rum ? [] : [{ k: '', t: 'Resumen' }, { k: 'miembros', t: `Miembros (${gente.length})` }, { k: 'presencia', t: `Presencia (${idsLugares.length})` },
    ...secs.map((s, i) => ({ k: 's' + i, t: s.titulo, bloqueada: s.texto == null }))];
  const sede = f.sede && mL.get(f.sede);

  let main;
  if (rum) {
    main = `${avisoCorrupto('Archivo parcialmente corrupto')}<p class="vacio">Se ha oído hablar de ellos, pero nadie sabe todavía quiénes son.</p>`;
  } else if (tab === 'miembros') {
    const ls = gente.filter(p => liderInfo(p)), rs = gente.filter(p => !liderInfo(p));
    main = gente.length ? `${ls.map(p => cartaLider(p)).join('')}${rs.length ? `<div class="grid">${rs.map(cartaPersona).join('')}</div>` : ''}` : vacio('Todavía no conoces a ningún miembro.');
  } else if (tab === 'presencia') {
    main = idsLugares.length ? `<div class="grid">${idsLugares.map(id => cartaLugar(mL.get(id))).join('')}</div>` : vacio('Todavía no sabes dónde actúan.');
  } else if (idx >= 0 && secs[idx] && secs[idx].texto != null) {
    main = `<article class="cap"><h3>${esc(secs[idx].titulo)}</h3>${md(secs[idx].texto)}</article>`;
  } else {
    const jefes = (f.lideres || []).map(x => mP.get(x.personaje)).filter(Boolean);
    main = `${f.resumen ? md(f.resumen) : vacio('Aún no hay resumen de esta facción.')}
      ${jefes.length ? `<h3>Liderazgo</h3>${jefes.map(p => cartaLider(p)).join('')}` : ''}
      <h3>Miembros conocidos</h3>${gente.length ? `<div class="chips">${gente.map(chipPersona).join('')}</div>` : vacio('Todavía no conoces a ningún miembro.')}
      <h3>Presencia</h3>${idsLugares.length ? `<div class="chips">${idsLugares.map(id => chipLugar(mL.get(id))).join('')}</div>` : vacio('Sin lugares conocidos.')}`;
  }

  const ext = f.estado === 'extinta';
  const datos = `${fila('Tipo', esc(f.tipo))}${ext ? fila('Estado', 'Extinta') : ''}${sede ? fila('Sede', `<a href="${hrefDe('lugar', sede.id)}">${esc(sede.nombre)}</a>`) : ''}
    ${fila('Actitud', esc(ACT[f.actitud] || ACT['sin-datos']))}${fila('Miembros conocidos', String(gente.length))}${reconocido(f.nivel)}`;

  const html = `${migas([{ t: 'Códice', href: '#/' }, { t: 'Facciones', href: '#/facciones' }, { t: f.nombre }])}
    <header class="hero"><div class="hero-t"><h1>${esc(f.nombre)}</h1><p class="cg">${esc(f.tipo)}</p>
      <div class="rw">${ext ? `<span class="pill luto">${ICON.cross}Extinta</span>` : `<span class="pill"><i class="dot a-${esc(f.actitud || 'sin-datos')}"></i>${esc(ACT[f.actitud] || ACT['sin-datos'])}</span>`}${sede ? chipLugar(sede) : ''}</div></div></header>
    ${lista.length ? pestanas(base, lista, tab || '') : ''}
    <div class="gr"><div class="main">${main}</div><aside class="gl hl ib"><h2>Datos</h2>${datos}</aside></div>`;
  return { html, tema: temaFaccion(f), deco: `<div class="deco">${emblema(f)}</div>`, titulo: f.nombre };
}

function vista404() {
  return { html: `${migas([{ t: 'Códice', href: '#/' }, { t: 'No encontrado' }])}
    <div class="empty gl"><p>Esta ficha no existe o todavía no se ha revelado.</p><a class="btn" href="#/">Volver al inicio</a></div>`, tema: temaBase(), titulo: 'No encontrado' };
}

// Router --------------------------------------------------------------

let rutaPrevia = '';

function render() {
  const [a, id, tab] = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  let v;
  if (!a) v = vistaHub();
  else if (['personajes', 'lugares', 'facciones'].includes(a)) v = vistaLista(a);
  else if (a === 'personaje' && mP.has(id)) v = fichaPersonaje(mP.get(id), tab);
  else if (a === 'lugar' && mL.has(id)) v = fichaLugar(mL.get(id), tab);
  else if (a === 'faccion' && mF.has(id)) v = fichaFaccion(mF.get(id), tab);
  else v = vista404();

  const clave = [a, id].join('/');
  const previa = rutaPrevia;
  rutaPrevia = clave;
  const sec = /^personaj/.test(a || '') ? 'personajes' : /^facci/.test(a || '') ? 'facciones' : /^lugar/.test(a || '') ? 'lugares' : 'inicio';

  const aplicar = () => {
    document.querySelectorAll('.nav-extras [data-sec]').forEach(x => {
      if (x.dataset.sec === sec) x.setAttribute('aria-current', 'page'); else x.removeAttribute('aria-current');
    });
    $('#app').setAttribute('style', estilo(v.tema));
    $('#deco').innerHTML = v.deco || '';
    $('#view').innerHTML = v.html;
    document.title = v.titulo === 'Códice' ? 'Códice — Nave Asterión' : `${v.titulo} — Códice`;
    if (v.tras) v.tras();
    ocultarPeek();
    if (clave !== previa) window.scrollTo(0, 0);
  };

  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (document.startViewTransition && previa && !quieto) {
    document.documentElement.dataset.vt = clave === previa ? 'tab' : 'ruta';
    document.startViewTransition(aplicar);
  } else aplicar();
}

// Búsqueda global -----------------------------------------------------

function buscar(q) {
  const t = norm(q).trim();
  if (!t) return [];
  const res = [];
  P.forEach(p => { if (norm(p.nombre + ' ' + p.cargo).includes(t)) res.push({ tipo: 'personaje', id: p.id, t: p.nombre, s: p.cargo, i: ICON.user }); });
  F.forEach(f => { if (norm(f.nombre + ' ' + f.tipo).includes(t)) res.push({ tipo: 'faccion', id: f.id, t: f.nombre, s: f.tipo, i: ICON.flag }); });
  L.forEach(l => { if (norm(l.nombre + ' ' + l.tipo).includes(t)) res.push({ tipo: 'lugar', id: l.id, t: l.nombre, s: cap(l.tipo), i: ICON.pin }); });
  return res.slice(0, 8);
}

function pintarBusqueda(q) {
  const box = $('#qres');
  if (!box) return;
  const res = buscar(q);
  if (!q.trim()) { box.hidden = true; box.innerHTML = ''; return; }
  box.hidden = false;
  box.innerHTML = res.length
    ? res.map(r => `<a href="${hrefDe(r.tipo, r.id)}">${r.i}<span><b>${esc(r.t)}</b><small>${esc(r.s)}</small></span></a>`).join('')
    : '<p class="vacio">Nada coincide con esa búsqueda.</p>';
}

// Vista previa al pasar el ratón -------------------------------------

const peek = () => $('#peek');

function ocultarPeek() { const p = peek(); if (p) p.hidden = true; }

function mostrarPeek(el) {
  const [tipo, id] = el.dataset.peek.split(':');
  let html = '', tema = temaBase();
  if (tipo === 'lugar' && mL.has(id)) {
    const l = mL.get(id), n = contactos(l.id).length, pa = l.padre && mL.get(l.padre);
    tema = temaLugar(l);
    html = `${esfera(l, 40)}<span><b>${esc(l.nombre)}</b><small>${cap(esc(l.tipo))}${pa ? ' en ' + esc(pa.nombre) : ''}</small><em>${n ? `${n} contacto${n === 1 ? '' : 's'} conocido${n === 1 ? '' : 's'}` : 'Sin contactos conocidos'}</em></span>`;
  } else if (tipo === 'faccion' && mF.has(id)) {
    const f = mF.get(id), n = miembros(f.id).length;
    tema = temaFaccion(f);
    html = `<span class="mini-emb">${emblema(f)}</span><span><b>${esc(f.nombre)}</b><small>${esc(f.tipo)}</small><em>${n} miembro${n === 1 ? '' : 's'} conocido${n === 1 ? '' : 's'}</em></span>`;
  } else if (tipo === 'personaje' && mP.has(id)) {
    const p = mP.get(id), l = p.lugar && mL.get(p.lugar), o = !l && p.origen && mL.get(p.origen);
    tema = temaPersona(p);
    const estadoTxt = vivo(p) ? etiquetaActitud(p) : 'Fallecido';
    const gg = gobierna(p);
    html = `${avatar(p)}<span><b>${esc(p.nombre)}</b><small>${esc(p.cargo)}</small><em>${gg && vivo(p) ? esc(gg.gobierno.titulo + ' de ' + gg.nombre) + ', ' : ''}${esc(estadoTxt)}${l ? ' en ' + esc(l.nombre) : o ? ', originario de ' + esc(o.nombre) : ''}</em></span>`;
  } else return;
  const box = peek();
  box.setAttribute('style', estilo(tema));
  box.innerHTML = html;
  box.hidden = false;
  const r = el.getBoundingClientRect(), w = box.offsetWidth, h = box.offsetHeight;
  const x = Math.max(8, Math.min(r.left, window.innerWidth - w - 8));
  const y = r.bottom + h + 12 > window.innerHeight ? Math.max(8, r.top - h - 8) : r.bottom + 8;
  box.style.left = x + 'px';
  box.style.top = y + 'px';
}

// Eventos -------------------------------------------------------------

function eventos() {
  const vista = $('#view');
  vista.addEventListener('click', e => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const acto = b.dataset.act;
    const s = listaActual === 'personajes' ? S.p : listaActual === 'lugares' ? S.l : S.f;
    if (acto === 'lugar') s.l = b.dataset.v;
    else if (acto === 'actitud') s.a = b.dataset.v;
    else if (acto === 'limpiar') { s.q = ''; if ('l' in s) s.l = ''; if ('a' in s) s.a = 'todas'; const i = $('#fq'); if (i) i.value = ''; }
    pintarLista();
  });
  vista.addEventListener('input', e => {
    if (e.target.id === 'fq') {
      const s = listaActual === 'personajes' ? S.p : listaActual === 'lugares' ? S.l : S.f;
      s.q = e.target.value;
      pintarLista();
    } else if (e.target.id === 'q') pintarBusqueda(e.target.value);
  });
  vista.addEventListener('keydown', e => {
    if (e.target.id !== 'q') return;
    if (e.key === 'Escape') { e.target.value = ''; pintarBusqueda(''); }
    if (e.key === 'Enter') { const a = $('#qres a'); if (a) location.hash = a.getAttribute('href'); }
  });
  document.addEventListener('mouseover', e => {
    if (!window.matchMedia('(hover:hover)').matches) return;
    const el = e.target.closest && e.target.closest('[data-peek]');
    if (el) mostrarPeek(el); else ocultarPeek();
  });
  document.addEventListener('focusin', e => { const el = e.target.closest && e.target.closest('[data-peek]'); if (el) mostrarPeek(el); });
  document.addEventListener('focusout', ocultarPeek);
  window.addEventListener('scroll', ocultarPeek, { passive: true });
  window.addEventListener('hashchange', render);
}

async function iniciar() {
  try {
    preparar(await cargarDatos());
  } catch (err) {
    $('#view').innerHTML = '<div class="empty gl"><p>No se pudo cargar el registro. Recarga la página en unos segundos.</p></div>';
    return;
  }
  eventos();
  render();
}

iniciar();
})();
