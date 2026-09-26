import { cargar, ruta, esc, cr, chip, montarFx, pie, estadoFase, progresoFase, estadoZona, fasesEnCurso, saldoFondo, ESTADO_FASE } from './common.js';

const [plan, cuentas, zon] = await Promise.all([cargar('data/plan.json'), cargar('data/cuentas.json'), cargar('data/zonas.json')]);
const mes = plan.mesActual;
const total = plan.duracionMeses;

montarFx();
pie(plan.ejemplo ? 'Cuentas de ejemplo. Edita data/plan.json y data/cuentas.json.' : 'Plan Quinquenal de Desarrollo de Herrumbre');

const $ = (id) => document.getElementById(id);

// Hero
$('hero-img').style.backgroundImage = `url(${ruta('img/aereo-f5.webp')})`;
$('hero-lead').textContent = plan.resumen;

// Estadísticas
const activas = fasesEnCurso(plan);
const principal = activas[activas.length - 1];
const permanentes = zon.zonas.filter((z) => z.hasta == null);
const operativas = permanentes.filter((z) => estadoZona(z, plan.fases, mes) === 'operativa').length;
const enObra = permanentes.filter((z) => estadoZona(z, plan.fases, mes) === 'en-obra').length;
const saldo = saldoFondo(cuentas, 'reconstruccion', mes);

$('stats').innerHTML = [
  ['FASE ACTUAL', activas.map((f) => f.romano).join(' · '), principal.nombre, true],
  ['MES DEL PLAN', `${mes} / ${total}`, `Año ${Math.floor(mes / 12) + 1} de ${total / 12}`],
  ['CIUDADANOS', cr(plan.poblacion.actual), `unos ${cr(plan.poblacion.inicial)} antes de la anexión`],
  ['SALDO DEL FONDO', `${cr(saldo)} <small>${esc(cuentas.moneda)}</small>`, 'Fondo de Reconstrucción'],
  ['ZONAS OPERATIVAS', `${operativas} / ${permanentes.length}`, `${enObra} en obra`]
].map(([l, v, s, acc], i) => `
  <div class="stat hud rise" style="animation-delay:${1.0 + i * 0.15}s">
    <div class="mono-l">${l}</div>
    <div class="stat__v flick${acc ? ' is-acc' : ''}" style="animation-delay:${1.6 + i * 0.15}s">${v}</div>
    <div class="stat__s">${esc(s)}</div>
  </div>`).join('');

// Cronograma
const ticks = [];
for (let m = 0; m <= total; m += 12) ticks.push(m);
$('gantt').innerHTML = `
  <div class="gantt__axis"><span></span><div class="gantt__ticks">${ticks.map((m) => `<i style="left:${(m / total) * 100}%">Año ${m / 12}</i>`).join('')}</div></div>
  ${plan.fases.map((f) => {
    const e = estadoFase(f, mes);
    const p = progresoFase(f, mes) * 100;
    return `<div class="gantt__row">
      <a class="gantt__lab" href="${ruta('mapa/index.html')}?fase=${f.id}"><b>${f.romano}</b> ${esc(f.nombre)}</a>
      <div class="gantt__track">
        <div class="gantt__bar is-${e}" style="left:${(f.desde / total) * 100}%;width:${((f.hasta - f.desde) / total) * 100}%"><i style="width:${p}%"></i><span>${esc(f.mesesTxt)}</span></div>
      </div>
    </div>`;
  }).join('')}
  <div class="gantt__now" style="--x:${mes / total}"><span>Mes ${mes}</span></div>`;

// Fases
$('fases').innerHTML = plan.fases.map((f, i) => {
  const e = estadoFase(f, mes);
  const p = Math.round(progresoFase(f, mes) * 100);
  return `<article class="fase hud rise is-${e}" style="animation-delay:${0.2 + i * 0.1}s">
    <div class="fase__top"><span class="mono-l">FASE ${f.romano} · ${esc(f.mesesTxt)}</span>${chip(ESTADO_FASE[e].txt, ESTADO_FASE[e].clase)}</div>
    <h3>${esc(f.nombre)}</h3>
    <div class="fase__proy">${esc(f.proyecto)}</div>
    <p>${esc(f.resumen)}</p>
    <ul>${f.hitos.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
    <div class="fase__bot">
      <div class="prog"><i class="${e === 'en-curso' ? 'is-stripes' : ''}" style="width:${p}%"></i></div>
      <div class="fase__row"><span class="mono-l">${p} %</span><a href="${ruta('mapa/index.html')}?fase=${f.id}">Ver en el mapa →</a></div>
    </div>
  </article>`;
}).join('');

// Flujo
$('flujo').innerHTML = plan.flujo.map((s, i) => `
  <div class="flujo__paso rise" style="animation-delay:${0.15 * i}s"><span class="mono-l">0${i + 1}</span><b>${esc(s.titulo)}</b><p>${esc(s.texto)}</p></div>
  ${i < plan.flujo.length - 1 ? '<div class="flujo__flecha" aria-hidden="true"></div>' : ''}`).join('');

$('portal-mapa').style.setProperty('--thumb', `url(${ruta('img/mapa-f5.webp')})`);
