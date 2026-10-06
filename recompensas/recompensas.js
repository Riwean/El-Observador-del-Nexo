const SELLOS = { capturado: 'CAPTURADO', abatido: 'ABATIDO' };
const tablon = document.getElementById('tablon');
const filtros = document.getElementById('filtros');
const visor = document.getElementById('visor');
const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
let carteles = [];
let filtro = 'todos';

function esc(t) {
  return String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

async function cargar() {
  try {
    const res = await fetch('recompensas.json');
    carteles = (await res.json()).carteles || [];
  } catch (e) {
    tablon.innerHTML = '<div class="aviso">No se pudo cargar el tablón.</div>';
    return;
  }
  pintarFiltros();
  pintar();
  montarEfectos();
}

function pintarFiltros() {
  const emisores = [...new Set(carteles.map(c => c.emisor).filter(Boolean))];
  const opciones = [['todos', 'Todos'], ['activos', 'Activos'], ['cerrados', 'Cerrados']]
    .concat(emisores.map(e => ['emisor:' + e, e]));
  filtros.innerHTML = opciones.map(([v, t]) =>
    `<button type="button" data-f="${esc(v)}" class="${v === filtro ? 'activo' : ''}">${esc(t)}</button>`).join('');
  filtros.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    filtro = b.dataset.f;
    pintarFiltros();
    pintar();
  }));
}

function pasaFiltro(c) {
  if (filtro === 'activos') return c.estado === 'activo';
  if (filtro === 'cerrados') return c.estado !== 'activo';
  if (filtro.startsWith('emisor:')) return c.emisor === filtro.slice(7);
  return true;
}

function pintar() {
  tablon.querySelectorAll('.cartel, .aviso').forEach(n => n.remove());
  const lista = carteles.filter(pasaFiltro);
  if (!lista.length) {
    tablon.insertAdjacentHTML('afterbegin', '<div class="aviso">No hay carteles en este tablón.</div>');
    return;
  }
  lista.forEach((c, i) => tablon.insertBefore(crearCartel(c, i), tablon.children[i] || null));
}

function crearCartel(c, i) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'cartel entrando' + (c.estado !== 'activo' ? ' cerrado' : '');
  b.style.setProperty('--d', (i * 0.15) + 's');
  b.innerHTML =
    (c.nuevo ? '<span class="nuevo">NUEVO</span>' : '') +
    (c.imagen
      ? `<img src="${esc(c.imagen)}" alt="Se busca: ${esc(c.nombre)}, ${esc(c.recompensa)}" loading="lazy">`
      : `<div class="vacio"><div class="t">SE BUSCA</div><div class="n">${esc(c.nombre)}</div></div>`) +
    (SELLOS[c.estado] ? `<div class="sello ${c.estado}">${SELLOS[c.estado]}</div>` : '') +
    `<div class="pie"><b>${esc(c.nombre)}</b><span>${esc(c.recompensa)}</span> · ${esc(c.emisor)}</div>`;
  b.addEventListener('animationend', e => { if (e.animationName === 'clavar') b.classList.remove('entrando'); });
  const sello = b.querySelector('.sello');
  if (sello) sello.addEventListener('animationend', e => {
    if (e.animationName !== 'estampar') return;
    tablon.classList.remove('golpe'); void tablon.offsetWidth; tablon.classList.add('golpe');
  });
  if (c.imagen) b.addEventListener('click', () => abrir(c));
  return b;
}

function abrir(c) {
  document.getElementById('visorImg').src = c.imagen;
  document.getElementById('visorImg').alt = 'Se busca: ' + c.nombre;
  const estado = SELLOS[c.estado] ? SELLOS[c.estado].toLowerCase() : 'activo';
  document.getElementById('visorFicha').textContent =
    `Emisor: ${c.emisor} · Recompensa: ${c.recompensa} · Estado: ${estado}`;
  visor.classList.add('abierto');
}
function cerrar() { visor.classList.remove('abierto'); }
document.getElementById('cerrar').addEventListener('click', cerrar);
visor.addEventListener('click', e => { if (e.target === visor) cerrar(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); });

/* ---------- Ambiente: foco con chispas, tubería con vapor y condensación ---------- */
function montarEfectos() {
  ['foco', 'tuberia', 'grieta', 'colgajo'].forEach(c => {
    const d = document.createElement('div'); d.className = c; tablon.appendChild(d);
  });
  if (sinMovimiento) return;
  setTimeout(chispazo, 2200);
  setInterval(() => bocanada(0.3), 380);
  setTimeout(silbido, 4000);
  goteo(); setTimeout(goteo, 700);
}

function animarYQuitar(el, frames, opciones) {
  el.animate(frames, opciones).onfinish = () => el.remove();
}

