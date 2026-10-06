const contenedor = document.getElementById('salas');
const ficha = document.getElementById('ficha');

function esc(t) {
  return String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

async function cargar() {
  let salas;
  try {
    const res = await fetch('reliquias.json');
    salas = (await res.json()).salas || [];
  } catch (e) {
    contenedor.innerHTML = '<div class="aviso">No se pudo cargar el registro.</div>';
    return;
  }
  contenedor.innerHTML = '';
  let i = 0;
  salas.forEach(sala => {
    const h2 = document.createElement('h2');
    h2.textContent = sala.titulo;
    const grid = document.createElement('div');
    grid.className = 'vitrinas';
    sala.reliquias.forEach(r => grid.appendChild(crearVitrina(r, sala.portador, i++)));
    contenedor.append(h2, grid);
  });
}

// Si la imagen aún no existe, la vitrina enseña un rótulo en su lugar
function pintarObjeto(objeto, r) {
  objeto.innerHTML = '';
  if (!r.imagen) { objeto.innerHTML = '<span class="pendiente">Imagen pendiente</span>'; return; }
  const img = document.createElement('img');
  img.src = r.imagen;
  img.alt = r.nombre;
  if (r.fondoNegro) img.className = 'fondo-negro';
  img.onerror = () => { objeto.innerHTML = '<span class="pendiente">Imagen pendiente</span>'; };
  objeto.appendChild(img);
}

function decorar(caja, motas) {
  ['sombra', 'brillo'].forEach(c => {
    const d = document.createElement('div'); d.className = c; caja.appendChild(d);
  });
  for (let k = 0; k < motas; k++) {
    const m = document.createElement('span');
    m.className = 'mota';
    m.style.left = (35 + Math.random() * 30) + '%';
    m.style.setProperty('--dx', (Math.random() * 30 - 15) + 'px');
    m.style.animationDuration = (4 + Math.random() * 5) + 's';
    m.style.animationDelay = (-Math.random() * 8) + 's';
    caja.appendChild(m);
  }
}

function crearVitrina(r, portador, i) {
  const v = document.createElement('button');
  v.type = 'button';
  v.className = 'vitrina';
  v.innerHTML = `<div class="caja"><div class="objeto"></div></div><div class="peana"></div>` +
    `<span class="placa">${esc(r.nombre)}</span>`;
  const caja = v.querySelector('.caja');
  caja.style.setProperty('--d', (i * 0.3) + 's');
  pintarObjeto(v.querySelector('.objeto'), r);
  decorar(caja, 7);

  // Inclinación 3D hacia el ratón; en pantallas táctiles no hay cursor que seguir
  v.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const b = caja.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
    caja.style.transform = `rotateY(${(x - 0.5) * 18}deg) rotateX(${(0.5 - y) * 14}deg)`;
    caja.style.setProperty('--mx', x * 100 + '%');
    caja.style.setProperty('--my', y * 100 + '%');
  });
  v.addEventListener('pointerleave', () => { caja.style.transform = ''; });
  v.addEventListener('click', () => abrir(r, portador));
  return v;
}

const cajaFicha = document.getElementById('fCaja');
decorar(cajaFicha, 12);
const escaner = document.createElement('div');
escaner.className = 'escaner';
cajaFicha.appendChild(escaner);

function abrir(r, portador) {
  pintarObjeto(document.getElementById('fObjeto'), r);
  document.getElementById('fNombre').textContent = r.nombre;
  const enlace = document.getElementById('fPortador');
  enlace.textContent = portador ? portador + ' → legajo' : '—';
  enlace.style.pointerEvents = portador ? '' : 'none';
  document.getElementById('fDatos').innerHTML = Object.entries(r.datos || {})
    .map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');
  document.getElementById('fTexto').textContent = r.texto || '';
  ficha.classList.remove('abierta'); void ficha.offsetWidth;
  ficha.classList.add('abierta');
}
function cerrar() { ficha.classList.remove('abierta'); }
document.getElementById('cerrar').addEventListener('click', cerrar);
ficha.addEventListener('click', e => { if (e.target === ficha) cerrar(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); });

cargar();