// Cada chispa sigue una parábola: sale disparada y cae con gravedad
function chispazo() {
  tablon.classList.remove('parpadea'); void tablon.offsetWidth; tablon.classList.add('parpadea');
  const ox = tablon.clientWidth / 2, oy = 14, n = 10 + Math.floor(Math.random() * 14);
  for (let k = 0; k < n; k++) {
    const c = document.createElement('span');
    c.className = 'chispa'; c.style.left = ox + 'px'; c.style.top = oy + 'px';
    tablon.appendChild(c);
    const vx = (Math.random() - 0.5) * 280, vy = -(40 + Math.random() * 130), t = 0.9 + Math.random() * 0.9, g = 950;
    const frames = [];
    for (let s = 0; s <= 12; s++) {
      const tt = t * s / 12, x = vx * tt, y = vy * tt + 0.5 * g * tt * tt;
      const ang = Math.atan2(vy + g * tt, vx) * 180 / Math.PI - 90;
      frames.push({ transform: `translate(${x}px,${y}px) rotate(${ang}deg)`, opacity: s < 8 ? 1 : 1 - (s - 8) / 4 });
    }
    animarYQuitar(c, frames, { duration: t * 1000 });
  }
  setTimeout(chispazo, 4000 + Math.random() * 7000);
}

function bocanada(fuerza) {
  const grieta = tablon.querySelector('.grieta');
  const v = document.createElement('span');
  v.className = 'vapor';
  v.style.left = (grieta.offsetLeft + 14) + 'px';
  v.style.top = (grieta.offsetTop + 4) + 'px';
  tablon.appendChild(v);
  const dx = (Math.random() - 0.5) * (40 + 90 * fuerza);
  const dy = -(60 + Math.random() * (110 + 280 * fuerza));
  const escala = 2.5 + Math.random() * (2 + 3 * fuerza);
  animarYQuitar(v, [
    { transform: 'translate(0,0) scale(.6)', opacity: 0.9 },
    { transform: `translate(${dx}px,${dy}px) scale(${escala})`, opacity: 0 }
  ], { duration: 1800 + Math.random() * 1800, easing: 'cubic-bezier(.2,.7,.4,1)' });
}

function silbido() {
  const fin = Date.now() + 1800 + Math.random() * 1200;
  (function soplo() { bocanada(1); if (Date.now() < fin) setTimeout(soplo, 55); })();
  setTimeout(silbido, 7000 + Math.random() * 8000);
}

// Las gotas solo nacen donde se ven: ni el inicio ni la primera mitad del recorrido detrás de un cartel
function libre(x, y1, y2) {
  const t = tablon.getBoundingClientRect();
  return [...tablon.querySelectorAll('.cartel')].every(c => {
    const r = c.getBoundingClientRect();
    return x < r.left - t.left - 6 || x > r.right - t.left + 6 || y2 < r.top - t.top || y1 > r.bottom - t.top;
  });
}

function goteo() {
  setTimeout(goteo, 1000 + Math.random() * 1800);
  let x, y, largo, intentos = 0;
  do {
    x = 8 + Math.random() * (tablon.clientWidth - 16);
    y = Math.random() * tablon.clientHeight * 0.7;
    largo = 80 + Math.random() * 240;
  } while (!libre(x, y, y + largo * 0.5) && ++intentos < 20);
  if (intentos >= 20) return;
  largo = Math.min(largo, tablon.querySelector('.grieta').offsetTop - y - 10);
  if (largo < 40) return;
  const dur = 4000 + Math.random() * 5000;
  const r = document.createElement('span');
  r.className = 'rastro'; r.style.left = x + 'px'; r.style.top = y + 'px'; r.style.height = largo + 'px';
  const g = document.createElement('span');
  g.className = 'gota'; g.style.left = x + 'px'; g.style.top = y + 'px';
  tablon.append(r, g);
  // La gota se forma y luego baja a tirones: corre, se para, vuelve a correr
  const paradas = [0, .1, .25, .42, .6, .72, 1], tramo = [0, 0, .22, .22, .55, .55, 1], tam = [0, 1, 1, 1, 1, 1, .8];
  g.animate(paradas.map((o, i) => ({ offset: o, transform: `translateY(${tramo[i] * largo}px) scale(${tam[i]})`, opacity: i === 6 ? 0 : 1 })), { duration: dur, fill: 'forwards' });
  r.animate(paradas.map((o, i) => ({ offset: o, transform: `scaleY(${tramo[i]})` })), { duration: dur, fill: 'forwards' }).onfinish = () => {
    r.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 3000, fill: 'forwards' }).onfinish = () => { r.remove(); g.remove(); };
  };
}

cargar();
